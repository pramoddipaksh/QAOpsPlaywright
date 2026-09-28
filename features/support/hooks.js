const { Before, After, BeforeStep, AfterStep, Status } = require("@cucumber/cucumber");
const { POManager } = require('../../pageObjects/POManager'); // import 'POManager' class
const playwright = require('@playwright/test'); // playwright = to launch browser, test = to run test case, expect = assertion


Before(async function () {       // Before = it will execute before each scenario, here we are using async function because we are using await keyword inside the function
    this.browser = await playwright.chromium.launch({ headless: true }); // playwright.chromium.launch() = launch chromium browser, can also use firefox, webkit
    this.context = await this.browser.newContext(); // browser.newContext() = create new browser context, which is like incognito window, can have multiple contexts in one browser
    this.page = await this.context.newPage(); // context.newPage() = create new page in the browser context, can have multiple pages in one context

    this.poManager = new POManager(this.page);

});

After(async function () {   // After = it will execute after each scenario, here we are using async function because we are using await keyword inside the function
    console.log("I am the last to execute after all the steps are executed");

});

BeforeStep(async function () {  // BeforeStep = it will execute before each step, here we are using async function because we are using await keyword inside the function

});

AfterStep(async function ({result}) {   // AfterStep = it will execute after each step, here we are using async function because we are using await keyword inside the function
    if (result.status === Status.FAILED)  // if the step is failed then it will execute the below code
    {
        await this.page.screenshot({ path: 'screenshots/failed-step.png' }); // it will take screenshot of the failed step and save it in the screenshots folder with the name as current timestamp
    }

});