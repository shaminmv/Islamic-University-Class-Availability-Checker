import puppeteer from "puppeteer";
import twilio from "twilio";
import cron from "node-cron";
// Fill creds below
const accountSid = "ACxxx";
const authToken = "466xxx";

const client = twilio(accountSid, authToken);

// cron schedule is running the cron job every 1 minute to check if the instructor is avaialable
cron.schedule("*/1 * * * *", () => {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      // args: ['--profile-directory="Profile 1"'],
      // fill your user directory for chrome here. You will need to edit yours acc..
      userDataDir:
        "C:\\Users\\Shamin\\AppData\\Local\\Google\\Chrome\\User Data",
    });

    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1200 });
    await page.goto("https://services.iu.edu.sa/services");

    await page.goto("  https://cas.iu.edu.sa/cas/eregister", {
      waitUntil: "networkidle0",
    });

    // there must be a way to do this better, but i don't want to spend more time so i chose the coodinates to click
    await page.mouse.move(490, 91, {
      waitUntil: "networkidle0",
    });

    await page.mouse.click(490, 91, { delay: 30 });

    await page.keyboard.press("Tab", { delay: 30 });

    await page.keyboard.press("ArrowDown", { delay: 30 });

    await page.keyboard.press("Enter", { delay: 50 });
    await page.waitForNavigation();

    // i am checking second row.... this can be automated .. again no time. gotta get the insturctor asap.
    const paragrapahs = await page.evaluate(() => {
      let selectedItem = document.getElementsByTagName("table")[14].rows[1];
      let innerShit = selectedItem.cells[5].innerText;
      return innerShit;
    });

    if (paragrapahs === "مغلقة") {
      console.log("not open");
    } else {
      console.log("open");
      client.messages
        .create({
          body: "Sheikh Available",
          from: "IU",
          // enter your number here
          to: "+960777777",
        })
        .then((message) => console.log(message.sid));
    }

    await browser.close();
  })();
});
