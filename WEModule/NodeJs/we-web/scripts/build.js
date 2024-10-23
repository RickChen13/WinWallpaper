const fs = require("fs");


console.time('转换耗时');
const distPath = './dist/index.html';//打包路径的index.html
let htmlText = fs.readFileSync(distPath, 'utf8');


let res = htmlText.replace(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<script[^>]*nomodule>[^<]*!function[\s\S]*?<\/script>/g, '')
    .replace(/nomodule/g, '')
    .replace(/crossorigin/g, '')
    .replace(/data-src/g, 'src');

fs.writeFileSync(distPath, res, 'utf8');
console.timeEnd('转换耗时');