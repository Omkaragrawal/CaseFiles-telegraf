const { composeWizardScene } = require('../../sceneFactory');

const actionScene = composeWizardScene(
  (ctx) => {
    ctx.reply("Hello There!!!");
    return ctx.wizard.next();
  },
  (ctx, done) => {
    ctx.reply("Let's Start with the Scene!!!");
    return done();
  },
);
module.exports.createActionScene = actionScene;