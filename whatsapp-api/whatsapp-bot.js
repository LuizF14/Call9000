const { getNextClass } = require('../google-api/google-calendar');
const venom = require('venom-bot');

module.exports = async (command) => {
    try {
        const client = await venom.create(
            'sessionName', 
            (base64Qrimg, asciiQR, attempts, urlCode) => {
              console.log('Number of attempts to read the qrcode: ', attempts);
              console.log('Terminal qrcode: ', asciiQR);
              console.log('base64 image string qrcode: ', base64Qrimg);
              console.log('urlCode (data-ref): ', urlCode);
            },
            (statusSession, session) => {
              console.log('Status Session: ', statusSession); 
              console.log('Session name: ', session);
            },
            {
                puppeteerOptions: {
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                },
            }
        );
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