const path = require('node:path');
const Ascii = require("ascii-table");
const wrench = require("wrench");

const { Events } = require('discord.js')

module.exports = {
  async execute(client) {
    const toSearch = "../Events"
    const files = wrench.readdirSyncRecursive("Events");

    const Table = new Ascii("Events Loaded");

    files.forEach(async (file) => {
      if (file.endsWith('.js') && file.match('_')) {
        const filePath = path.join(toSearch, file)
        const event = require(filePath)

        if (!event.name) {
          const L = file.split("/");
          Table.addRow(`${event.name || "❌ MISSING"}`, `Event name is either invalid or missing: ${L[7] + `/` + L[8]}`);
          return;
        }

        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }

        Table.addRow(`${event.name}.js`, "✅ SUCCESSFUL")
      }
    })

    //console.log(Table.toString());
  }
}