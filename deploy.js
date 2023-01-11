const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');

const token = process.env['TOKEN']

const fs = require('node:fs');
const path = require('node:path');
const wrench = require("wrench");
const Ascii = require("ascii-table");

const toSearch = "./Commands/"
const files = wrench.readdirSyncRecursive(toSearch);

const Table = new Ascii("Slash Commands Deployed");
const commands = [];

files.forEach((file) => {
  if (file.endsWith('.js')) {
    const filePath = './' + path.join(toSearch, file);
    const command = require(filePath)
    commands.push(command.data.toJSON());
    Table.addRow(`${file}`, "✅ SUCCESSFUL");
  } else {
    Table.addRow(`${file}`, "❌ FAILED");
  }
})
//console.log(Table.toString());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`[STATUS]: Waiting...`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`[STATUS]: Completed`);
  } catch (error) {
    console.error(`[STATUS]: Failed\n[ERROR]: \n${error}`);
  }
})();