//need to declare this before any test
// const { test, expect } = require('@playwright/test');
import { test, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';

//test(<title of test>, function){} every test takes two parameters: title and function
// @web = tag name, which is used to run the test case with specific tag name, here it is used to run the test case with @web tag name

test('@web Browser Playwright test with browser fixture', async ({ browser }) => {
// test('Browser Playwright test with browser fixture', async ({ browser }) => {
    // browser is a gloabl fixture hence wrap it in curly braces else treated as string
    // browser need to passed as parameter to earch test to use it inside function body
    // JavaScript = Asynchronous meaning no sequence wise execute instead all at once
    
    // browser.newContext() = Creates a new browser context. It won't share cookies/cache with other browser contexts.
    const context = await browser.newContext(); // new fresh browser instance created. await => wait untill this step/page opened

    // context.newPage() = Creates a new page in the browser context.
    const page = await context.newPage(); // store in one variable; page is opened in browser, 

    // see line no. 37,38,39,40 for more details about below 3 line of code;
    // abort() = block the request from loading; route = Represents a route to be intercepted. It is used to fulfill, abort, or continue the request.
    // await page.route("**/*.css",route => route.abort());
    // await page.route("**/*.{jpg,png,jpeg}",route => route.abort()); // block all the images from loading and hence UI will be broken. 
  
    const userName = page.locator('#username');
    // const passWord = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cartTitles = page.locator(".card-body a");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/"); // "goto" opens URL in browser, page=> global fixture

    console.log(await page.title());

//if doesn't have anything to pass in newContext() then playwright have another fixture = "page"
// above line numbers 11, 13 statements ==> can be commented due to "page" fixture is passed in test method declaration 
// along with browser e.g. test('Browser Playwright test', async ({browser, page}) =>
// above and below test methods clearly shows this.

// css, xpath
    // Playwright predominatoly support css selector 
    await page.locator('#username').fill("rahulshetty");  //type in username editbox
    //fill = to type into edit box
    await page.locator("[type='password']").fill("Learning@830$3mK2"); //type in password editbox
    // click()=to click on button
    await page.locator('#signInBtn').click();  // click on signInBtn 
    //textContent() = error/success text messages
    console.log(await page.locator("[style*='display: block']").textContent()); //capture error sentence
    // toContainText = partial match text
    await expect(page.locator("[style*='display: block']")).toContainText("Incorrect");

    await userName.fill(""); // this will clear previously typed text value from editbox to empty
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    // from home page, get first item i.e. iphonex title and prints to console
   // console.log(await page.locator(".card-body a").textContent()); // (.classname<space>tagname=parent to child)
   // first() = return first item from list
 //  console.log(await page.locator(".card-body a").first().textContent()); 
   //nth(1) = return item number mentioned within bracket 
 //  console.log(await cartTitles.nth(1).textContent());

    //if we comment line 48, 50 then allTextContents() of line codes return empty string instead values. 
    // so, to avoid that use 2 approaches 1. waitForLoadState('networkidle') 2. first().waitFor()

    //await page.waitForLoadState('networkidle'); // wait until all network calls happened from page; Not recommended to use as its flaky no assurance of working 

    await page.locator(".card-body a").first().waitFor(); //first()= first matching elements
    //await page.locator(".card-body a").last().waitFor(); // last() = last matching element

    const allTitles = await cartTitles.allTextContents(); //allTextContents() = prints all titles
    console.log(allTitles);

});

test('@web Browser Playwright test with page fixture', async ({ page }) => //using "page" fixture instead "browser" also works same. line 11, 13 can be skipped as page handles
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/");

});

// test.only('Page Playwright test', async ({page}) =>    // ".only" indicate only this test will execute, rest skipped 
test('@web Page Playwright test with .only', async ({ page }) => {

    await page.goto("https://www.google.com");

    //get title - then put assertion
    console.log(await page.title());

    //assertion
    await expect(page).toHaveTitle("Google");  // "expect" is automatic assertion provided by playwright 
});

//UI Controls - radio button, checkbox, dropdown, blinking text
test('@web UI Controls',async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/");

    const userName = page.locator('#username'); // username editbox
    // const passWord = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn'); //signIn button
    const dropdown = page.locator('select.form-control'); //catpure dropdown element
 //drop-down
    await dropdown.selectOption("consult"); // select Consultant value from dropdown
   // await page.pause(); // Pauses script execution and shows selected value in new window

 //radio-button
    await page.locator('.radiotextsty').last().click(); //clicks last option on radio button

    await page.locator('#okayBtn').click(); //clicks on okay button on popup
   
    console.log(await page.locator('.radiotextsty').last().isChecked()); // check last option checked or not, return boolean value

    await expect(page.locator('.radiotextsty').last()).toBeChecked(); //assertion - checks last radio button option checked

//check boxes
    await page.locator('#terms').click(); //clicks on check box
    await expect(page.locator('#terms')).toBeChecked();

    await page.locator('#terms').uncheck(); //uncheck checkbox
    expect(await page.locator('#terms').isChecked()).toBeFalsy(); //assert expected value false matching  
    //expect(await page.locator('#terms').isChecked()).toBeTruthy(); // If expect true value

//check blinking link/text on page
    const documentLink = page.locator("[href*='documents-request']"); //captured locator <attribute=value> 
    await expect(documentLink).toHaveAttribute("class","blinkingText");
});


// Child window handling
test('Child window handling',async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/#/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage] = await Promise.all([  // It returns in array format hence wraped in [] 
//  const [newPage, newPage2] = await Promise.all([ // newPage2 = represent second window if exists   
        context.waitForEvent('page'), //wait for event new page
        documentLink.click(),
    ])
    const text = await newPage.locator(".red").textContent(); //captures locator of text senetence element
    console.log(text); //prints on console

//now, from whole captured sentence, fetch only domain and enter paste into original page username field 
    const arrayText = text.split("@"); // left side of @ comes [0th] index & right side in [1th]index  
    //Please email us at mentor@rahulshettyacademy.com with below template to receive response
    const domainName = arrayText[1].split(" ")[0]; // again split with blank and copy 0th index value
    //rahulshettyacademy.com with below template to receive response
    console.log(domainName); // prints rahulshettyacademy.com
    
    await page.locator('#username').fill(domainName); // .page represent parent page & .newPage represent child page
    //await page.pause();
    console.log(await page.locator('#username').textContent()); //prints empty value from username field to console
    console.log(await page.locator('#username').inputValue()); // prints actual new value due to = inputValue()


});

