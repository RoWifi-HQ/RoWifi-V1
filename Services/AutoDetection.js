const Database = require('./../Utilities/Database');
const Roblox = require('../Utilities/Roblox')

async function AutoDetection(guild) {
    let Group = await Database.GetGroup(guild.id);
    let Subgroups = Group.Subgroups;
    let Remove = Group['AllBinds'];
    if (!Group.AutoDetection) {
        return;
    }
    for (let member of guild.members) {
        if (member[1].user.bot || member[1].roles.has(guild.roles.find(r => r.name === "tensor_core Bypass").id)) {
            continue;
        }
        let arg = member[1];
        let roles = arg.roles;
        console.log(arg.id);
        let User = await Database.GetUser(arg.id);
        console.log(User);
        if(User) {
            let Rank = await Roblox.GetGroupRank(User.RobloxId, Group.GroupId);
            if (Rank > 0) {
                let Bind = Group.RankBinds[Rank];
                if (!Bind) {
                    return;
                }
                for (let i = 0; i < Remove.length; i++ ) {
                    console.log(Remove[i])
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

exports.execute = AutoDetection