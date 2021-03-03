// Third party modules
const { google } = require('googleapis');
const calendar = google.calendar({ version: "v3" });
const OAuth2 = google.auth.OAuth2;
const cheerio = require('cheerio');
// Node modules
const fs = require('fs');
// File modules
const app = require('../server');
const credentials = require('../credentials/client_secret_523885872434-81e5l20m3ci581khud6c99812i40326d.apps.googleusercontent.com.json');

const TOKEN_PATH = `${__dirname}/../credentials/token.json`;

const createOAuthClient = async () => {
    const OAuthClient = new OAuth2(
        credentials.web.client_id,
        credentials.web.client_secret,
        credentials.web.redirect_uris[0]
    );

    return OAuthClient;
}

const requestUserConsent = (OAuthClient) => {
    const consentUrl = OAuthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar']
    });

    console.log(`Please give your consent: ${consentUrl}`);
}

const waitForGoogleCallback = async (app) => {
    return new Promise((resolve, reject) =>  {
        console.log('Waiting for your consent');

         app.get('/oauth2/callback/', (req, res) => {
             const authCode = req.query.code;
             console.log(`Consent given: ${authCode}`);
             res.send('<h1>Thank you</h1>');
             resolve(authCode);
         });
    });
}

const requestGoogleForAccessTokens = async (OAuthClient, authoriazationToken) => {
    return new Promise((resolve, reject) => {
        OAuthClient.getToken(authoriazationToken, (err, token) => {
            if(err) return reject(err);
            console.log('Access token received');
            resolve(token);
        });
    });
}

const setGlobalGoogleAuthentication = (OAuthClient) => {
    google.options({
        auth: OAuthClient
    });
}

const getAccessToken = async (OAuthClient, app) => {
    requestUserConsent(OAuthClient);
    const authoriazationToken = await waitForGoogleCallback(app);
    const token = await requestGoogleForAccessTokens(OAuthClient, authoriazationToken);
    OAuthClient.setCredentials(token);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
    });
}

const authenticateWithOAuth = async () => {
    const OAuthClient = await createOAuthClient();
    try{
        const token = require('../credentials/token.json');
        OAuthClient.setCredentials(token);
    } catch(err) {
        await getAccessToken(OAuthClient, app);
    }
    await setGlobalGoogleAuthentication(OAuthClient);
}

const getNextClass = async () => {
    return new Promise((resolve, reject) => {
        const returnObj = {};

        const lagTime = 5 * 60 * 1000;
    
        calendar.events.list({
            calendarId: '3fn4hbhlko8vr5r6bhd0a48hb8@group.calendar.google.com',
            orderBy: 'startTime',
            singleEvents: true
        }, (err, res) => {
            if(err) return console.log(err);
            const nextEvent = res.data.items.filter(el => new Date(el.start.dateTime).getTime() - lagTime > Date.now())[0];
            returnObj.startDate = new Date(nextEvent.start.dateTime).getTime() - lagTime;
            if(nextEvent.hangoutLink) {
                returnObj.link = nextEvent.hangoutLink;
            } else{
                const $ = cheerio.load(nextEvent.description);
                returnObj.link = $('html *').contents().map(function() {
                    return (this.type === 'text') ? $(this).text()+' ' : '';
                }).get().join('');
            }
            resolve(returnObj);
        });

    });
}

exports.authenticateWithOAuth = authenticateWithOAuth;
exports.getNextClass = getNextClass;