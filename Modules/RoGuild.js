let Discord = require('discord.js');
let Database = require('./../Utilities/Database');

class RoGuild {
    /**
     * 
     * @param {Discord.Guild} Guild 
     */
    async constructor(Guild) {
        this.Guild = Guild;
        this.Group = await Database.GetGroup(Guild.id);
    }
}