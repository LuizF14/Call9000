const { getNextClass } = require('../google-api/google-calendar');
const venom = require('venom-bot');
const { datacatalog } = require('googleapis/build/src/apis/datacatalog');

const sendLink = async (client) => {
    const response = await getNextClass();
    // const timeUntilNextClass = response.startDate - Date.now() - 5 * 60 * 1000;
    // console.log(timeUntilNextClass);

    // setTimeout(async () => {
    //     await client.sendText('553592722943@c.us', response.link);
    //     console.log(`Link sent: ${response.link}`);
    //     sendLink(client);
    // }, timeUntilNextClass);

    // console.log(`${response.startDate.getHours()} and ${response.startDate.getMinutes()}`);

    const timeUntilNextClass = response.startDate;
    const interval = setInterval(async () => {
        const date = new Date();
        // console.log(timeUntilNextClass.getTime() - date.getTime());
        // date.getHours() === timeUntilNextClass.getHours() && date.getMinutes() === timeUntilNextClass.getMinutes()

        if(timeUntilNextClass - date.getTime() < 0) {
            console.log(response.link);
            await client.sendText('554185061718-1504399460@g.us', response.link);
            clearInterval(interval);
            sendLink(client);
        }
    }, 1000);

    // grupo da sala = 554185061718-1504399460@g.us
    // grupo dos links = 553598267787-1612140909@g.us
    // titi = 553592722943@c.us
}

module.exports = async () => {
    try {
        const client = await venom.create('sessionName', (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('Number of attempts to read the qrcode: ', attempts);
            console.log('Terminal qrcode: ', asciiQR);
            console.log('base64 image string qrcode: ', base64Qrimg);
            console.log('urlCode (data-ref): ', urlCode);
          },
          (statusSession, session) => {
            console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
            //Create session wss return "serverClose" case server for close
            console.log('Session name: ', session);
          },
          {
              autoClose: 0
        });

        sendLink(client);

    } catch (error) {
        console.log(error);
    }
}