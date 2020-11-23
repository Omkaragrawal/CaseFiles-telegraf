const { composeWizardScene } = require('../../sceneFactory');

const CloseScene = composeWizardScene(
  (ctx, done) => {  
    console.log("CLOSED");
    ctx.reply("SUCCESSFULLY CLOSED");
    return done();
  },
);
module.exports.createCloseScene = CloseScene;