var Roblox = require('./../Utilities/Roblox')
var Database = require('./../Utilities/Database')
var rbx = require('noblox.js');
var update = require('./update')
var Discord = require('discord.js')

function CheckPermission(member, PromoteMax) {
    if (member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
        return 130;
    }
    let roles = member.roles.map(r => r.id);
    for (let role of roles) {
        if (PromoteMax[role]) {
            return PromoteMax[role];
        }
    }
    return false;
}

module.exports = {
    name: 'promote',
    description: 'Promotes user',
    execute: async (message, args) => {
        let Group = await Database.GetGroup(message.guild.id);
        let MaxRank = CheckPermission(message.member, Group.PromoteMax);
        if (!MaxRank) {
            message.reply('You do not have permissions to promote')
            return
        }
        let arg = message.guild.member(message.mentions.users.first());
        if (!arg) {
            message.reply('Mention someone to promote');
            return;
        }
        let User = await Database.GetUser(arg.id);
        if (!User) {
            message.reply('Cannot promote user. User not verified.');
            return;
        }
        if (!args[1]) {
            message.reply('Please input a number to rank the user to.') 
            return;   
        }
        let newRank = parseInt(args[1]);
        if (isNaN(newRank)) {
            message.reply('Please input a number to rank the user to.') 
            return;
        }
        let Rank = await Roblox.GetGroupRank(User.RobloxId, Group.GroupId);
        if (Rank <= MaxRank && newRank <= MaxRank) {
            let embed = new Discord.RichEmbed()
               .setTitle('Promotion Service')
               .setTimestamp()
               .setFooter('tensor_core');
            rbx.setRank(Group.GroupId, User.RobloxId, newRank)
            .then(async function() {
                console.log('Promoted successfully');
                embed.addField('Successful', `Promoted ${arg.toString()} successfully`).setColor([0, 255, 0])
                message.reply('', {embed})
                await update.execute(message, args);
            })
            .catch(async function(err) {
                console.log(err);
                embed.addField('Failed!', `Failed to promote ${arg.mention}`).setColor([255, 0, 0])
                message.reply('', {embed})
            }) 
        } else {
            message.reply('You do not have permission to promote this user');
        }
    }
}