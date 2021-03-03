const {getNextClass} = require('../models/google-calendar');

exports.getLink = async (msg) => {
    const nextClass = await getNextClass();
    msg.reply(nextClass.link);
}