import { test, expect, request } from '@playwright/test';

// request = Exposes API that can be used for the Web API testing.
// test = These tests are executed in Playwright environment that launches the browser and provides a fresh page to each test. 

// THIS TEST CASE => IS TO VERIFY WHETHER ORDER ID CREATED IS AVAILABLE/EXIST ON ORDER HISTORY PAGE OR NOT.
// HENCE ORDER CREATED VIA API TO SAVE TIME IS USEFUL IN THIS CASE. IF PURPOSE TO VERIFY CREATE ORDER FLOW THEN VIA API NOT USEFUL.   

const apiLoginPayload = {userEmail: "param@param.com", userPassword: "P@ssw0rd"} // globally declared and stored values
const orderPayload = {orders: [{country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68"}]} // order payload copied from browser n/w tab - payload 
let token; // let = also allows to create later as well
let orderId; // let = if not using immidiate value of it after declaration as "const" then use "let"


// before all the available "test" it executes once.
// Declares a beforeAll hook that is executed once per worker process before all tests.
// When called in the scope of a test file, runs before all tests in the file. 

test.beforeAll( async()=>
{   
    // Login API

    // apiContext = same way used here like used in another file UIBasicstest.spec.js. using this can call api here instead page
    const apiContext = await request.newContext(); // Creates new instances of APIRequestContext
    // copied api endpoint from browser dev tool - network tab
    // post = Sends HTTP(S) POST request and returns its response.
    // post accepts various arguments like URL, data, etc.
    // post returns response which needs to store in variable 
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
        data:apiLoginPayload
        } )
    // assert the status code = 200 Ok post respose
    expect(loginResponse.ok()).toBeTruthy(); // ok() = Contains a boolean stating whether the response was successful (status in the range 200-299) or not.     
    const loginResponseJson = await loginResponse.json();  // json() = Returns the JSON representation of response body.
    token = loginResponseJson.token;
    console.log(token);

    // API = Create Order API
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers:{
                    'Authorization' : token,
                    'Content-Type'  : 'application/json'
                    },

        })
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);    
    orderId = orderResponseJson.orders[0];
}); 


// Declares a beforeEach hook that is executed before each test.
// When called in the scope of a test file, runs before each test in the file. 

test.beforeEach(   ()=>
{

});

// fixtures
// page = Isolated Page instance, created for each test. Pages are isolated between tests due to fixtures.context isolation.
// This is the most common fixture used in a test.
// browser = Browser instance is shared between all tests in the same worker - this makes testing efficient. 
// However, each test runs in an isolated BrowserContext and gets a fresh environment.

//create order is success
test("@API Place the order", async({page}) =>
{
    await page.addInitScript(value => {

        window.localStorage.setItem('token', value);
    }, token );

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
        if(orderId.includes(orderID_orderHistoryPage))
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
    expect(orderId.includes(orderID_orderSummaryPage)).toBeTruthy(); // assert = both match returns true
    console.log(orderId.includes(orderID_orderSummaryPage));

});

//Verify if order created is showing in history page
// Precondition - create order -