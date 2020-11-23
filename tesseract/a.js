const pdfjsDist = require('pdfjs-dist');

const pdf = pdfjsDist.getDocument("https://raw.githubusercontent.com/Omkaragrawal/CaseFiles-telegraf/main/tesseract/13_AAD_Assignment-2.pdf");

pdf.promise.then(pdf => {
    console.log(pdf.numPages);
    const data = pdf.fingerprint;
    console.log(data);
})
.catch(err => {
    console.log(err);
})