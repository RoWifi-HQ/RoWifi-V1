const {Command} = require('discord.js-commando')
let Discord = require('discord.js')
let Roblox = require('./../../Utilities/Roblox')
let Database = require('./../../Utilities/Database')
let Extensions = require('../../Utilities/DiscordExtensions')

module.exports = class SetGroupRoleCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bind-role',
            group: 'group',
            memberName: 'bind-role',
            description: 'Adds a new role bind to the guild.',
            guildOnly: true
        })
    }

    hasPermission(msg) {
        return msg.guild.ownerID == msg.author.id || this.client.isOwner(msg.author)
    }

    async run(message) {
        // Get the Group from the Database
        let Group = await Database.GetGroup(message.guild.id)

        //Check if Group exists in the database
        if (!Group.GroupId) {
            return await message.channel.send("Group does not exist in the database. Please add your group to the database using !setgroup.")
        }

        //Get the roblox rank id from the user
        await message.channel.send("Enter the id of the Roblox Group Rank you wish to bind.")
        let author = message.author
        let collected = await message.channel.awaitMessages(m => m.author == author, {max: 1, time: 300000, errors: ['time']})
        let rank = collected.first(1)[0].content

        //Check if rank exists or is not a number
        if (!rank || isNaN(rank)) {
            let embed = Extensions.EmbedMessage("Group Administration", "Failure",
                [{name: "Binding Failed", value: "Invalid Rank Id. Try again."}]
            )
            return await message.channel.send("", {embed})
        }

        //Get the roles to be binded from the user in the form of mentions
        await message.channel.send("Tag the roles you wish to bind.")
        let collectedRoles = await message.channel.awaitMessages(m => m.author == author, {max: 1, time: 300000, errors: ['time']}).catch(async function(err) {
            return await message.channel.send("Timeout reached. Please try again.")
        })

        //Get the new prefix from the user.
        await message.channel.send("Enter the prefix you wish to set for the role. Say ```cancel``` if you wish to keep it the same or not set one.")
        let collectedPrefix = await message.channel.awaitMessages(m => m.author == author, {max: 1, time: 300000, errors: ['time']}).catch(async function(err) {
            return await message.channel.send("Timeout reached. Please try again.")
        })
        let prefix = collectedPrefix.first(1)[0].content

        //Check if any roles in the mentions.
        let roles = Array.from(collectedRoles.first(1)[0].mentions.roles.values())
        if (roles.length == 0) {
            return await message.channel.send("Invalid roles. Please try again.")
        }
        roles = roles.map(r => r.id)

        //Add Rolebinds to the Group table.
        rank = rank.toString()
        Group.RankBinds[rank] = Group.RankBinds[rank] || {"RoleBinds": [], "Nickname": ""}
        roles.forEach(element => {
            Group.RankBinds[rank].RoleBinds.push(element)
            if (!Group.AllBinds.includes(element)) {
                Group.AllBinds.push(element) 
            }
        });
        if (prefix != "cancel") {
            Group.RankBinds[rank].Nickname = prefix
        }
        
        //Save the modified guild to the database.
        let success = await Database.SaveGuild(message.guild.id, Group)
        if (success) {
            return message.channel.send("", Extensions.EmbedMessage("Group Service", "Success", 
                [
                    {name: "Success", value: `Roles have been successfully linked to the role.`}
                ]
            ))
        }
        else {
            return message.channel.send("", Extensions.EmbedMessage("Group Service", "Failure", 
                [
                    {name: "Failure", value: `There has been an error in binding roles. Please try again. If the error persists, please contact @Gautam.A#9539.`}
                ]
            ))
        }
    }
}    