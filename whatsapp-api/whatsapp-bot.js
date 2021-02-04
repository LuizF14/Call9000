const { getNextClass } = require('../google-api/google-calendar');
const venom = require('venom-bot');

module.exports = async (command) => {
    try {
        const client = await venom.create();
        client.onMessage(async message => {
            if(message.body === command) {
                const response = await getNextClass();
                const result = await client.sendText(message.from, response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}