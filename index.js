// Third party modules
const dotenv = require('dotenv');

// File modules
const EasyDiscord = require('./utils/easy-discord');
const classRoutes = require('./routes/class-routes');

dotenv.config({
    path: './config.env'
});

const bot = new EasyDiscord(process.env.DISCORD_TOKEN);

bot.setPrefix(',');

bot.extractRoutes(classRoutes);

bot.listen(() => {
    console.log('Bot has started');
});
