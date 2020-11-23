// const workerpool = require('workerpool')
// const express = require('express')
// const tesseractJs = require('tesseract.js');
const {
    newScheduler,
    newWorker
} = require('./myTesseract');
const {
    toImg
} = require("./pdf2png");

console.time("pdf2png");
const pdfjsDist = require('pdfjs-dist/es5/build/pdf');
// const fs = require("fs-extra");
const path = require("path");

console.time('get pdf');
console.time('Total Time');
// Load the PDF file.
const loadingTask = pdfjsDist.getDocument("https://raw.githubusercontent.com/Omkaragrawal/CaseFiles-telegraf/main/tesseract/maa-tele-trial.pdf");
loadingTask.promise
    .then(function (pdfDocument) {
        console.log("# PDF document loaded.");
        console.timeEnd("get pdf");
        const pageCount = pdfDocument.numPages;
        console.log(pageCount);
        // Get the first page.
        let allPages = [];
        const folder = path.join(__dirname, "output", "maa-tele-trial");
        // fs.ensureDir(folder);
        for (let pageNumb = 1; pageNumb <= pageCount; pageNumb++) {
            console.time(`get page(${pageNumb})`);
            allPages.push(toImg(pdfDocument, pageNumb, folder));
        }

        return (Promise.all(allPages));
    })
    .then(values => {
        console.log(values.every(result => result.endsWith(".png")));
        console.timeEnd('Total Time');
        return(values);
    })
    .then(async values => {
        const scheduler = newScheduler();
        const worker1 = await newWorker();
        const worker2 = await newWorker();
        scheduler.addWorker(worker1);
        scheduler.addWorker(worker2);
        const results = Promise.all(values.map(file => scheduler.addJob("recognize", file)));
        await results;
        await scheduler.terminate();
    })
    .catch(err => {
        console.log(err);
        console.timeEnd('Total Time');
    });

