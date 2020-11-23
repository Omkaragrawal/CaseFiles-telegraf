const { composeWizardScene } = require('../../sceneFactory');

const ex1 = composeWizardScene(
  (ctx) => {
    ctx.reply('Please enter your credentials');
    return ctx.wizard.next();
  },
  (ctx, done) => {
    ctx.wizard.state.credentials = ctx.message.text;
    return done();
  },
);

module.exports.createEx1Scene = ex1;