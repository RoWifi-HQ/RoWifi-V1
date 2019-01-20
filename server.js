var express = require("express");
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs')
var Database = require('./Utilities/Database.js');
var Roblox = require('./Utilities/Roblox')
var fetch = require('node-fetch')
var rbx = require('noblox.js');
var Commando = require('discord.js-commando');
var { prefix, token } = require('./config.json');
var path = require('path');

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
const client = new Commando.Client({
    owner: '311395138133950465',
    commandPrefix: prefix,
    unknownCommandResponse: false,
    invite: 'https://discord.gg/RApdmuj'
});

let AuditLogs = require('./Services/AAWatcher')
let AutoDetection = require('./Services/AutoDetection')
client.once('ready', async function () {
    console.log('Ready');
    let guilds = client.guilds;
    for (let guild of guilds) {
        let Group = await Database.GetGroup(guild[1].id);
        if (!Group) {
            continue;
        }
        //AuditLogs.WatchAA(guild[1]);
        // setInterval(async function () {
        //     await AutoDetection.execute(guild[1]);
        // }, 30*60, 1000)
    }
});

client.on('error', console.error);

client.registry
    .registerGroups([
        ['roblox', 'Roblox-Related Functions'],
        ['group', 'Group Administration Functions'],
        ['math', 'Math Functions']
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'))

client.login(token);