import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import puppeteer, {
  Page,
  Browser,
  Target,
  ConsoleMessage,
  Cookie,
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
    const browser: Browser = await puppeteer.launch({
      headless: false,
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
      async (): Promise<void> => {
        res.send("Browser closed");
        return await browser.close();
      }
    );
    page.on("console", (msg: ConsoleMessage): void =>
      console.log("PAGE LOG:", msg.text())
    );

    await page.goto("https://secure.indeed.com/account/login");

    // careful, code pauses here if there is no navigation to either of the urls below

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

    let currentCookies: Array<Cookie> = await page.cookies();

    //await page.screenshot({ path: "dist/example.png" });

    await browser.close();

    const cookies: Array<string> = currentCookies.map(
      (currentCookie: Cookie): string => {
        const {
          name,
          value,
        }: //domain,
        //path,
        //expires,
        //size,
        //httpOnly,
        //secure,
        //session,
        Cookie = currentCookie;
        //console.log(new Date(expires));
        return cookie.serialize(name, value, {
          //domain,
          //path,
          //expires: new Date(expires),
          //size,
          //httpOnly,
          //secure,
          //session,
        });
      }
    );
    //console.log(cookies);
    res.setHeader("set-cookie", cookies);
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
