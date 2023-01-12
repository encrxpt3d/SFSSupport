const { SlashCommandBuilder, Events } = require('discord.js');
const { QuickDB } = require("quick.db");

const { embedColor, whitelisted, perm_users } = require("../../config.json");

const wait = require('node:timers/promises').setTimeout;
const cron = require('node-cron');
const { create } = require('node:domain');

const createEmbed = require("../../Modules/embed.js").new

const db = new QuickDB()

function dm(user, title, desc, returnMessage) {
    try {
        user.createDM({ force: true })
        const msg = user.send({
            embeds: [createEmbed({
                title,
                desc,
                color: embedColor
            })]
        })
        if (returnMessage)
            return msg
    } catch (e) {
        console.log(e)
    }
}

function hasKey(data) {
    if (!data || data == null || data == "" || !data.Key || data.Key == null || data.Key == "") {
        return false
    } else {
        return true
    }
}

function generateKey(length) {
    const chars = "0AaBbC1cDdEe2FfGgH3hIiJj4KkLlM5mNnOo6PpQqR7rSsTt8UuVvW9wXxYy0Zz".split("").join(" ").split(" ")
    let key = ""
    for (let i = 0; i < length; i++) {
        key += chars[Math.floor(Math.random() * chars.length)]
    }
    return key
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('key')
        .setDescription('Perform actions with keys.')

        .addSubcommand(subcommand => subcommand
            .setName('generate')
            .setDescription('Generates a key.'))

        .addSubcommand(subcommand => subcommand
            .setName('generate_perm_key')
            .setDescription('Generates a permanent key. You must be an approved donor to use this.'))

        .addSubcommand(subcommand => subcommand
            .setName('check')
            .setDescription('Checks to see if you have a valid key.'))

        .addSubcommand(subcommand => subcommand
            .setName('invalidate')
            .setDescription('Invalidates, deletes, and expires your key.'))

    , async execute(interaction) {
        const userData = await db.get(interaction.user.id)
        if (interaction.options.getSubcommand() === 'generate') {
            console.log("Checking if user has key...")

            if (hasKey(userData)) {
                interaction.reply({
                    content: "You already have a valid key.",
                    ephemeral: true
                })
                console.log(`${interaction.user.username} tried to generate a key, but it failed.`)
            } else {
                console.log(`${interaction.user.username} generated a key.`)

                const generatedKey = generateKey(22)

                await db.set(interaction.user.id, {Key: generatedKey})

                interaction.reply({
                    content: "Chcek your dms for the new key!",
                    ephemeral: true
                })

                try {
                    interaction.user.createDM({ force: true })
                    interaction.user.send({
                        embeds: [createEmbed({
                            title: "Key Check Successful",
                            desc: "Generating key...",
                            color: embedColor
                        })]
                    }).then(async msg => {
                        await interaction.guild.channels.fetch(whitelisted).then(c => c.send({
                            embeds: [createEmbed({
                                title: "Whitelisted User",
                                desc: `User Id: ${interaction.user.id}\nUsername + Tag: ${interaction.user.tag}\nStatus: **Whitelisted**\n\nKey: **${generatedKey}**\nExpires: <t:${Math.round(Date.now() / 1000 + 24 * 3600)}:R>`
                            })]
                        }))

                        await wait(3000)
                        msg.edit({
                            embeds: [createEmbed({
                                title: "Key Generation Successful",
                                desc: `Your new key is: **${generatedKey}**`
                            })]
                        })
                    })
                } catch (e) {
                    console.log(e)
                }

                console.log(`Generated key for ${interaction.user.tag}: ${generatedKey}`)

                await wait(86400000)

                await interaction.guild.channels.fetch(whitelisted).then(async c => {
                    const msg = await c.messages.cache.filter(m => m.content.includes(interaction.user.id))
                    msg.edit({
                        embeds: [createEmbed({
                            title: "Whitelisted User (EXPIRED)",
                            desc: `User Id: ${interaction.user.id}\nUsername + Tag: ${interaction.user.tag}\nStatus: **Expired**\n\nKey: **${generatedKey}**`,
                            color: "ff2121"
                        })]
                    })
                })

                db.delete(interaction.user.id)
            }
        }
        else if (interaction.options.getSubcommand() === 'check') {
            console.log("Checking if user has key...")

            if (!hasKey(userData)) {
                interaction.reply({
                    content: "You have no active keys in our database.",
                    ephemeral: true
                })
                console.log(`${interaction.user.username} tried to check their key, but it failed.`)
            } else {
                dm(interaction.user, "Key Check Successful", `Your current key is: ${userData.Key}`)

                console.log(`${interaction.user.username} checked their key.`)
            }
        }
        else if (interaction.options.getSubcommand() === 'invalidate') {
            console.log("Checking if user has key...")

            if (!hasKey(userData)) {
                interaction.reply({
                    content: "You have no active keys in our database.",
                    ephemeral: true
                })
                console.log(`${interaction.user.username} tried to check their key, but it failed.`)
            } else {

                await interaction.guild.channels.fetch(whitelisted).then(async c => {
                    const msg = await c.messages.cache.filter(m => m.content.includes(interaction.user.id))
                    msg.edit({
                        embeds: [createEmbed({
                            title: "Whitelisted User (EXPIRED)",
                            desc: `User Id: ${interaction.user.id}\nUsername + Tag: ${interaction.user.tag}\nStatus: **Expired**\n\nKey: **${generatedKey}**`,
                            color: "ff2121"
                        })]
                    })
                })

                interaction.reply({
                    content: `Successfully invalidated key: ${userData.Key}`,
                    ephemeral: true
                })

                console.log(`${interaction.user.username} invalidated their key: ${userData.Key}`)
                db.delete(interaction.user.id)
            }
        }
    }
}