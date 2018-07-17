const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const superusers = process.env.SUPERUSERS.split(",");

    robot.respond(/get (.*) version in (.*)/i, function(res) {
        const name =  res.envelope.user.name;
        const servicename = res.match[1];
        const env = res.match[2];
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
        } else if (env !== 'dev' && env !== 'uat' && env !== 'prod') {
            const error = 
                servicename + " is NOT a known namespace (env).\n" +
                "Supported Namespaces: \n" +
                "================ \n" +
                "  1. dev\n" +
                "  2. uat\n" +
                "  3. prod\n";
            res.send(error);
        } else {
            (async () => {
                var deploymentName = "venue-ui-service";
                if ( servicename === 'server') {
                    deploymentName = 'venue-deployment';
                }
                const deploy = await client.apis.apps.v1.namespaces('venue-' + env).deployments(deploymentName).get()
                res.send("Venue-deployment:\n" + deploy.body.spec.template.spec.containers[0].image);
            })();
        }
    });
}
