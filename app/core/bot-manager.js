const Bot = require('./bot');

class BotManager {
  constructor() {
    this.bots = [];
  }

  addBot(player) {
    this.bots.push(new Bot(player));
  }

  updateBots() {
    this.bots.forEach((bot) => {
      bot.updateProgress();
    });
  }
}

module.exports = BotManager;
