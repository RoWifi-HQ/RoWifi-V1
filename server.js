var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs')
var Database = require('./Utilities/Database.js');
var Roblox = require('./Utilities/Roblox')
var fetch = require('node-fetch')
var rbx = require('noblox.js');
var Discord = require('discord.js');
var { prefix, token, cookie } = require('./config.json');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/views'));

app.post("/api/v1/webhook", async function (request, response) {
    let body = request.body;
    if (!body.group) {
        return response.status(400).send({
            success: 'false',
            message: "Group Required"
        })
    }
    if (!body.key) {
        return response.status(400).send({
            success: 'false',
            message: "Discord Webhook Key Required"
        })
    }
    if (!body.message) {
        return response.status(400).send({
            success: 'false',
            message: "Cannot send an empty message"
        }) 
    }
    let Webhook = await Database.GetWebhook(body.group, body.key);
    if (!Webhook) {
        return response.status(400).send({
            success: 'false',
            message: "Webhook not found for given key"
        }) 
    }
    console.log(Webhook);
    let hook = new Discord.WebhookClient(Webhook.id, Webhook.token);
    hook.send(body.message);
})

var port = process.env.PORT || 3333
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

//Starting discord bot
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  client.commands.set(command.name, command);
}

async function AutoDetection() {
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
}

client.once('ready', async function () {
  console.log('Ready');
  await AutoDetection();      
});

client.on('message', async function (message){
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;
  let Group = await Database.GetGroup(message.guild.id);
  if (!Group) {
      message.reply('No Roblox Group is linked to this guild');
  }
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