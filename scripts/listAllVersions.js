const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const superusers = process.env.SUPERUSERS.split(",");

    robot.respond(/list all (.*) versions/i, function(res) {
        const name =  res.envelope.user.name;
        const servicename = res.match[1]; 
        if (servicename !== 'server' && servicename !== 'ui') {
            const error = 
                servicename + " is NOT a known deployment.\n" +
                "Supported Repos: \n" +
                "================ \n" +
                "  1. server\n" +
                "  2. ui\n";
            res.send(error);
        } else {
            (async () => {
                var deploymentName = "venue-ui-service";
                if ( servicename === 'server') {
                    deploymentName = 'venue-deployment';
                }
                const devv = await client.apis.apps.v1.namespaces('venue-dev').deployments(deploymentName).get();
                const uat = await client.apis.apps.v1.namespaces('venue-uat').deployments(deploymentName).get();

                
                
                const message = 
                    "Venue " + servicename + " versions\n" +
                    "DEV: " + devv.body.spec.template.spec.containers[0].image + "\n" +
                    "UAT: " + uat.body.spec.template.spec.containers[0].image + "\n";

                res.send(message);
            })();
        }
    });
}
