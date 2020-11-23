const express = require('express');
const {
    Telegraf,
    Stage,
    session
} = require('telegraf');

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv').config();
};
const bot = new Telegraf(process.env.bot_token);
const pool = require('./db');
const createAddDocument = require("./scenes/addDocument");
const createAbruptCloseScene = require("./scenes/abruptClose");
const createCloseScene = require("./scenes/close");

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const {
        generateUpdateMiddleware
    } = require('telegraf-middleware-console-time');
    bot.use(generateUpdateMiddleware());
};
const stage = new Stage([
    createAddDocument("ADD_DOCUMENT", async (ctx) => {
        ctx.reply("Completed the task of adding document[s] exiting now");
        return ("CLOSE");
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
});
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
    ctx.reply("No work was going on. ZZzzz");

});

bot.command('newdoc', Stage.enter("ADD_DOCUMENT"));

bot.telegram.setWebhook('https://casefilebot.ml/bot');
// bot.telegram.setWebhook('https://b66bac7e47ad.ngrok.io/bot');

const app = express();
if(process.env.NODE_ENV || process.env.NODE_ENV === "production") {
app.set("trust-proxy", true);
}
app.get('/', (req, res) => {
    console.log("Inside /");
    res.redirect('https://github.com/Omkaragrawal/CaseFiles-telegraf')
});

app.use(bot.webhookCallback('/bot'));

app.listen(process.env.PORT || 8080, () => {
    console.log('Example app listening on port ' + process.env.PORT || 8080)
});