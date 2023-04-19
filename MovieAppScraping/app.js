const express = require('express');
const app = express();
const path = require('path')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

let browser;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

async function scrapeData(url, page) {
    try {
        await page.goto(url, {waitUntil : 'load', timeout : 0})
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);


        return {

        }
    } catch(error) {
        console.log(error)
    }
}

async function getResults(req, res) {

}
app.get('/results', async function(req, res) {
    let url = req.query.search;
    browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    let data = await scrapeData(url,page);
    browser.close()
});

app.get('/search', (req,res)=>{
    res.render('search');
})

app.listen(3000, ()=>{
    console.log('Server has started')
})
