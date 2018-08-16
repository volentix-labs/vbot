const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const help =
        'Commands\n' +
        '=====\n.' +
        '\n' +
        'vbot links\n' +
        'vbot list (server | ui) versions\n' +
        'vbot promote (dev | uat) (server | ui)\n' +
        'vbot revert (uat | prod) (server | ui) to version (DOCKER_VERSION_NUMBER)\n' + 
        'vbot turn (dev | uat | perf) admin (on | off)\n';
        

    robot.respond(/help/i, function(res) {
        (async () => {
            const deploy = await client.apis.apps.v1.namespaces('vbot').deployments('vbot-deployment').get()
            const message = help + '\n\nCurrent version of the vbot: ' + deploy.body.spec.template.spec.containers[0].image;
            res.send(message);
        })();
    });
}
