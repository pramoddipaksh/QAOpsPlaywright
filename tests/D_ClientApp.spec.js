import { test, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';

//test.skip('Webst Client App Login', async({page}) =>  // test.skip = it will skip the test case execution, test.only = it will run only this test case and skip all other test cases
test('Webst Client App Login', async({page}) =>
{
    const products = page.locator('.card-body'); //captured all products titles
    const productName = 'ZARA COAT 3';
    const email = 'pramoddshirale@gmail.com';``

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login'); // URL
    await page.locator('#userEmail').fill('pramoddshirale@gmail.com'); // username field
    await page.locator('#userPassword').fill('P@ssw0rd'); // password field
    await page.locator("[value='Login']").click(); // login button
 // await page.waitForLoadState('networkidle'); //returns when the required load state has been reached
    await page.locator('.card-body b').first().waitFor(); //waiting atleast first cart to load; networkidle = flaky

    const allTitles = await page.locator('.card-body b').allTextContents(); //all products titles captured
    console.log("All products Titles: " +allTitles); //prints all products titles on console

     const productsCount = await products.count();
     console.log("Total product count: " +productsCount);

     for(let i=0; i<productsCount; ++i)
     {
        if(await products.nth(i).locator('b').textContent()=== productName)
        {
            // add to cart
            await products.nth(i).locator('text= Add To Cart').click();
            console.log("Successfully clicked on desired product name 'Add To Cart' button");
            break;
        }
     }
     //click on 'cart' link
     await page.locator('[routerlink*="cart"]').click(); 
     console.log("Clicked on 'cart' link from page");
     await page.locator("div li").first().waitFor();//wait for item/product to load on page
     const bool = await page.locator("h3:has-text('ZARA COAT 3')").isVisible(); //verify added product name exist
     console.log("Text 'ZARA COAT 3' is visible on page and returned boolean value as:" +bool);
     expect(bool).toBeTruthy(); // assert true value

     //click on checkout
     await page.locator("text=Checkout").click();
     console.log("Clicked on 'Checkout' button");
    
     //click on country dropdown
     await page.locator("[placeholder*='Country']").pressSequentially("ind",{ delay: 150 }); // pressSequentially()=> to press keys one by one if there is special keyboard handling on the page
    
    //
    const countryDropdown = await page.locator(".ta-results"); //locator dropdown with multiple values displayed after "ind" typed
    await countryDropdown.waitFor(); //waits
    const countyDropdownOptionsCount = await countryDropdown.locator("button").count(); // count how many options displayed
    console.log("county dropdown options count: " +countyDropdownOptionsCount);

    for(let i=0; i<countyDropdownOptionsCount; ++i) // iterate on dropdown options to see desired name to find and click on it
    {
        const text = await countryDropdown.locator("button").nth(i).textContent(); // text = saves each option text
        if(text === " India") // checks if text=desired text matches
        {
            await countryDropdown.locator("button").nth(i).click(); // after match found with desired text then click on it
            console.log("successfully clicked on 'India' from dynamic dropdown");
            break;
        }
    }
    // Assert = verify the first text of email displays on page
    expect(await page.locator(".user__name [type='text']").first()).toHaveText(email);
    console.log("Assert - successfully verified email displayed on oders page");

    //fill personal information 
    //await page.locator("input.text-validated").first().fill('4542 9931 9292 2293'); // credit card number

    await page.locator(".action__submit").click(); // click on 'Place Order' button
    console.log("Clicked on 'Place Order' button");

    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. "); //assert expected text displayed
    console.log(" Displayed successful message - Thankyou for the order. ");

    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent(); //copy orderId
    console.log("Order Id captured after transaction successful" +orderId); // print orderId

    await page.locator("button[routerlink*='myorders']").click(); // click on Orders link from order page
    console.log("Clicked on Orders link from Orders page successfully");
    await page.locator("tbody").waitFor(); // wait for tbody i.e. whole oderId table displays/load

    //Order History page
    const rows = await page.locator("tbody tr"); // all rows containing order ID's
    console.log("Rows containing all order Ids from Order History page captured under 'rows' variable");

    //Iterate on all rows containing order ID's to match expected order ID
    for(let i=0; i<await rows.count(); ++i)
    {
        const orderID_orderHistoryPage = await rows.nth(i).locator("th").textContent(); //store actual order ID 
        console.log("orderID_orderHistoryPage captured:" +orderID_orderHistoryPage);
        if(orderId.includes(orderID_orderHistoryPage))
        {
            await rows.nth(i).locator("button").first().click(); // clicks on 'View' button of that row which comes first then delete button 
            console.log("Clicked on 'View' button for desired order Id:" +orderID_orderHistoryPage);
            break;
        }
    }

    // Order Summary Page
    const orderID_orderSummaryPage = await page.locator(".col-text").textContent();
    console.log("orderID_orderSummaryPage:" +orderID_orderSummaryPage);
    
    // assert - verify both order Ids match
    console.log(expect(orderId.includes(orderID_orderSummaryPage)).toBeTruthy()); // assert = both match returns true
 

     //await page.pause();



});