import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import puppeteer, { Page, Browser, Target, ConsoleMessage } from "puppeteer";
import fs from "fs";
//import cookies from "../cookies.json";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
  //res.send(result);
  res.send("Hello");
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

(async (): Promise<void> => {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ["--window-size=400,600"],
  });
  const page: Page = await browser.newPage();
  await page.setViewport({
    width: 500,
    height: 600,
    deviceScaleFactor: 1,
  });
  browser.on(
    "targetdestroyed",
    async (): Promise<void> => await browser.close()
  );
  page.on("console", (msg: ConsoleMessage): void =>
    console.log("PAGE LOG:", msg.text())
  );

  // check if we have a previously saved session
  //if (!Object.keys(cookies).length) {
  if (false) {
    //console.log(Object.keys(cookies).length);
    // set the saved cookes in the puppeteer browser page
    //await page.setCookie(...cookies);
    console.log("here");
    await page.goto("https://www.indeed.com/");
  } else {
    const qbrowser: Browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=400,600"],
    });
    const qpage: Page = await qbrowser.newPage();
    await qpage.setViewport({
      width: 500,
      height: 600,
      deviceScaleFactor: 1,
    });
    qbrowser.on(
      "targetdestroyed",
      async (): Promise<void> => await qbrowser.close()
    );
    qpage.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );
    //await qpage.goto("https://www.indeed.com/");
    await qpage.goto("https://secure.indeed.com/account/login");

    // careful, code pauses here if there is no navigation to either of the urls below
    await qbrowser.waitForTarget(
      (target: Target): boolean => {
        console.log(target.url());
        return (
          target.url().startsWith("https://www.indeed.com/") ||
          target.url() === "https://secure.indeed.com/account/view"
        );
      },
      { timeout: 0 }
    );

    let currentCookies = await qpage.cookies();
    const qqbrowser: Browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=400,600"],
    });
    const qqpage: Page = await qqbrowser.newPage();
    await qqpage.setCookie(...currentCookies);
    await qqpage.goto("https://www.indeed.com/");
    console.log("test");

    //fs.writeFileSync("./cookies.json", JSON.stringify(currentCookies));
  }

  await page.goto("https://secure.indeed.com/account/login");

  //await browser.waitForTarget(
  //(target: Target): boolean => {
  ////console.log(target.url());
  //return (
  //target.url().startsWith("https://www.indeed.com/") ||
  //target.url() === "https://secure.indeed.com/account/view"
  //);
  //},
  //{ timeout: 0 }
  //);

  await page.screenshot({ path: "dist/example.png" });

  //const result: Array<string> = await page.evaluate(() => {
  //let headingsFromPage: NodeListOf<Element> = document.querySelectorAll(
  //".mw-headline"
  //);
  //const headingsList: Array<Element> = [...headingsFromPage];
  //console.log(`url is ${location.href}`);
  //return headingsList.map((h) => h.innerHTML);
  //});
  await browser.close();
  //console.log("Header Array:", result);
})();
