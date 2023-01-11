const { Events, EmbedBuilder } = require('discord.js')

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      
    }
    else if (interaction.isChatInputCommand()) {

      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching '${interaction.commandName}' was found.`);
        const newMsg = await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("FF0000")
              .setDescription("An error occured while running this command.")
          ],
          ephemeral: true,
          fetchReply: true
        })
        const wait = require('node:timers/promises').setTimeout;
        await wait(30000)
        if (newMsg)
          newMsg.deleteReply()
      }

      try {
        command.execute(interaction);
      } catch (error) {
        console.error(error);

        try {
          interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor("FF0000")
                .setDescription("An error occured while running this command.")
            ],
            ephemeral: true
          })
        } catch (error) {
          interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor("FF0000")
                .setDescription("An error occured while running this command.")
            ],
            ephemeral: true
          })
        }
      }
    }
  }
}