const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Perform actions on channels.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)

        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Deletes channels which names include your selected query.')

            .addStringOption(option => option
                .setName("query")
                .setDescription("The search query of channels to delete.")
                .setRequired(true)))

    , async execute(interaction) {
        const query = interaction.options.getString("query")

        if (interaction.options.getSubcommand() == "delete") {
            let numChannels = 0;
            interaction.guild.channels.cache.forEach(channel => {
                if (channel.name.includes(query)) {
                    channel.delete()
                    numChannels++;
                }
            })
            interaction.reply({
                content: `Successfully deleted **${numChannels}** channels which names include the query of \`${query}\`.`,
                ephemeral: true
            })
        }
    }
}