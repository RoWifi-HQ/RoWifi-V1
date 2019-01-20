var Roblox = require('./../Utilities/Roblox')
var Database = require('./../Utilities/Database')
const {Command} = require('discord.js-commando');

module.exports = class GetInfoCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'getinfo',
            group: 'roblox',
            memberName: 'getinfo',
            description: 'Gets the Information regarding the user',
            guildOnly: false,
        })
    }
    async run (message) {
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
        return message.embed(embed);
    }
}