const {Command} = require('discord.js-commando')
let Discord = require('discord.js')
let Roblox = require('./../../Utilities/Roblox')
let Database = require('./../../Utilities/Database')
let Extensions = require('../../Utilities/DiscordExtensions')

module.exports = class SetSubgroupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bind-subgroup',
            group: 'group',
            memberName: 'bind-subgroup',
            description: 'Adds a new role bind for a subgroup to the guild.',
            guildOnly: true
        })
    }

    hasPermission(msg) {
        return msg.guild.ownerID == msg.author.id || this.client.isOwner(msg.author)
    }

    async run(message) {
        //Get the Group from the database.
        //Get the group id from the user.
        //Check if group exists.
        //Get the role to be binded to.
        //Add the subgroup to the table.
        //Save the group to the database.
    }
}