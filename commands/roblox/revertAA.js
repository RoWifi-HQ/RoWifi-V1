const {Command} = require('discord.js-commando')
let Roblox = require('./../../Utilities/Roblox')
let Database = require('./../../Utilities/Database')
let Extensions = require('../../Utilities/DiscordExtensions')
let rbx = require('noblox.js');
var ProgressBar = require('progress')

module.exports = class SetGroupCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'revert-aa',
            group: 'group',
            memberName: 'revert-aa',
            description: 'Fix any kind of admin abuse. DM the owner to avail this.',
            guildOnly: true
        })
    }

    hasPermission(msg) {
        return this.client.isOwner(msg.author)
    }

    async run(message) {
        var group
        
        var actionTypeId
        var targetUser
        var startPage
        var endPage
        
        rbx.cookieLogin({cookie: ''})
          .then(function () {
            var pages = []
            for (var i = startPage; i <= endPage; i++) {
              pages.push(i)
            }
            var promise = rbx.getAuditLog({
              group: group,
              action: actionTypeId,
              username: targetUser,
              page: pages
            })
            promise.then(async function (audit) {
              var logs = audit.logs
              var original = {}
              for (var i = 0; i < logs.length; i++) {
                var log = logs[i]
                  original[log.action.target] = log.action.params[0]
                
              }
              var reset = []
              for (var target in original) {
                reset.push({
                  target: target,
                  role: original[target]
                })
              }
              console.log(reset);
              console.log('Reset array made')
              // Cache the XCSRF token to prepare for a bunch of requests at once
              for (let i = 0; i < reset.length; i++) {
                  setTimeout(function() {
                    console.log(reset[i]);
                // rbx.setRank({
                //     group: group,
                //     target: reset[i].target,
                //     name: reset[i].role
                /**    }).catch(err => console.log(err))*/}, i*1000)
              }

            })
            
          })
    }
}