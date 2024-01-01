const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapingMatches(url) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/usr/bin/google-chrome',
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  
  page.on("request", (request) => {
    const url = request.url();

    if (url.includes("ads") || url.includes("advertising")) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(url, { waitUntil: "networkidle0" });
         // Scroll down to get all the players list
         await page.evaluate(() => {
          window.scrollBy(0, window.innerHeight * 0,9);
        }); 
    await page.waitForTimeout(3000);
  } catch (error) {
    console.log("Error:", error);
  }
  const results = [];

  try {
    await page.click("#onetrust-accept-btn-handler");
    await page.waitForTimeout(3000);

    const roundElementHandle = await page.waitForSelector("div.event__round");
    const roundElementText = await page.evaluate(
      (element) => element?.textContent?.trim(),
      roundElementHandle
    );

    const divElements = await page.$$(".event__match");
    let first10Elements;

    if (roundElementText?.includes("Round")) {
      first10Elements = divElements.slice(0, 7);
    } else {
      first10Elements = divElements.slice(1, 11);
    }

    for (const matchElement of first10Elements) {
      const homeTeam = await matchElement.$eval(
        ".event__participant--home.fontExtraBold",
        (el) => el.textContent.trim()
      );
      const awayTeam = await matchElement.$eval(
        ".event__participant--away",
        (el) => el.textContent.trim()
      );
      const homeTeamGoals = await matchElement.$eval(
        ".event__score--home",
        (el) => el.textContent.trim()
      );
      const awayTeamGoals = await matchElement.$eval(
        ".event__score--away",
        (el) => el.textContent.trim()
      );

      results.push({
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        endResult: [parseInt(homeTeamGoals), parseInt(awayTeamGoals)],
      });
    }
  } catch (error) {
    console.log("Error during scraping:", error);
  } finally {
    await page.waitForTimeout(1000);
    await browser.close();
  }

  return JSON.stringify(results);
}

module.exports = { scrapingMatches: scrapingMatches };
