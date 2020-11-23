const util = require('util');
const stream = require('stream');

console.time("Time");

const path = require('path');
const fs = require('fs-extra');

const {
    newScheduler,
    newWorker
} = require('./myTesseract');
const { Readable, Writable } = require('stream');



const values = [
    'D:\\Projects\\Telegram\\CaseFiles-telegraf\\tesseract\\output\\maa-tele-trial\\1.png',
    'D:\\Projects\\Telegram\\CaseFiles-telegraf\\tesseract\\output\\maa-tele-trial\\2.png'
];

(async () => {
    const scheduler = newScheduler();
    const worker1 = await newWorker("mar");
    const worker2 = await newWorker("mar");
    await worker1;
    await worker2;
    scheduler.addWorker(worker1);
    scheduler.addWorker(worker2);
    try {
        const results = Promise.all(values.map(file => scheduler.addJob("recognize", file)));
        console.log("Promise.all sent");
        // await results;
        // console.log(await results);
        const output = (await results).map(({data: { text }}, i) => {
            return({text});
        });
        ((a) => console.log("Start write file"))(await results);
        await fs.writeFile("out-mar.json", JSON.stringify(await output));
        // console.log("Writing JSON");
        await fs.writeJSON(path.join(__dirname, "output.json"), JSON.parse(JSON.stringify(await results)));

        console.timeEnd("Time");
        await scheduler.terminate();
    } catch (err) {
        console.log(err);
        console.timeEnd("Time");
        await scheduler.terminate();
    }
})()