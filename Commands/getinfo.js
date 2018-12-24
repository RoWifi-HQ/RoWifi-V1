var Roblox = require('./../Utilities/Roblox')
var Database = require('./../Utilities/Database')
const Discord = require('discord.js');

module.exports = {
    name: 'getinfo',
    description: 'Get the informaation of the user',
    execute: async(message, args, client) => {
        let embed = new Discord.RichEmbed()
        .setTitle('[SAF] Swedish Armed Forces')
        .setTimestamp()
        .setFooter('tensor_core');
        let arg = message.guild.member(message.mentions.users.first()) || message.member;
        let User = await Database.GetUser(arg.id);
        if (!User) {
           return; 
        }
        let Group = await Database.GetGroup(message.guild.id);
        let Rank = await Roblox.GetGroupRole(User.RobloxId, Group.GroupId)
        embed.addField('Rank', Rank);
        let Subgroups = Group.Subgroups;
        let string = '';
        for (const key in Subgroups) {
            if (Subgroups.hasOwnProperty(key)) {
                const Subgroup = Subgroups[key];
                let SubRank = await Roblox.GetGroupRole(User.RobloxId, key);
                if(SubRank != 'Guest') {
                    let role = message.guild.roles.find(r => r.id === Subgroup);
                    string += `- <@&${Subgroup}>\n`;
                    string += ` ${SubRank}\n\n`;
                }
            }
        }
        string = (string == '') ? 'None' : string;
        embed.addField('Regiments', string);
        message.channel.send('', {embed})
    }
}