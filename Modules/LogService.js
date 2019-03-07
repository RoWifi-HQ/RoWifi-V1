var Discord = require('discord.js')
var config = require('../config.json')
var Logger = new Discord.WebhookClient(config.logger_id, config.logger_token);

async function Log(Message) {
    await Logger.send(Message);
}

module.exports = {Log}