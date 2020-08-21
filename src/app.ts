//import express, { Application, Request, Response, NextFunction } from "express";
//import path from "path";
import puppeteer, { Page, Browser } from "puppeteer";

//const app: Application = express();
//const PORT = process.env.PORT || 5000;

//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//app.use(express.json());

////Serve static assets in production
//if (process.env.NODE_ENV === "production") {
//// Set static folder
//app.use(express.static(path.join(__dirname, "../client", "build")));

//// Serve index.html on all routes except any api routes above
//app.get("*", function (req, res) {
//res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
//});
//}

//interface Dimensions {
//width: number;
//height: number;
//deviceScaleFactor: number;
//}

(async () => {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();
  await page.goto("https://en.wikipedia.org/wiki/COVID-19_pandemic_in_Texas");
  //await page.screenshot({ path: "woot.png" });
  //await browser.waitForTarget(() => false);
  //const result: Dimensions = await page.evaluate(
  //(): Dimensions => {
  //return {
  //width: document.documentElement.clientWidth,
  //height: document.documentElement.clientHeight,
  //deviceScaleFactor: window.devicePixelRatio,
  //};
  //}
  //);
  //console.log("Dimensions:", result);

  const result: Array<string> = await page.evaluate(() => {
    let headingsFromPage: NodeListOf<Element> = document.querySelectorAll(
      ".mw-headline"
    );
    const headingsList: Array<Element> = [...headingsFromPage];
    return headingsList.map((h) => h.innerHTML);
  });
  console.log("Header Array:", result);
  await browser.close();
})();
