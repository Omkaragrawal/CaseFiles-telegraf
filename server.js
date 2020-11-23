const {
    Telegraf,
    Stage,
    session,
    // Extra,
    // Markup 
} = require('telegraf');

// const WizardScene = require('telegraf/scenes/wizard');
const axios = require('axios').default;
const {
    createWriteStream
} = require('fs');
const {
    generateUpdateMiddleware
} = require('telegraf-middleware-console-time');

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv').config();
};


const bot = new Telegraf(process.env.bot_token);

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    bot.use(generateUpdateMiddleware());
};
const pool = require('./db');
const createAddDocument = require("./scenes/addDocument");
const createAbruptCloseScene = require("./scenes/abruptClose");
const createCloseScene = require("./scenes/close");

const stage = new Stage([
    createAddDocument("ADD_DOCUMENT", async(ctx) => {
        ctx.reply("Completed the task of adding document[s] exiting now");
        return("CLOSE");
    }),
    createAbruptCloseScene("ABRUPT_CLOSE", () => "CLOSE"),
    createCloseScene("CLOSE", () => {}),
]);


bot.use(session());
bot.use(stage.middleware());

bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
});



bot.start((ctx) => {
    ctx.reply('Welcome');
    console.log(ctx.startPayload);
});
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on('document', (ctx, next) => {
    // console.log(ctx.startPayload())
    ctx.reply("Please wait for response");
    ctx.telegram.getFileLink(ctx.message.document.file_id)
        .then((url) => {
            return (axios.get(url, {
                responseType: "stream"
            }))
        })
        .then((stream) => {
            stream.data.pipe(createWriteStream('./downloads/' + ctx.message.document.file_name))
                .on('finish', () => {
                    ctx.replyWithDocument(ctx.message.document.file_id);
                    console.log("File Sent");
                });
        })
        .catch(err => {
            console.log(err);
            ctx.reply(err);
        });
});

bot.command('/close', (ctx, next) => {
    // ctx.telegram.leaveChat(ctx.chat.id);
    ctx.reply("No work was going on. ZZzzz");

});

bot.command('newdoc', Stage.enter("ADD_DOCUMENT"));
bot.launch();
bot.startPolling();