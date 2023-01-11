const { EmbedBuilder } = require('discord.js')
const { embedColor } = require("../config.json")

module.exports = {
  new(args) {

    const embed = new EmbedBuilder()
      .setColor(args.color ?? embedColor)

    if (args.title) {
      embed.setTitle(args.title)
    }

    if (args.desc) {
      embed.setDescription(args.desc)
    }

    if (args.timestamp) {
      embed.setTimestamp()
    }
    if (args.footer) {
      embed.setFooter(args.footer)
    }

    return embed
  }
}