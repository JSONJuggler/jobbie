import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import puppeteer, {
  Page,
  Browser,
  Target,
  ConsoleMessage,
  Cookie,
  ElementHandle,
  JSHandle,
} from "puppeteer";
// @ts-ignore
import cookie from "cookie";
import fs from "fs";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const browser: Browser = await puppeteer.launch();
    const page: Page = await browser.newPage();
    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );

    await page.goto("https://indeed.com");

    await browser.waitForTarget(
      (target: Target): boolean => {
        //console.log(target.url());
        return (
          target.url().startsWith("https://www.indeed.com/") ||
          target.url() === "https://secure.indeed.com/account/view"
        );
      },
      { timeout: 0 }
    );

    await page.type("#text-input-what", "front");
    await page.screenshot({ path: "dist/example.png" });

    await browser.close();
    res.send("Hello");
  }
);

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
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();
  page.on("console", (msg: ConsoleMessage): void =>
    console.log("PAGE LOG:", msg.text())
  );

  await page.goto("https://indeed.com");

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

  await page.type("#text-input-what", "front");
  await page.click(".icl-Button");
  await page.waitForNavigation();

  const indeedJobCards: Array<ElementHandle> = await page.$$(
    ".jobsearch-SerpJobCard"
  );

  const indeedJobCardsMapping: Array<Promise<any>> = indeedJobCards.map(
    async (jobCard: ElementHandle): Promise<any> => {
      const titleElement: ElementHandle | null = await jobCard.$(
        "[target=_blank]"
      );
      // the title is actually inside the a tag with target=_blank, not the element with title class
      //const titleElement = await h.$(".title");
      //console.log(titleElement);
      if (titleElement) {
        const jobTitle: JSHandle<any> = await titleElement.getProperty(
          "innerText"
        );

        const link: JSHandle<any> = await titleElement.getProperty("href");

        const companyNameElement: ElementHandle | null = await jobCard.$(
          ".company"
        );

        if (companyNameElement) {
          const companyName: JSHandle<any> = await companyNameElement.getProperty(
            "innerText"
          );

          const locationElement: ElementHandle | null = await jobCard.$(
            ".location"
          );

          if (locationElement) {
            const location: JSHandle<any> = await locationElement.getProperty(
              "innerText"
            );

            const summaryElement: ElementHandle | null = await jobCard.$("ul");

            if (summaryElement) {
              const summary: JSHandle<any> = await summaryElement.getProperty(
                "innerText"
              );

              const dateElement: ElementHandle | null = await jobCard.$(
                ".date"
              );

              if (dateElement) {
                const date: JSHandle<any> = await dateElement.getProperty(
                  "innerText"
                );

                return {
                  jobTitle: await jobTitle.jsonValue(),
                  link: await link.jsonValue(),
                  companyName: await companyName.jsonValue(),
                  location: await location.jsonValue(),
                  summary: await summary.jsonValue(),
                  date: await date.jsonValue(),
                };
              }
            }
          }
        }
      }
    }
  );
  console.log(await Promise.all(indeedJobCardsMapping));
  //const headingsList: Array<Element> = [...headingsFromPage];
  //const result: Array<string> = await page.evaluate(() => {
  //let headingsFromPage: NodeListOf<Element> = document.querySelectorAll(
  //".jobsearch-SerpJobCard"
  //);

  //const headingsList: Array<Element> = [...headingsFromPage];
  //console.log(`url is ${location.href}`);
  //return headingsList.map((h) => {
  //console.log(h);
  //return h.innerHTML;
  //});
  //});
  //console.log(result);

  await page.screenshot({ path: "dist/example.png" });

  await browser.close();
})();
