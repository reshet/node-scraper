const fetch = require("node-fetch"),
    cheerio = require("cheerio");

async function fetchPage(url) {
    const page = await fetch(url);
    const text = await page.text();
    const dom = cheerio.load(text);
    return dom;
}

function getContestersFromPage(page) {
    const voices = page('a.uchastnik-item');
    
    return voices.map(function(i, el) {
        const score = page(this).find(".voting .voices span").text();
        const name =  page(this).find(".uchastnik-item-name").text();
        return { name, score };
    }).get();
}

async function fetchAll() {
    const allContesters = [];
    for (let i = 1; i < 20; i++) {
        const page = await fetchPage(`http://libresse.viva.ua/members?page=${i}`);
        const parsed = getContestersFromPage(page);
        allContesters.push(...parsed);
    }

    const sorted = allContesters.sort((a, b) => b.score - a.score);
    
    sorted.forEach((el, index) => {
        console.log(`#${index}: ${el.name} - ${el.score}`);
    });
}

fetchAll();