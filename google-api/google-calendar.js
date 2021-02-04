const { google } = require('googleapis');
const calendar = google.calendar({ version: "v3" });
const OAuth2 = google.auth.OAuth2;
const express = require('express');
const credentials = require('./credentials/client_secret_412682980021-en76tm1sjgjpk6pr9halgmeml1aa9ge9.apps.googleusercontent.com.json');

const startWebServer = () => {
    return new Promise((resolve, reject) => {
        const port = 8000;
        const app = express();

        const server = app.listen(8000, () => {
            console.log("Server has started");
        });

        resolve({
            app,
            server
        });
    });
}

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

const waitForGoogleCallback = async (webServer) => {
    return new Promise((resolve, reject) =>  {
        console.log('Waiting for your consent');

         webServer.app.get('/oauth2/callback/', (req, res) => {
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

            OAuthClient.setCredentials(token);
            resolve();
        });
    });
}

const setGlobalGoogleAuthentication = (OAuthClient) => {
    google.options({
        auth: OAuthClient
    });
}

const stopWebServer = (webServer) => {
    return new Promise((resolve, reject) => {
        webServer.server.close(() => { resolve() });
    });
}

const authenticateWithOAuth = async () => {
    const webServer = await startWebServer();
    const OAuthClient = await createOAuthClient();
    requestUserConsent(OAuthClient);
    const authoriazationToken = await waitForGoogleCallback(webServer);
    await requestGoogleForAccessTokens(OAuthClient, authoriazationToken);
    await setGlobalGoogleAuthentication(OAuthClient);
    await stopWebServer(webServer);
}

const getNextClass = async () => {
    return new Promise((resolve, reject) => {
        let returnLink;
    
        calendar.events.list({
            calendarId: '3fn4hbhlko8vr5r6bhd0a48hb8@group.calendar.google.com',
            maxResults: 20,
            orderBy: 'startTime',
            singleEvents: true
        }, (err, res) => {
            if(err) return console.log(err);
            const nextEvent = res.data.items.filter(el => new Date(el.start.dateTime).getTime() > Date.now())[0];
            if(nextEvent.hangoutLink) {
                returnLink = nextEvent.hangoutLink
            } else {
                returnLink = nextEvent.description;
            };
            resolve(returnLink);
        });

    });
}

exports.authenticateWithOAuth = authenticateWithOAuth;
exports.getNextClass = getNextClass;