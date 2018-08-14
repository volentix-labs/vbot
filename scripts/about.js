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
        
        'List All Versions\n' +
        '---------------------\n' +
        'vbot list <COMPONENT> versions\n' +
        'Args:\n' +
        '\tNAME: (server | ui) The component we want the versions of.' +
        'Desc: Lists the version running in all the environments for the component.' +
        '\n.\n' +

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

        'Revert UAT & PERF\n' +
        '----------------------------------\n' +
        'vbot revert uat <COMPONENT> to version <VERSION>\n' +
        'Args:\n' +
        '\tCOMPONENT: (server | ui) This is the component we are seeking.\n' +
        '\VERSION:    (server | ui) This is the component we are seeking.\n' +
        'Desc: Revert the component to a specific version in uat and perf. Note that developers can do this.' +
        '\n.\n' +

        'Revert PROD\n' +
        '----------------------------------\n' +
        'vbot revert prod <COMPONENT> to version <VERSION>\n' +
        'Args:\n' +
        '\tCOMPONENT: (server | ui) This is the component we are seeking.\n' +
        '\VERSION:    (server | ui) This is the component we are seeking.\n' +
        'Desc: Revert the component to a specific version in prod. Note that only superusers can perform this action.';
        

    robot.respond(/about/i, function(res) {
        (async () => {
            const deploy = await client.apis.apps.v1.namespaces('vbot').deployments('vbot-deployment').get()
            const message = about + '\n\nCurrent version of the vbot: ' + deploy.body.spec.template.spec.containers[0].image;
            res.send(message);
        })();
    });
}
