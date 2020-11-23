const Canvas = require("canvas");
const assert = require("assert").strict;
const path = require("path");
const fs = require("fs-extra");

// Taken from https://github.com/mozilla/pdf.js/blob/master/examples/node/pdf2png/pdf2png.js
class NodeCanvasFactory {
    constructor() {
        // super();
    }
    create = function NodeCanvasFactory_create(width, height) {
        assert(width > 0 && height > 0, "Invalid canvas size");
        var canvas = Canvas.createCanvas(width, height);
        var context = canvas.getContext("2d");
        return {
            canvas: canvas,
            context: context,
        };
    };

    reset = function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    };

    destroy = function NodeCanvasFactory_destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    };
}

// NodeCanvasFactory.prototype = {

// };
/**
 * @param  {Object} doc
 * @param  {Int} pageNum
 * @param  {String} dir
 */
const toImg = (doc, pageNum, dir = path.join(__dirname, "output")) => {
    return (new Promise((resolve, reject) => {
        doc.getPage(pageNum).then(function (page) {
                console.timeEnd(`get page(${pageNum})`);
                console.time(`(${pageNum})canvas`);
                // Render the page on a Node canvas with 100% scale.
                const viewport = page.getViewport({
                    scale: 1.0
                });
                const canvasFactory = new NodeCanvasFactory();
                const canvasAndContext = canvasFactory.create(
                    viewport.width,
                    viewport.height
                );
                const renderContext = {
                    canvasContext: canvasAndContext.context,
                    viewport: viewport,
                    canvasFactory: canvasFactory,
                };

                const renderTask = page.render(renderContext);
                renderTask.promise.then(function () {
                        // Convert the canvas to an image buffer.
                        const image = canvasAndContext.canvas.toBuffer();
                        // fs.writeFileSync("", image, )
                        fs.outputFile(path.join(dir, pageNum + ".png"), image, function (error) {
                            if (error) {
                                console.error("Error: " + error);
                                console.timeEnd(`(${pageNum})canvas`);
                                reject(error)
                            } else {
                                console.timeEnd(`(${pageNum})canvas`);
                                resolve(path.join(dir, pageNum + ".png"));
                            }
                        });
                    })
                    .catch(err => {
                        reject(err)
                    });
            })
            .catch(function (reason) {
                console.log(reason);
                reject(reason);
            });
    }));
};

module.exports = {
    toImg
}