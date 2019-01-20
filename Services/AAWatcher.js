let rbx = require('noblox.js');
let Database = require('./../Utilities/Database')

module.exports = {
    'WatchAA': async function (Guild) {
        let Group = await Database.GetGroup(Guild.id);
        let channel = Guild.channels.find(c => c.id === Group.Logs);
        var previous = {};
        console.log("Audit Logs set up for " + Group.GroupId);
        setInterval(async function() {
            let audit = await rbx.getAuditLog(Group.GroupId, 1, 6);
            let log = audit.logs[0];
            if (previous != log.text) {
                channel.send(log.text);
                previous = log.text;
            }
        }, 60000);
    }
}