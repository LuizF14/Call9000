// Third party modules
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
});

// File modules
const bot = require('./bot');
const app = require('./server');
const {authenticateWithOAuth} = require('./models/google-calendar');

const init = async () => {
    app.listen(8000, () => {
        console.log('Server has started');
    });
    
    await authenticateWithOAuth();

    bot.listen(() => {
        console.log('Bot has started');
    });
}

init();

