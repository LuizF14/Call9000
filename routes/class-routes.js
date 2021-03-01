const EasyDiscord = require('../utils/easy-discord');
const {authenticateWithOAuth, getNextClass} = require('../models/google-calendar');
const router = new EasyDiscord();

router.command('next class', async (msg) => {
    await authenticateWithOAuth();
    const nextClass = await getNextClass();
    msg.reply(nextClass.link);
});

module.exports = router;