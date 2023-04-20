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
        const $ = await cheerio.load(html);

        let title = $('h2').text();
        let releaseDate = $(".release_date").text();
        let overview = $(".overview > p").text();
        let userScore = $('.user_score_chart').attr('data-percent');
        let imgUrl = $("#main > section > div.header.large.border.first.lazyloaded > div > div > section > div.poster > div.image_content > a > img").attr("src");
        imgUrl = imgUrl.replaceWith('_filter(blur)', '')
        browser.close()

        return {
            title,
            releaseDate,
            overview,
            userScore,
            imgUrl
        }

    } catch(error) {
        console.log(error)
    }
}

app.get('/results', async function(req, res) {
    let url = req.query.search;
    browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();

    let data = await scrapeData(url,page);
    res.render('results', {data:data});
    
});

app.get('/search', (req,res)=>{
    res.render('search');
})

app.listen(3000, ()=>{
    console.log('Server has started')
})
