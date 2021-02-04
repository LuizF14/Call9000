const { getNextClass } = require('../google-api/google-calendar');
const venom = require('venom-bot');

module.exports = async (command) => {
    try {
        const client = await venom.create(//session
            'sessionName', //Pass the name of the client you want to start the bot
            //catchQR
            (base64Qrimg, asciiQR, attempts, urlCode) => {
              console.log('Number of attempts to read the qrcode: ', attempts);
              console.log('Terminal qrcode: ', asciiQR);
              console.log('base64 image string qrcode: ', base64Qrimg);
              console.log('urlCode (data-ref): ', urlCode);
            },
            // statusFind
            (statusSession, session) => {
              console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
              //Create session wss return "serverClose" case server for close
              console.log('Session name: ', session);
            },
            // options
            {
              puppeteerOptions: {
                    'args' : [
                    '--no-sandbox',
                    '--disable-setuid-sandbox'
                  ]
              }
            },);
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