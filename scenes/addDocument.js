const pool = require('./../db');
const {
    composeWizardScene
} = require('../sceneFactory');

const createAddDocument = composeWizardScene(
    (ctx) => {
        ctx.wizard.state.addDoc = {
            fileNum: "",
            paperSub: "",
            to: "",
            extraDetails: ""
        };
        ctx.reply('Please enter paper number ?');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.addDoc.fileNum = Number(ctx.message.text);
        ctx.reply('Please enter complete paper subject as is');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.addDoc.paperSub = ctx.message.text.toLowerCase();
        if (ctx.wizard.state.to) {
            ctx.reply('Addressed to?' + rows.reduce((prev, curr, i) => (`${prev}${i}) ${curr}\n`), "\n"));
            return ctx.wizard.next();
        }
        return pool.query("Select name from public.to;")
            .then(({
                rows
            }) => {
                rows = rows.map(({
                    name
                }) => name);
                // console.log(rows);
                ctx.wizard.state.to = rows;
                ctx.reply('Addressed to?' + rows.reduce((prev, curr, i) => (`${prev}${i}) ${curr}\n`), "\n"));
                return ctx.wizard.next();
            })
            .catch(err => {
                console.log(err);
                ctx.reply(JSON.stringify(err));
                return ctx.stage.enter("ABRUPT_CLOSE");
            });
    },
    (ctx) => {
        if (ctx.message.text < 0 || ctx.message.text >= ctx.wizard.state.to.length) {
            ctx.reply("INVALID option inserted: " + ctx.message.text);
            return ctx.scene.enter("ABRUPT_CLOSE");
        }
        ctx.wizard.state.addDoc.to = ctx.wizard.state.to[Number(ctx.message.text)];
        ctx.reply('Add Extra Details. Type NA for no extra information');
        return ctx.wizard.next();
    },
    (ctx) => {
        ctx.wizard.state.addDoc.extraDetails = (ctx.message.text.toLowerCase() === "na") ? "" : ctx.message.text;
        console.log(ctx.wizard.state.addDoc.fileNum, ctx.wizard.state.addDoc.paperSub, ctx.wizard.state.addDoc.to, ctx.wizard.state.addDoc.extraDetails);
        // ctx.reply('Please enter complete paper subject as is');
        return pool.query("insert into public.documents (file_num, paper_subject, sent_to, extra_details) values ($1, $2, $3, $4) returning id;", [ctx.wizard.state.addDoc.fileNum, ctx.wizard.state.addDoc.paperSub, ctx.wizard.state.addDoc.to, ctx.wizard.state.addDoc.extraDetails])
            .then(results => {
                ctx.wizard.state.addDocSuccess = true;
                ctx.reply(`{\nFile Number: ${ctx.wizard.state.addDoc.fileNum}\nSubject: ${ctx.wizard.state.addDoc.paperSub}\nTO: ${ctx.wizard.state.addDoc.to}\nExtra Details: ${ctx.wizard.state.addDoc.extraDetails}\n}\n Has been added with\nENTRY-ID: ${results.rows[0].id}`);
                ctx.reply("Do you want to add another Document?\nEnter 'y' for yes and 'n' for no");
                return ctx.wizard.next();
            })
            .catch(err => {
                console.log(err);
                ctx.reply(JSON.stringify(err));
                return ctx.scene.enter("ABRUPT_CLOSE");
            })
    },
    (ctx, done) => {
        if (ctx.message.text.toLowerCase() === 'y') {
            ctx.wizard.state.addDoc = {
                fileNum: "",
                paperSub: "",
                to: "",
                extraDetails: ""
            };
            return ctx.scene.enter("ADD_DOCUMENT");
        }
        return done();
    }
);
module.exports = createAddDocument;