const request = require('request');

module.exports = function(robot) {

    const superusers = process.env.SUPERUSERS.split(",");
    console.log(superusers);

    robot.respond(/(.*) versions/i, function(res) {
        var name =  res.envelope.user.name;
        var servicename = res.match[1];
        if(!superusers.includes(name)) {
            res.send("Sorry " + name + ". I'm afraid I can't let you do that.");
        } else if (servicename !== 'venueserver' && servicename !== 'venueui') {
            const error = 
                servicename + " is NOT a known repo.\n" +
                "Supported Repos: \n" +
                "================ \n" +
                "  1. venueserver\n" +
                "  2. venueui\n";
            res.send(error);
        } else {
            request("https://hub.docker.com/v2/repositories/volentixlabs/" + servicename +"/tags/", { json: true }, function (err, r, body) {
                var versionInformation = 
                    "Latest Version\n" +
                    "=============\n" +
                    body.results[0].name + " Created On: " + body.results[0].last_updated + "\n\n" +
                    "Last Two Versions\n" +
                    "=================\n" +
                    body.results[1].name + " Created On: " + body.results[1].last_updated + "\n" +
                    body.results[2].name + " Created On: " + body.results[2].last_updated + "\n";
                res.send(versionInformation);
            });
        }
    });
}
