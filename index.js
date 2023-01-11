
const { Partials, Client, Collection, GatewayIntentBits } = require('discord.js')

const path = require('node:path');
const wrench = require("wrench");
const keepAlive = require("./server");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

//-------------------------------------------------------------------------------------------

const toSearch = "./Handlers"
const files = wrench.readdirSyncRecursive(toSearch)

files.forEach(async (file) => {
  if (file.endsWith('.js')) {
    const filePath = './' + path.join(toSearch, file);
    const handler = require(filePath)
    if ('execute' in handler) {
      handler.execute(client)
    }
  }
})

//-------------------------------------------------------------------------------------------

const token = process.env['TOKEN']
keepAlive()
client.login(token)