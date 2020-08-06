const puppeteer = require("puppeteer");
const fs = require("fs");
                    
function run() {
    return new Promise(async (resolve, reject) => {
        try {

            /* const browser = await puppeteer.launch({
                headless: false
            }); */
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            /* const urls = [
                "https://www.google.com",//false
                "https://www.facebook.com"//false
            ]; */
            const urls = fs.readFileSync('urls.txt','utf8').split("\n");
            //let results = [];
            const results = [];

            const resultSet = "results/resultSet - "+ Date.now()+".txt";
                    

            fs.writeFile(resultSet, "", function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file " + resultSet + " was created!");
            }); 
            
              for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                await page.goto(url, {waitUntil: 'load', timeout: 0});
                //await page.goto(url);
                let products = await page.evaluate(() => {
                    let foundRating = false;
                    if(document.querySelectorAll(".inpage_block_inner > a > img")[0]){
                        foundRating = document.querySelectorAll(".inpage_block_inner > a > img").length > 0;
                    }
                    // && document.querySelectorAll(".inpage_block_inner > a > img")[0].getAttribute("src") === "//media.flixcar.com/f360cdn/Electrolux-70873424-PSGBAP200GE0000P.webp";
                    /* let product = document.querySelector('h1[itemprop=name]').innerText;
                    let items = document.querySelectorAll('[data-ttip-id=sizeGridTooltip] tbody tr td label');
                    items.forEach((element) => {
                        let size = element.getAttribute('for');
                        let stockLevel = "";
                        let nearest_td = element.closest('td');
                        if (nearest_td.classList.contains('low-stock')) {
                            stockLevel = "Low stock"
                        } else if (nearest_td.classList.contains('out-of-stock')) {
                            stockLevel = "Out of stock"
                        } else {
                            stockLevel = "In stock"
                        }
                        results.push({
                            product: product,
                            size: size,
                            stock: stockLevel
                        })
                    }); */
                    /* results.push(foundRating);
                    return results; */
                    return foundRating ? "YES" : "NO";
                })
                fs.appendFile(resultSet, products+"\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file " + resultSet + " was saved! - Completed = " + results.length + " / " + urls.length);
                }); 
                
                
                results.push(products);
            }
            
            browser.close();
            return resolve(results);
            
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);