const { composeWizardScene } = require('../../sceneFactory');

const abruptCloseScene = composeWizardScene(
  (ctx, done) => {
    ctx.reply("ABRUPTLY CLOSED, no data saved");
    console.log("ABRUPTLY CLOSED");
    return done();
  },
);
module.exports.createAbruptCloseScene = abruptCloseScene;