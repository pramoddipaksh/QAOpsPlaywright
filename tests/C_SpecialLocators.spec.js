import { test, expect } from '@playwright/test';

test('Playwright Special locators', async({page}) => {

    await page.goto("https://rahulshettyacademy.com/angularpractice/");

    // (1). getByLabel()=Allows locating input elements by the text of the associated <label>
    // await page.getByLabel('Check me out if you Love IceCreams!').click(); // click() = click on checkbox
    await page.getByLabel("Check me out if you Love IceCreams!").check(); // check() = ensure checkbox/radio element checked
    // await page.getByLabel('Employed').click(); // click on 'Employed' radio button
    await page.getByLabel("Employed").check(); // check() = ensure checkbox/radio element checked
    await page.getByLabel("Gender").selectOption("Female"); // selectOption()=Selects option or options in <select>

    //(2). getByPlaceholder()=Text to locate the element for. Allows locating input elements by the placeholder text of the associated placeholder="Password" in DOM.
    await page.getByPlaceholder("Password").fill("abc123");

    // (3). getByRole()=Allows locating elements by their ARIA role, ARIA attributes and accessible name
    await page.getByRole("button", {name:'Submit'}).click(); // Submit had class="btn btn-success" attribute; if tag = button exists then works.   

    // (4). getByText()= Allows locating elements that contain given text
    const isVisibleSuccessMsg = await page.getByText(" The Form has been submitted successfully!.").isVisible();
    console.log("Success message is visible with returned value as:" + isVisibleSuccessMsg);

    // (6). --STEP LEVEL WAIT = 5 seconds default timeout for expect assertions; --{timeout:10000} step level with additional default from config
    expect(await page.getByText(" The Form has been submitted")).toBeVisible({timeout: 10_000});


    await page.getByRole("link",{name: 'Shop'}).click(); // click on 'Shop' link
    //assert = Shop Name exist on page. first()=select first matching element. toHaveText()=partial text match
    await expect(page.locator(".my-4").first()).toHaveText("Shop Name");

    //(5) filter()=This method narrows existing locator according to the options, for example filters by text. It can be chained to filter multiple times.
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click(); //getByRole("button") only used bcoz area narrowed upto Nokia and single button only exist hence not required second argument 'name'  

});

    // --STEP LEVEL WAIT = mentioned for perticular step only & scope = step
    // --TEST LEVEL WAIT = mentioned for whole test level only & scope = test 
    // --GLOBAL LEVEL WAIT = mentioned in playwright.config file & scope = whole script 
test('Playwright Test Level Timeout', async({page}) => {

    //--TEST LEVEL WAIT
    const slowExpect = expect.configure({timeout: 9000});  //--test level wait

    //WAIT = Maximum time in milliseconds. This setting will change the default maximum time for all the methods accepting timeout option.
    page.setDefaultTimeout(9000);

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check(); // check() = ensure checkbox/radio element checked
    await page.getByLabel("Employed").check(); // check() = ensure checkbox/radio element checked
    await page.getByLabel("Gender").selectOption("Female"); // selectOption()=Selects option or options in <select>
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name:'Submit'}).click(); // Submit had class="btn btn-success" attribute; if tag = button exists then works.   

    await page.getByText(" The Form has been submitted successfully!.").isVisible(); // isVisible()=only returns bool value; doesn't fail step if bool value not expected returned. 
    const isVisibleSuccessMsg = await page.getByText(" The Form has been submitted successfully!.").isVisible(); 
    console.log("Success message is visible with returned value as:" + isVisibleSuccessMsg);

    // TEST LEVEL WAIT = slowExpect used here
    await slowExpect(page.getByText(" The Form has been submitted successfully!.")).toBeVisible(); // toBeVisible()= assert validates & make fail step if expected value not returned   

    await page.getByRole("link",{name: 'Shop'}).click(); // click on 'Shop' link
    await expect(page.locator(".my-4").first()).toHaveText('Shop Name');
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click(); //getByRole("button") only used bcoz area narrowed upto Nokia and single button only exist hence not required second argument 'name'  




});

