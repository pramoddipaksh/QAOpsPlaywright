import { test, expect } from '@playwright/test';

// NETWORK INTERCEPT CONCEPT = Request

test("Security Test Request Intercept", async ({ page }) => {
    // login and reach orders page 
    await page.goto('https://rahulshettyacademy.com/client/#/auth/login'); // URL
    await page.locator('#userEmail').fill('pramoddshirale@gmail.com'); // username field
    await page.locator('#userPassword').fill('P@ssw0rd'); // password field
    await page.locator("[value='Login']").click(); // login button

    // see line no. 40 to 43 for mode details about below 2 line code   
    //page.on('request',request => console.log(request.url())); // to print all the request urls on console
    //page.on('response',response => console.log(response.url(),response.status())); // to print all the response urls and status on console    

    await page.waitForLoadState('networkidle'); //returns when the required load state has been reached
    await page.locator('.card-body b').first().waitFor(); //waiting atleast first cart to load; networkidle = flaky
 
    await page.locator("button[routerlink*='myorders']").click(); // click on Orders link from order page
    console.log("Clicked on Orders link from Orders page successfully");

    // route is used to intercept network requests and modify their behavior. It allows you to intercept requests made by the page and modify their response, or even block them entirely. This can be useful for testing scenarios where you want to simulate different responses from the server without actually making a network request.
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        async route => route.continue({ url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=6a8afd0821054ba465eci85g" })); // This end-point taken from browser network tab after clicking on 'myorders' link but id was changed to 1234 to simulate the scenario of invalid order id. 
    // This is done to verify security test of the application to check whether the order id is valid or not. If the order id is invalid then it should not display the order details page and should display an error message.
    // continue() methid is used to continue the request with the modified URL. It takes an object as an argument, which can contain various properties to modify the request, such as the URL, method, headers, and body. In this case, we are only modifying the URL property to point to a different order id.
    // We are intercepting before clicking on 'View' button of the order id and then changing the order id to a different one to simulate the scenario of invalid order id. 
    await page.locator("button:has-text('View')").first().click(); // click on 'View' button
    
    //await expect(page.locator("p:has-text('You are not authorize to view this order')").textContent()).toBeTruthy(); // to print the text content of the "You are not authorized to view this order" message on console       
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order"); // to verify the text content of the "You are not authorized to view this order" message on console
    
    //console.log(await page.locator(".blink_me").textContent()); // to print the text content of the "You are not authorized to view this order" message on console
    console.log(await page.locator("p:has-text('You are not authorize to view this order')").textContent()); // to print the text content of the "You are not authorized to view this order" message on console    
    //await page.pause();

    // see line no. 18,19,20 in B_UIBasicstest.spec.js for more details about below 2 line of code used there;
    // abort() = block the request from loading; route = Represents a route to be intercepted. It is used to fulfill, abort, or continue the request.
    // await page.route("**/*.css",route => route.abort()); // put this line after web page URL loads on browser and see the difference in UI. It will block all the css files from loading and hence UI will be broken. 
    // await page.route("**/*.{jpg,png,jpeg}",route => route.abort()); // block all the images from loading and hence UI will be broken.

    // see line no. 12, 13 used above; below 2 line of code can be uncommented to see its working.
    // on() = Registers an event handler for the specified event type. It allows you to listen for specific events that occur on the page, such as network requests, responses, console messages,etc. When the specified event occurs, the provided callback function is executed, allowing you to perform custom actions or assertions based on the event data. 
    //page.on('request',request => console.log(request.url())); // to print all the request urls on console
    //page.on('response',response => console.log(response.url(),response.status())); // to print all the response urls and status on console    

});

