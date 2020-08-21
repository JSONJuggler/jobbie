import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import puppeteer, { Page, Browser } from "puppeteer";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();
  await page.goto("https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Texas");

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  const result: Array<string> = await page.evaluate(() => {
    let headingsFromPage: NodeListOf<Element> = document.querySelectorAll(
      ".mw-headline"
    );
    const headingsList: Array<Element> = [...headingsFromPage];
    console.log(`url is ${location.href}`);
    return headingsList.map((h) => h.innerHTML);
  });
  await browser.close();
  res.send(result);
});

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client", "build")));

  // Serve index.html on all routes except any api routes above
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

//(async () => {
//const browser: Browser = await puppeteer.launch();
//const page: Page = await browser.newPage();
//await page.goto("https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Texas");

//page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

//const result: Array<string> = await page.evaluate(() => {
//let headingsFromPage: NodeListOf<Element> = document.querySelectorAll(
//".mw-headline"
//);
//const headingsList: Array<Element> = [...headingsFromPage];
//console.log(`url is ${location.href}`);
//return headingsList.map((h) => h.innerHTML);
//});
//await browser.close();
//console.log("Header Array:", result);
//})();
