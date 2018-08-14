const uatServerDeployment = require('./uat-server.json');
const uatUiDeployment = require('./uat-ui.json');
const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const superusers = process.env.SUPERUSERS.split(",");

    robot.respond(/promote dev (.*)/i, function(res) {
        const name =  res.envelope.user.name;
        const servicename = res.match[1];

        if(!superusers.includes(name)) {
            res.send("Sorry " + name + ". I'm afraid I can't let you do that.");
        } else if (servicename !== 'server' && servicename !== 'ui') {
            const error = 
                servicename + " is NOT a known deployment.\n" +
                "Supported Repos: \n" +
                "================ \n" +
                "  1. server\n" +
                "  2. ui\n";
            res.send(error);
        } else {
            if (servicename === 'ui') {
                (async () => {
                    
                    const devui = await client.apis.apps.v1.namespaces('venue-dev').deployments('venue-ui-service').get();
                    uatUiDeployment.spec.template.spec.containers[0].image = devui.body.spec.template.spec.containers[0].image;
                    const create = await client.apis.apps.v1beta1.namespaces('venue-uat').deployments( 'venue-ui-service').put({ body: uatUiDeployment })
                    res.send("UI: Please check that the update has been successful.");
                })();
            } else {
                (async () => {

                    const devserver = await client.apis.apps.v1.namespaces('venue-dev').deployments('venue-deployment').get();
                    uatServerDeployment.spec.template.spec.containers[0].image = devserver.body.spec.template.spec.containers[0].image;
                    const create = await client.apis.extensions.v1beta1.namespaces('venue-uat').deployments( 'venue-deployment').put({ body: uatServerDeployment })
                    res.send("Server: Please check that the update has been successful.");
                })();
            }
        }
    });
}