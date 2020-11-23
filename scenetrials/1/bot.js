const {
    Telegraf,
    Stage,
    session,
} = require('telegraf');
const {
    generateUpdateMiddleware
} = require('telegraf-middleware-console-time');

const {createEx1Scene} = require("./ex1");
const {createEx2Scene} = require("./ex2");
const {createEntryScene} = require("./entryScene");
const {createActionScene} = require("./actionScene");
const {createAbruptCloseScene} = require("./abruptClose");
const {createCloseScene} = require("./close");

if (!process.env.NODE_ENV || process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv').config({
        path: "./.env"
    });
};

const bot = new Telegraf(process.env.bot_token);


const stage = new Stage([
  // the following line defines ENTRY_SCENE, when scenario finishes, depending on hasCreds flag, it either switches to CONTACT_DATA_SCENE, or skips it to go straight for ORDER_DATA_SCENE
  createEntryScene("ENTRY_SCENE", (ctx) => {
      console.log(ctx.session && ctx.session.hasCreds);
    //   console.log(ctx.scene);
      return (ctx.session.hasCreds)? "ENTER_NAME" : "ENTER_CRED"
  }),
  // simple linear scenario, switch scenes one by one
  createEx1Scene("ENTER_CRED", () => "ENTER_NAME"),
  createEx2Scene("ENTER_NAME", () => "ACTION_TIME_SCENE"),
  // once done, we send the data, gathered during scenario and leave scene
  createActionScene("ACTION_TIME_SCENE", async (ctx) => {
    const { credentials, name } = ctx.wizard.state;
    try {
        await ((noError = true) => {
            return new Promise((resolve, reject) => {
                ctx.reply("Waiting Started");
        setTimeout(() => {
            if(noError) {
                resolve();
            } else if(!noError) {
                reject();
            } else {
                console.log("ELSE IF FAILED AND REJECTED");
                reject();
            }
        }, 10 * 1000)
    });
    })();
    await ctx.reply({ credentials, name });
    return("CLOSE");
} catch(err) {
    ctx.reply("ERROR CAUSED");
    // ctx.reply(err);
    return "ABRUPT_CLOSE"
} finally {
    ctx.reply("COMPLETED");
}
  }),
  createAbruptCloseScene("ABRUPT_CLOSE", () => "CLOSE"),
  createCloseScene("CLOSE", () => {}),
]);

bot.use(session());
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);

});

bot.use(stage.middleware());
bot.command('test', Stage.enter("ENTRY_SCENE"));
// bot.command('close', Stage.enter("ABRUPT_CLOSE"))

bot.launch();