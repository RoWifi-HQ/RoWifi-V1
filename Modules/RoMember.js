let Discord = require('discord.js');
let Database = require('./../Utilities/Database')

class RoMember {
    /**
     * @param {Discord.GuildMember} GuildMember 
     */
    constructor(GuildMember) {
        this.GuildMember = GuildMember;
    }

    get RobloxId() {
        if (!this.RobloxId) {
            this.RobloxId = await Database.GetUser(this.GuildMember.id);
        }
        return this.RobloxId;
    }
}