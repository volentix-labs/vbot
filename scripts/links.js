const request = require('request');

module.exports = function(robot) {

    const repos =
        'Repos\n' +
        '=====\n.' +
        '\n' +

        'venue-server: https://github.com/Volentix/venue-server \n' +
        'venue-client: https://github.com/Volentix/venue-client \n' +
        'ledger: https://github.com/Volentix/ledger\n' + 
        'ezeos: https://github.com/Volentix/ezeos\n';
        

    robot.respond(/links/i, function(res) {
        res.send(repos);
    });
}
