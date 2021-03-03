const EasyDiscord = require('../utils/easy-discord');
const router = new EasyDiscord();
const {getLink} = require('../controllers/class-controllers');

router.command('next class', getLink);

module.exports = router;