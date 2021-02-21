const {authenticateWithOAuth, getNextClass} = require('./google-api/google-calendar');

const classBot = async () => {
    await authenticateWithOAuth();
    const link = await getNextClass();
    console.log(link);
}

classBot();
