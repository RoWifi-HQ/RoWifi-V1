const {Command} = require('discord.js-commando')
let Roblox = require('./../../Utilities/Roblox')
let Database = require('./../../Utilities/Database')
let Extensions = require('../../Utilities/DiscordExtensions')

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
                    prompt: 'Enter the Id of the Roblox Group you wish to bind to this server.\n',
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
        Group.GroupId = groupId
        let success = await Database.SaveGuild(message.guild.id, Group)
        if (success) {
            return message.channel.send("", Extensions.EmbedMessage("Group Service", "Success", 
                [
                    {name: "Success", value: `Guild has successfully been linked to ${Group.Name}`}
                ]
            ))
        }
        else {
            return message.channel.send("", Extensions.EmbedMessage("Group Service", "Failure", 
                [
                    {name: "Failure", value: `There has been an error in adding ${Group.Name}. Please try again. If the error persists, please contact @Gautam.A#9539.`}
                ]
            ))
        }
    }
}