import express, { Request, Response, NextFunction, Router } from "express";
import puppeteer, {
  Page,
  Browser,
  ConsoleMessage,
  ElementHandle,
  JSHandle,
} from "puppeteer";

// create router
const router: Router = express.Router();

// @route GET api/jobs
// @description Route ro get jobs (test)
// @access Public
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const searchRequest: any = req.query;
    const browser: Browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
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

    //await page.type("#text-input-what", "front");
    await page.type("#text-input-what", searchRequest.jobTitle);
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

              const summaryElement: ElementHandle | null = await jobCard.$(
                "ul"
              );

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
    const jobs = await Promise.all(indeedJobCardsMapping);

    await page.screenshot({ path: "dist/example.png" });

    await browser.close();

    res.send(jobs);
  }
);
module.exports = router;
