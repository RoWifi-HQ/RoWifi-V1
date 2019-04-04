const Discord = require('discord.js')

const Task = {
    Success: [0, 255, 0],
    Failure: [255, 0, 0],
    Process: [0, 0, 255]
}

/**
 * 
 * @param {string} service Service Name
 * @param {Discord.GuildChannel} channel Channel for the embed to be sent to
 * @param {string} status Status of the task
 * @param {Array} fields Text to be sent 
 */
function EmbedMessage(service, status, fields) {
    let embed = new Discord.RichEmbed()
        .setTitle(service)
        .setTimestamp()
        .setFooter('tensor_core')
        .setColor(Task[status])
    for (let field of fields) {
        embed.addField(field.name, field.value)
    }
    return embed
}     

module.exports = {EmbedMessage}