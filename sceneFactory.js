const WizardScene = require('telegraf/scenes/wizard');

const unwrapCallback = async (ctx, nextScene) => {
  const nextSceneId = await Promise.resolve(nextScene(ctx));
  if (nextSceneId) return ctx.scene.enter(nextSceneId, ctx.scene.state);
  console.log("Leaving scene: ");
  // console.log(ctx.scene);
  return ctx.scene.leave();
};

/**
 * Takes steps as arguments and returns a sceneFactory
 *
 * Additionally does the following things:
 * 1. Makes sure next step only triggers on `message` or `callbackQuery`
 * 2. Passes second argument - doneCallback to each step to be called when scene is finished
 */
module.exports.composeWizardScene = (...advancedSteps) => (
  /**
   * Branching extension enabled sceneFactory
   * @param sceneType {string}
   * @param nextScene {function} - async func that returns nextSceneType
   */
  function createWizardScene(sceneType, nextScene) {
    return new WizardScene(
      sceneType,
      ...advancedSteps.map((stepFn) => async (ctx, next) => {
        /** ignore user action if it is neither message, nor callbackQuery */
        if (!ctx.message && !ctx.callbackQuery) return undefined;
        if (ctx.message.text === "/close" && ctx.wizard.cursor !== 0) {// && ctx.scene.wizard.cursor !== ctx.scene.scenes.indexOf("ABRUPT_CLOSE") && ctx.scene.wizard.cursor !== ctx.scene.scenes.indexOf("CLOSE")) {
          // console.log("before close")
          console.log("\n\n\n");
          console.log(ctx.wizard.cursor);
          // console.log(ctx.scene.scenes.indexOf('CLOSE'));
          // console.log(ctx.scene.scenes.indexOf('ABRUPT_CLOSE'));
          // console.log("Entered Close");
          // return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
          return ctx.scene.enter("ABRUPT_CLOSE");
        } else {
          return stepFn(ctx, () => unwrapCallback(ctx, nextScene), next);
        }
      }),
    );
  }
);