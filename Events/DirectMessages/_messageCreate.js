const { Events } = require('discord.js')

function check(message, content) {
  return message.content.includes(content)
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (check(message, "?key")) {
      if (check(message, "generate")) {
        console.log("Checking if user has key...")

        
      } else
      if (check(message, "check")) {
        console.log("Checking if user has key...")

        
      } else
      if (check(message, "invalidate")) {
        console.log("Checking if user has key...")

        
      }
    }
  }
}