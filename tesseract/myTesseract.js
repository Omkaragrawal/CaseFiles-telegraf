const { createScheduler, createWorker } = require('tesseract.js');
const path = require('path');

/**
 * will return a new worker
 * @param {String} [language = "mar+eng"] Add languages to the worker. For multiple use + as separator (mar -> marathi, hin -> hindi, eng -> english).
 * @param {Boolean} [autoLangPath = false] Set this if you do not have language's trained data downloaded. If you set this then download the .traineddata.gz and set langPath.
 * @param {String} [langPath = "./trained_data/"] Path for the worker to get the trained data.
 * @returns {Object} worker Maker sure to use "await worker.terminate()"
 */
const newWorker = async (language = "mar+eng", autoLangPath = false, langPath = path.join(__dirname, "trained_data")) => {
    const worker = (autoLangPath)?createWorker():createWorker({
        langPath: langPath,
    });
    await worker.load();
    // hin ---> Hindi
    // mar ---> Marathi
    // enf ---> English
    await worker.loadLanguage(language);
    await worker.initialize(language);
    return(worker);
};
/**
 * @returns new Scheduler
 * @private
 */
const newScheduler = () => {
    return createScheduler()
};

module.exports = {
    newScheduler,
    newWorker
};

