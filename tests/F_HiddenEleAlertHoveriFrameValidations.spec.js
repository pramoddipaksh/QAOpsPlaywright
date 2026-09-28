const {test, expect} = require ('@playwright/test');

//test.describe.configure({mode: 'parallel'}); // run all tests in parallel mode, default is serial mode
//test.describe.configure({mode: 'serial'}); // run all tests in serial mode, default is serial mode

test("Popup validations", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/#/");

    // page navigations
    //await page.goto("https://www.google.com");
    //await page.goBack(); // go back to previous page
    //await page.goForward(); // go forward to next page

    //verify element = visible / hidden
    await expect(page.locator("#displayed-text")).toBeVisible(); // assert editbox hidden/visible
    await page.locator("#hide-textbox").click(); // clicks on 'hide' button
    await expect(page.locator("#displayed-text")).toBeHidden(); // assert box is hidden

    // Alert / Dialog Popup
    // Emitted when a JavaScript dialog appears, such as alert, prompt, confirm or beforeunload. 
    // Listener must either dialog.accept([promptText]) or dialog.dismiss() the dialog - 
    // otherwise page will freeze waiting for dialog, and actions like click will never finish.
    page.on('dialog', dialog => dialog.accept());  // (method) Page.on(event: "dialog", listener: (dialog: Dialog) => any): Page (+18 overloads)
    await page.locator("#confirmbtn").click(); // clicks confirm button
    // Hover
    // This method hovers over the element by performing the following steps:
    // Wait for actionability checks on the element, unless force option is set.
    // the element into view if needed.
    // Use page.mouse to hover over the center of the element, or the specified position.
    await page.locator("#mousehover").hover();

    //iFrames = frames return list of elements hence store in object
    const framePage = page.frameLocator("#courses-iframe");  // frameLocator() = create a frame locator that will enter the iframe and allow selecting elements in that iframe
    // clicks element inside iframe using frame object
    await framePage.locator("li a[href*='lifetime-access']:visible").click(); // visible = within many elements, only visible element get clicked   
    const textCheck = await framePage.locator(".text h2").textContent(); // store entire captured text inside h2 tag into variable
    console.log(textCheck.split(" ")[1]); // through variable, split entire text via space delimiter and fetch first array index element from array list
    
})

test(" Screenshot & Visual Comparison", async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/#/");
    await expect(page.locator("#displayed-text")).toBeVisible(); // assert editbox hidden/visible

    await page.locator("#displayed-text").screenshot({path: 'tests/screenshots/partialscreenshot.png'}); //element level -> screenshot of only editbox
    await page.locator("#hide-textbox").click(); // clicks on 'hide' button
    
    await page.screenshot({path: 'tests/screenshots/screenshot1.png'}); //page level -> screenshot of entire page
    await expect(page.locator("#displayed-text")).toBeHidden(); // assert box is hidden
});

// Visual Testing = compare current screenshot with baseline screenshot and threshold = 20% difference allowed
test(" Visual Testing", async ({page})=>
{
    await page.goto("https://mail.google.com/");
    expect(await page.screenshot()).toMatchSnapshot('landing.png', { threshold: 0.2 }); // compare current screenshot with baseline screenshot and threshold = 20% difference allowed
})

