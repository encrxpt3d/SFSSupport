const path = require('node:path');
const Ascii = require("ascii-table");
const wrench = require("wrench");

module.exports = {
  async execute(client) {
    const toSearch = "../Commands"
    const files = wrench.readdirSyncRecursive("Commands");

    const Table = new Ascii("Commands Loaded");
    let amtLoaded = 0

    files.forEach(async (file) => {
      if (file.endsWith('.js')) {
        const filePath = path.join(toSearch, file)
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          Table.addRow(`${command.data.name}.js`, "✅ SUCCESSFUL");
          amtLoaded += 1
        } else {
          Table.addRow(file, "❌ FAILED", "Missing a name or an execution.");
        }
      }
    })

    if (amtLoaded >= 1) {
      //console.log(Table.toString());
    }
  }
}