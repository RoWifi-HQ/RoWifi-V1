let Database = require('../../Utilities/Database.js');
const { Command } = require('discord.js-commando');
let codeWords = ['cat', 'dog', 'sun', 'rain', 'snow', 'alcazar', 'dight', 'night', 'morning', 'eyewater', 'flaws', 'physics', 'chemistry', 'history', 'martlet', 'nagware', 'coffee', 'tea', 'red', 'blue', 'green', 'orange', 'pink'];
let Roblox = require('../../Utilities/Roblox.js');
const Discord = require('discord.js')

module.exports = class VerifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reverify',
      group: 'roblox',
      memberName: 'reverify',
      description: 'Roblox Verification',
      guildOnly: false,
      examples: ['!verify TensorMatrix'],
      args: [
        {
          key: 'name',
          prompt: 'Roblox Name missing. Try again',
          type: 'string'
        }
      ]
    });
  }  
   async run(message, { name }) {
      let embed = new Discord.RichEmbed()
        .setTitle('Roblox Verification')
        .setTimestamp()
        .setFooter('tensor_core');  
        var user = await Database.GetUser(message.author.id);
        if (user) {
          let RobloxId = await Roblox.GetRobloxId(name);
          if (!RobloxId) {
               embed .setColor([255, 0, 0]).addField('Verification Failed', 'Invalid Roblox Username. Please try again.')
              return await message.channel.send(message.author.toString(), {embed});
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
              var msg = await Database.ModifyUser(message.author.id, RobloxId);
              embed.setColor([0, 255, 0]).addField('Verification Process', msg ? 'Successful':'Failed')
              return await message.author.send(message.author.toString(), {embed});
            } else {
              embed.setColor([255, 0, 0]).addField('Verification Failed', 'Code not found in profile. Please try again.')
              return await message.author.send(message.author.toString(), {embed});
            }
          })
          .catch(async function(err) {
            console.log(err);
            embed.setColor([255, 0, 0]).addField('Verification Failed', 'Timeout reached. Please try again.')
            return await message.channel.send(message.author.toString(), {embed});
          }) 
        } else {
          embed.setColor([255, 0, 0]).addField('Verification Process', 'User not verified. Use verify command.');
          return message.embed(embed);
        }
    }
}