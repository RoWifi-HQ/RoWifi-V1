const {Command} = require('discord.js-commando')
let Roblox = require('./../../Utilities/Roblox')
let Database = require('./../../Utilities/Database')

module.exports = class SetGroupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bind-group',
            group: 'group',
            memberName: 'bind-group',
            description: 'Binds the discord server to the roblox group',
            guildOnly: true,
            args: [
                {
                    key: 'groupId',
                    prompt: 'Enter the Id of the Roblox Group you wish to bind to this server',
                    type: 'string'
                }
            ]
        })
    }

    hasPermission(msg) {
        return msg.guild.ownerID == msg.author.id || this.client.isOwner(msg.author)
    }

    async run(message, {groupId}) {
        let Group = await Roblox.GetGroup(groupId);
        if (!Group) {
            return message.send("Group does not exist");
        }
        let success = await Database.ModifyRobloxGroup(message.guild.id, Group.Id)
        if (success) {
            
        }
    }
}