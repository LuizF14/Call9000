// File modules
const EasyDiscord = require('./utils/easy-discord');
const classRoutes = require('./routes/class-routes');

const bot = new EasyDiscord(process.env.DISCORD_TOKEN);

bot.setPrefix(',');

bot.extractRoutes(classRoutes);

module.exports = bot;