import { test, expect, request } from '@playwright/test';

// API UTIL CONCEPT

const {APIUtils} = require('../utils/APIUtils'); // 'APIUtils' class is imported here

// request = Exposes API that can be used for the Web API testing.
// test = These tests are executed in Playwright environment that launches the browser and provides a fresh page to each test. 

// THIS TEST CASE => IS TO VERIFY WHETHER ORDER ID CREATED IS AVAILABLE/EXIST ON ORDER HISTORY PAGE OR NOT.
// HENCE ORDER CREATED VIA API TO SAVE TIME IS USEFUL IN THIS CASE. IF PURPOSE TO VERIFY CREATE ORDER FLOW THEN VIA API NOT USEFUL.   

const apiLoginPayload = {userEmail: "param@param.com", userPassword: "P@ssw0rd"} // globally declared and stored values
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]} // order payload copied from browser n/w tab - payload 
//let token; // let = also allows to create later as well
//let orderId; // let = if not using immidiate value of it after declaration as "const" then use "let"
let response;

// before all the available "test" it executes once.
// Declares a beforeAll hook that is executed once per worker process before all tests.
// When called in the scope of a test file, runs before all tests in the file. 

test.beforeAll( async()=>
{   
    const apiContext = await request.newContext(); // Creates new instances of APIRequestContext
    const apiUtils = new APIUtils(apiContext, apiLoginPayload); // created object of 'apiUtils' & it accepts 2 parameters as stated
    response = await apiUtils.createOrder(orderPayload);
    
}) 

// fixtures
// page = Isolated Page instance, created for each test. Pages are isolated between tests due to fixtures.context isolation.
// This is the most common fixture used in a test.
// browser = Browser instance is shared between all tests in the same worker - this makes testing efficient. 
// However, each test runs in an isolated BrowserContext and gets a fresh environment.

//create order is success
test("Place the order", async({page}) =>
{
    await page.addInitScript(value => {

        window.localStorage.setItem('token', value);
    }, response.token );   //response.token comes now instead token

    await page.goto("https://rahulshettyacademy.com/client/"); // URL
    await page.locator("button[routerlink*='myorders']").click(); //click on 'myorders' link
    console.log("Clicked on 'myorders' link from page");
    await page.locator("tbody").waitFor();//wait for item to load on page
     
    //Order History page
    const rows = await page.locator("tbody tr"); // all rows containing order ID's
    console.log("Rows containing all order Ids from Order History page captured under 'rows' variable");

    //Iterate on all rows containing order ID's to match expected order ID
    for(let i=0; i<await rows.count(); ++i)
    {
        const orderID_orderHistoryPage = await rows.nth(i).locator("th").textContent(); //store actual order ID 
        console.log("orderID_orderHistoryPage captured:" +orderID_orderHistoryPage);
        if(response.orderId.includes(orderID_orderHistoryPage))
        {
            await rows.nth(i).locator("button").first().click(); // clicks on 'View' button of that row which comes first then delete button 
            console.log("Clicked on 'View' button for desired order Id:" +orderID_orderHistoryPage);
            break;
        }
    }
    

    // Order Summary Page
    const orderID_orderSummaryPage = await page.locator(".col-text").textContent();
    // await page.pause();
    console.log("orderID_orderSummaryPage:" +orderID_orderSummaryPage);
    
    // assert - verify both order Ids match
    expect(response.orderId.includes(orderID_orderSummaryPage)).toBeTruthy(); // assert = both match returns true
    console.log(response.orderId.includes(orderID_orderSummaryPage));

});
//Verify if order created is showing in history page
// Precondition - create order -