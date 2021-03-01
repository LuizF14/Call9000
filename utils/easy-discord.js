const Discord = require('discord.js');

class Command {
    constructor(string) {
        this.string = string;
    }
    setPrefix(prefix) {
        this.stringWithPrefix = prefix + this.string;
        this.words = this.stringWithPrefix.split(' ');
    }
}

module.exports = class EasyDiscord extends Discord.Client {
    constructor(token) {
        super();
        this.login(token);

        this.middlewares = [];
        this.errorHandler;

        this.information = [];

        this.prefix = '';
    }

    setPrefix(prefix = '') {
        this.prefix = prefix;
    }

    async runMiddlewares(options = {}, index = 0) {
        const { middlewares, msg, nextJump } = options;

        if (middlewares.length - 1 > index) {
            await middlewares[index].call(this, msg, error => {
                if (error) return this.errorHandler(error, msg);
                return this.runMiddlewares({ middlewares, msg, nextJump }, index + 1);
            });
        } else {
            const nextFunc = (error) => {
                if (error) return this.errorHandler(error, msg);
                return;
            };
            const lastNext = nextJump || nextFunc;
            await middlewares[index].call(this, msg, lastNext);
        }
    }

    pushCallbacks(...callbacks) {
        if (callbacks) {
            this.middlewares.push(...callbacks);
        }
    }

    startsWithCommand(msgStr, command) {
        const msgWords = msgStr.split(' ');

        return command.words.every((el, index) => {
            return msgWords[index] && el.startsWith(':') || el === msgWords[index];
        });
    }

    callbacksStartedWith(command, cbArr) {
        return (msg, next) => {
            command.setPrefix(this.prefix);
            if (this.startsWithCommand(msg.content, command)) {
                this.setParams(msg, command);
                this.runMiddlewares({
                    middlewares: cbArr,
                    msg,
                    nextJump: next
                });
            } else {
                next();
            }
        }
    }

    use(firstArg, ...cbArr) {
        if (typeof firstArg === 'string') {
            const command = new Command(firstArg);
            const callbackBlock = this.callbacksStartedWith(command, cbArr);
            this.pushCallbacks(callbackBlock);
        } else {
            cbArr.unshift(firstArg);
            this.pushCallbacks(...cbArr);
        }
        return this;
    }

    callbacksAre(command, cbArr) {
        return (msg, next) => {
            command.setPrefix(this.prefix);
            if (this.isCommand(msg.content, command)) {
                this.setParams(msg, command);
                this.runMiddlewares({
                    middlewares: cbArr,
                    msg
                });
            } else {
                next();
            }
        }
    }

    command(firstArg, ...cbArr) {
        const command = new Command(firstArg);
        const callbackBlock = this.callbacksAre(command, cbArr);
        this.pushCallbacks(callbackBlock);
        this.pushNewObjInfo(firstArg);
        return this;
    }

    isCommand(msgStr, command) {
        if (command.string === '*') return true;

        const msgWords = msgStr.split(' ');

        if (!command.words[command.words.length - 1].startsWith(':') && command.words.length !== msgWords.length) return false;

        return command.words.every((el, index) => {
            return msgWords[index] && el.startsWith(':') || el === msgWords[index];
        });
    }

    pushNewObjInfo(commandName) {
        this.information.push({
            command: commandName
        });
    }

    setInformation(infoObject) {
        Object.assign(this.information[this.information.length - 1], infoObject);
        return this;
    }

    setParams(msg, command) {
        const msgWords = msg.content.split(' ');

        msg.params = {};

        msgWords.forEach((element, index) => {
            if (command.words[index] && command.words[index].startsWith(':')) {
                const paramKey = command.words[index].slice(1);
                msg.params[paramKey] = element;
            } else if (command.words.length <= index) {
                const lastKey = command.words[command.words.length - 1].slice(1);
                msg.params[lastKey] += ' ' + element;
            }
        });
    }

    extractRoutes(router) {
        router.setPrefix(this.prefix);
        this.middlewares.push(...router.middlewares);
        this.information.push(...router.information);
        router.error(this.errorHandler);
    }

    error(cbError) {
        this.errorHandler = cbError;
    }

    listen(cb) {
        this.on('ready', cb);
        this.on('message', msg => {
            if (!msg.author.bot) {
                this.runMiddlewares({
                    middlewares: this.middlewares,
                    msg
                });
            }
        });
    }
}