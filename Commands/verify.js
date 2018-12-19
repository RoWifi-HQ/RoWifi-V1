const fetch = require('node-fetch')
let Database = require('./../Utilities/Database.js');
const Discord = require('discord.js');
let codeWords = ['cat', 'dog', 'sun', 'rain', 'snow', 'alcazar', 'dight', 'night', 'morning', 'eyewater', 'flaws', 'physics', 'chemistry', 'history', 'martlet', 'nagware', 'coffee', 'tea', 'red', 'blue', 'green', 'orange', 'pink'];
let verify = require('./update.js');
let Roblox = require('./../Utilities/Roblox.js')

module.exports = {
    name: 'verify',
    description: 'Roblox Verification',
    guildOnly: false,
    execute: async(message, args) => {
      let embed = new Discord.RichEmbed()
        .setTitle('Roblox Verification')
        .setTimestamp()
        .setFooter('tensor_core');  
        if (!args[0]) {
          embed.setColor([255, 0, 0]).addField('Verification Failed', 'No Username provided. Please try again.'); 
          await message.channel.send(message.author.toString(), {embed});
          return;
        }
        var user = await Database.GetUser(message.author.id);
        if (user) {
          embed.setColor([255, 0, 0]).addField('Verification Failed', 'User already verified.');
          await message.channel.send(message.author.toString(), {embed});
          if (message.channel.type === 'text') {
            verify.execute(message, args);
          }
        } else {
          let RobloxId = await Roblox.GetRobloxId(args[0]);
          if (!RobloxId) {
               embed .setColor([255, 0, 0]).addField('Verification Failed', 'Invalid Roblox Username. Please try again.')
              await message.channel.send(message.author.toString(), {embed});
              return;
          }
          let Code = codeWords[Math.floor(Math.random() * codeWords.length)] + ' ' + codeWords[Math.floor(Math.random() * codeWords.length)] + ' ' + codeWords[Math.floor(Math.random() * codeWords.length)];
          embed.setColor([0, 0, 255]).addField('Verification Process', 'Enter the following code in your Roblox status/description').addField('Code', Code).addField('Further Instructions', 'After doing so, reply to me saying "done"');
          await message.author.send(message.author.toString(), {embed});
          embed = new Discord.RichEmbed()
            .setTitle('Roblox Verification')
            .setTimestamp()
            .setFooter('tensor_core');
          await message.author.dmChannel.awaitMessages(msg => msg.content === 'done', {time:300000, max:1, errors:['time']})
          .then(async function () {
            let found = await Roblox.CheckForCode(RobloxId, Code);
            if(found) {
              var msg = await Database.AddUser(message.author.id, RobloxId);
              embed.setColor([0, 255, 0]).addField('Verification Process', msg ? 'Successful':'Failed')
              await message.author.send(message.author.toString(), {embed});
            } else {
              embed.setColor([255, 0, 0]).addField('Verification Failed', 'Code not found in profile. Please try again.')
              await message.author.send(message.author.toString(), {embed});
              return;
            }
          })
          .catch(async function(err) {
            console.log(err);
            embed.setColor([255, 0, 0]).addField('Verification Failed', 'Timeout reached. Please try again.')
            await message.channel.send(message.author.toString(), {embed});
          }) 
        }
    },
}