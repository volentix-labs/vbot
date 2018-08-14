const request = require('request');
const Client = require('kubernetes-client').Client;
const config = require('kubernetes-client').config;
const client = new Client({ config: config.getInCluster() });
client.loadSpec();

module.exports = function(robot) {

    const about =
        'About\n' +
        '=====\n.' +
        '\n' +
        'Get Dockerhub Verions\n' +
        '---------------------\n' +
        'vbot <NAME> docker versions\n' +
        'Args:\n' +
        '\tNAME: (venueserver | venueui) This is the name of the repository in Dockerhub for volentixlabs.' +
        '\n.\n' +

        'List All Versions\n' +
        '---------------------\n' +
        'vbot list all <COMPONENT> versions\n' +
        'Args:\n' +
        '\tNAME: (server | ui) The component we want the versions of.' +
        'Desc: Lists the version running in all the environments for the component.' +
        '\n.\n' +

        'Get Versions Running In Environment\n' +
        '-----------------------------------\n' +
        'vbot get <COMPONENT> version in <ENV>\n' +
        'Args:\n' +
        '\tCOMPONENT: (server | ui) This is the component we are seeking.\n' +
        '\tENV:       (dev | uat | prod) This is the environment from which we wish to glean the information.\n.\n' +

        'Promote Dev\n' +
        '---------------------\n' +
        'vbot promote dev <COMPONENT>\n' +
        'Args:\n' +
        '\tNAME: (server | ui) The component we want to promote.' +
        'Desc: Promotes the COMPONENT from dev to uat and perf. Note that developers can do this.' +
        '\n.\n' +

        'Promote Prod\n' +
        '---------------------\n' +
        'vbot promote prod <COMPONENT>\n' +
        'Args:\n' +
        '\tNAME: (server | ui) The component we want to promote.' +
        'Desc: Promotes the COMPONENT from uat to prod. Only admins and superusers can do this.' +
        '\n.\n' +

        'Deploy A Version In An Environment\n' +
        '----------------------------------\n' +
        'vbot deploy version <VERSION> of <COMPONENT> in <ENV>\n' +
        'Args:\n' +
        '\VERSION:    (server | ui) This is the component we are seeking.\n' +
        '\tCOMPONENT: (server | ui) This is the component we are seeking.\n' +
        '\tENV:       (uat) ONLY SUPPORTS UAT FOR NOW: This is the environment from which we wish to glean the information.\n.\n';

    robot.respond(/about/i, function(res) {
        (async () => {
            const deploy = await client.apis.apps.v1.namespaces('vbot').deployments('vbot-deployment').get()
            const message = about + '\n\nCurrent version of the vbot: ' + deploy.body.spec.template.spec.containers[0].image;
            res.send(message);
        })();
    });
}
