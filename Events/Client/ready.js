const { Events, ActivityType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { guildName, guildId } = require("../../config.json")

const createEmbed = require("../../Modules/embed.js").new

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    client.user.setActivity(guildName, { type: ActivityType.Watching });
    console.log(`[BOT]: Online`)
  }
}