import { test, expect, request } from '@playwright/test';
// NETWORK INTERCEPT CONCEPT = Response

const { APIUtils } = require('../utils/APIUtils'); // 'APIUtils' class is imported here
// request = Exposes API that can be used for the Web API testing.
// test = These tests are executed in Playwright environment that launches the browser and provides a fresh page to each test. 
// THIS TEST CASE => IS TO VERIFY WHETHER ORDER ID CREATED IS AVAILABLE/EXIST ON ORDER HISTORY PAGE OR NOT.
// HENCE ORDER CREATED VIA API TO SAVE TIME IS USEFUL IN THIS CASE. IF PURPOSE TO VERIFY CREATE ORDER FLOW THEN VIA API NOT USEFUL.   
const apiLoginPayload = { userEmail: "param@param.com", userPassword: "P@ssw0rd" } // globally declared and stored values
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] } // order payload copied from browser n/w tab - payload 
const fakePayloadOrders = { data: [], message: "No Orders" };  // fake payload to override the response of the API call to return a fake payload instead of the actual response from the server. This is useful for testing scenarios where you want to simulate different responses from the server without actually making a network request.
// The value fakePayloadOrders i.e. javascript taken from browser network tab after clicking on 'myorders' link and then copied the response payload from there. 

//let token; // let = also allows to create later as well
//let orderId; // let = if not using immidiate value of it after declaration as "const" then use "let"
let response;
// before all the available "test" it executes once.
// Declares a beforeAll hook that is executed once per worker process before all tests.
// When called in the scope of a test file, runs before all tests in the file. 

test.beforeAll(async () => {
    const apiContext = await request.newContext(); // creates a new APIRequestContext instance that can be used to make HTTP requests. It is used to create a new context for making API requests, which allows for isolation between tests and prevents interference from other tests that may be running concurrently.
    const apiUtils = new APIUtils(apiContext, apiLoginPayload); // created object of 'apiUtils' & it accepts 2 parameters as stated
    response = await apiUtils.createOrder(orderPayload); // This line calls the createOrder method of the apiUtils object, passing in the orderPayload as an argument. The method sends a request to the API to create an order and returns the response, which is stored in the response variable. This allows the test to use the response data later on, such as extracting the token for authentication or verifying that the order was created successfully.

})
// fixtures
// page = Isolated Page instance, created for each test. Pages are isolated between tests due to fixtures.context isolation.
// This is the most common fixture used in a test.
// browser = Browser instance is shared between all tests in the same worker - this makes testing efficient. 
// However, each test runs in an isolated BrowserContext and gets a fresh environment.

//create order is success
test("Place the order", async ({ page }) => {
    await page.addInitScript(value => {  // This addInitScript method is used to add a script that will be evaluated in the context of the page before any other scripts are run. It takes a function as an argument, which will be executed in the page context. The value parameter is passed to the function, which can be used to set the value of the 'token' key in the local storage of the browser window.
        window.localStorage.setItem('token', value); // This code sets the value of the 'token' key in the local storage of the browser window to the value passed as an argument to the function.
    }, response.token);   //response.token comes now instead token

    await page.goto("https://rahulshettyacademy.com/client/"); // URL

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/6716420fae2afd4c0ba32be8",  // This end-point taken from browser network tab after clicking on 'myorders' link
        async route =>  //route = Represents a route to be intercepted. It is used to fulfill, abort, or continue the request.
        {
            const response = await page.request.fetch(route.request()); // fetches the request and returns the response
            let body = JSON.stringify(fakePayloadOrders); // converts a JavaScript object or value to a JSON string
            route.fulfill(  // fulfills the request with a custom response; Fulfills route's request with given response.
                {
                    response, // response is the actual response from the request
                    body, // body is the fake payload
                });
        });

    // The above code overrides the response of the API call to return a fake payload instead of the actual response from the server. This is useful for testing scenarios where you want to simulate different responses from the server without actually making a network request.  

    await page.locator("button[routerlink*='myorders']").click(); //click on 'myorders' link
    console.log("Clicked on 'myorders' link from page");
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"); // wait for the response to be received    

    console.log(await page.locator(".mt-4").textContent()); // to print the text content of the "No Orders" message on console    

});
