const whatsappBot = require('./whatsapp-api/whatsapp-bot');
const {authenticateWithOAuth} = require('./google-api/google-calendar');

const classBot = async () => {
    await authenticateWithOAuth();
    await whatsappBot('Pls link');
}

classBot();
