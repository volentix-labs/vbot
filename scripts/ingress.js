const ingressOn = require('./kube/server/ingress-on.json');
const ingressOff = require('./kube/server/ingress-off.json');
const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const developers = process.env.DEVELOPERS.split(",");
    const superusers = process.env.SUPERUSERS.split(",");

    robot.respond(/turn (.*) admin (.*)/i, function(res) {
        const name          =  res.envelope.user.name;
        const environment   = res.match[1];
        const toggle        = res.match[2];

        if(!developers.includes(name)) {
            res.send("Sorry " + name + ". I'm afraid I can't let you do that.");
        } else if (environment === 'prod' && !superusers.includes(name)) {
            res.send("Sorry " + name + ". I'm afraid I can't let you do that.");
        } else if (environment !== 'dev' && environment !== 'uat' && environment !== 'perf'&& environment !== 'prod') {
            const error = 
                environment + " is NOT a known environment.\n" +
                "Supported ENVs: \n" +
                "================ \n" +
                "  1.dev\n" +
                "  2. uat\n" +
                "  3. perf\n" +
                "  4. prod\n";
            res.send(error);
        } else if (toggle !== 'on' && toggle !== 'off') {
            const error = 
                toggle + " is NOT a known\n" +
                "Supported: \n" +
                "================ \n" +
                "  1. on\n" +
                "  2. off\n";

            res.send(error);
        } else {
            var ingress = {};
            if (toggle === 'on') {
                ingress = ingressOn;
            } else {
                ingress = ingressOff;
            }
            ingress.metadata.namespace = 'venue-' + environment;
            if (environment === 'prod') {
                //change this once the DNS us rerouted.
                // ingress.spec.rules[0].host = 'venue.volentix.io';
                ingress.spec.rules[0].host = 'venue.volentix.io';
            } else {
                ingress.spec.rules[0].host = 'venue-' + environment +'.volentix.io';
            }
            (async () => {                
                const createperf = await client.apis.extensions.v1beta1.namespaces('venue-' + environment).ingresses('venue-django-ing').put({ body: ingress});
                res.send("UI: Please check that the update has been successful.");
            })();
        }
    });
}
