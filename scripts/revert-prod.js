const serverDeployment = require('./server.json');
const uiDeployment = require('./ui.json');
const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const superusers = process.env.SUPERUSERS.split(",");

    robot.respond(/revert prod (.*) to version (.*)/i, function(res) {
        const name =  res.envelope.user.name;
        const servicename = res.match[1];
        const version = res.match[2];

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

                    uiDeployment.metadata.namespace = "venue-prod";
                    uiDeployment.spec.template.spec.containers[0].image = "volentixlabs/venueui:" + version;
                    const createuat = await client.apis.apps.v1beta1.namespaces('venue-prod').deployments( 'venue-ui-service').put({ body: uiDeployment })
                    res.send("UI: Please check that the update has been successful.");
                })();
            } else {
                (async () => {
                    serverDeployment.metadata.namespace = "venue-prod";
                    serverDeployment.spec.template.spec.containers[0].image = "volentixlabs/venueserver:" + version;
                    const create = await client.apis.extensions.v1beta1.namespaces('venue-prod').deployments( 'venue-deployment').put({ body: serverDeployment })
                    res.send("Server: Please check that the update has been successful.");
                })();
            }
        }
    });
}
