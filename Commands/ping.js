var Roblox = require('./../Utilities/Roblox')
var Database = require('./../Utilities/Database')

module.exports = {
    name: 'ping',
    description: 'Get the current ping of the bot',
    execute: async(message, args, client) => {
        const m = await message.channel.send("Ping?");
        m.edit(`Latency - ${m.createdTimestamp - message.createdTimestamp}ms.\nAPI Latency - ${Math.round(client.ping)}ms`);
    }
}