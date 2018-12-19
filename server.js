var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3333
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

//Starting discord bot
var Discord = require('discord.js');
var { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  client.commands.set(command.name, command);
}

var Database = require('./Utilities/Database.js');
var Roblox = require('./Utilities/Roblox')

client.once('ready', async function () {
  console.log('Ready');
  setInterval(async function() {
        let guilds = client.guilds;
        for (let guild of guilds) {
            let Group = await Database.GetGroup(guild[1].id);
            let Subgroups = Group.Subgroups;
            let Remove = Group['AllBinds'];
            if (!Group.AutoDetection) {
                continue;
            }
            for (let member of guild[1].members) {
                if (member[1].user.bot || member[1].roles.has(guild[1].roles.find(r => r.name === "tensor_core Bypass").id)) {
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
  }, 30*60*1000);
})

client.on('message', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  const command = client.commands.get(commandName);

  if(command.guildOnly && !(message.channel.type === 'text')) {
      message.reply('This command may only be executed in a server/guild.');
      return;
  }

  try {
      command.execute(message, args, client);
  }
  catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
  }
});


client.login(token);