const venom = require('venom-bot');

const whatsappBot = async () => {
    try {
        const client = await venom.create();
        client.onMessage(async message => {
            if(message.body === '/help') {
                const result = await client.sendText(message.from, 'n');
            }
        });
    } catch (error) {
        console.log(error);
    }
}

whatsappBot();