const fetch = require('node-fetch');
var Database = require('../../Utilities/Database.js');
const {Command} = require('discord.js-commando');
let Roblox = require('../../Utilities/Roblox.js')
const Discord = require('discord.js')

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'roblox',
            memberName: 'update',
            description: 'Update Guild Roles',
            guildOnly: true
        })
    }        
    async run(message){
        let embed = new Discord.RichEmbed()
        .setTitle('Update Process')
        .setTimestamp()
        .setFooter('tensor_core');
        //if (message.member.permissions.has('ADMINISTRATOR')) return;
        let arg = message.guild.member(message.mentions.users.first()) || message.member;
        let roles = arg.roles;
        let User = await Database.GetUser(arg.id);
        console.log(User);
        let Group = await Database.GetGroup(message.guild.id);
        let Remove = Group['AllBinds'];
        let Subgroups = Group.Subgroups
        if(User) {
            let Rank = await Roblox.GetGroupRank(User.RobloxId, Group.GroupId);
            if (Rank > 0) {
                let Bind = Group.RankBinds[Rank];
                console.log(Rank, Bind);
                if (!Bind) {
                    return;
                }
                for (let i = 0; i < Remove.length; i++ ) {
                    if (Bind.RoleBinds.includes(Remove[i])) {
                        if (!roles.has(Remove[i])) 
                            await arg.addRole(Remove[i]).catch(err => console.log(err));
                    } else {
                        if (roles.has(Remove[i])) 
                            await arg.removeRole(Remove[i]).catch(err => console.log(err));
                    }
                }
                let Username = await Roblox.GetRobloxName(User.RobloxId);
                await arg.setNickname(Bind.Nickname + ' ' + Username).catch(err => console.log(err)); 
                console.log(Group.VerificationRole)
                await arg.removeRole(Group.VerificationRole).catch(err => console.log(err));
            } else {
                await arg.removeRoles(Remove).catch(err => console.log(err));
                await arg.addRole(Group.VerificationRole);
            }

            setTimeout(async function () {
                for (const key in Subgroups) {
                    if (Subgroups.hasOwnProperty(key)) {
                        const Subgroup = Subgroups[key];
                        let SubRank = await Roblox.GetGroupRank(User.RobloxId, key);
                        if(SubRank != 0) {
                            if (!roles.has(Subgroup))
                                await arg.addRole(Subgroup).catch(err => console.log(err));
                        } else {
                            if (roles.has(Subgroup)) {
                                await arg.removeRole(Subgroup);
                            }
                        }
                    }
                }     
            }, 500);
        } else {
            await arg.removeRoles(Remove).catch(err => console.log(err));
            await arg.addRole(Group.VerificationRole);
        }
    }
}    