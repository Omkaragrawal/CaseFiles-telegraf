const { composeWizardScene } = require('../../sceneFactory');

const ex2 = composeWizardScene(
  (ctx) => {
    ctx.reply('Please enter your Name');
    return ctx.wizard.next();
  },
  (ctx, done) => {
    ctx.wizard.state.name = ctx.message.text;
    return done();
  },
);
module.exports.createEx2Scene = ex2;