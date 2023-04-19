const express = require('express');
const app = express();
const path = require('path')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

app.set('view', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

async function scrapeData(url, page) {
    try {
        await page.goto(url, {waitUntil : 'load', timeout : 0})
        const html = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(html);

        let title = $('h1').text();

        return {
            title
        }
    } catch(error) {
        console.log(error)
    }
}

async function getResults() {
    browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    let data = await scrapeData('https://en.wikipedia.org/wiki/Avatar:_The_Last_Airbender', page)
    console.log(data.title)
    browser.close();

}

getResults()