const { test, expect } = require('@playwright/test');
const { text } = require('node:stream/consumers');
const {customtest} = require('../utils/test-base.js'); // import 'test' class

const { POManager } = require('../pageObjects/POManager'); // import 'POManager' class



// JSON -> String -> JS Object
const dataset =  JSON.parse(JSON.stringify(require("../utils/PlaceholderTestData.json")));  // Converts a JavaScript Object Notation (JSON) string into an object.

// This class is connected with = pageObjects > LoginPage.js

for(const data of dataset) // for each loop to iterate through the dataset
{
// TEST CASE NUMBER = 1 
// @web = tag name, which is used to run the test case with specific tag name, here it is used to run the test case with @web tag name   
test(`@web Webst Client App Login for ${data.productName}`, async ({ page }) => {

    const poManager = new POManager(page);

    const products = page.locator(".card-body");

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(data.username, data.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);

    await dashboardPage.navigateToOrders();
    const orderHistoryPage = poManager.getOrderHistoryPage();
    await orderHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();

});
}

// This below code is used to run the test case with fixture data from test-base.js file, which is passed to this test case as an argument.
// also it uses customtest = from test-base.js file, which is extended from 'test' class of playwright and used to run this test case.
// TEST CASE NUMBER = 2
customtest(`@web Webst Client App Login`, async ({ page, testDataForOrder }) => { 
        // testDataForOrder = JS Object, fixture data from test-base.js file, which is passed to this test case as an argument
        // customtest = from test-base.js file, which is used to run this test case

    const poManager = new POManager(page);

    const products = page.locator(".card-body");

    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(testDataForOrder.username, testDataForOrder.password);

    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.Checkout();

    

});


/* to run jenkins jobs with Allure Report, use below scripts in package.json file. json file dowsn't allow comments, so added here for reference.
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "regression": "npx playwright test --reporter=line,allure-playwright",      
    "webTests": "npx playwright test --grep @web --reporter=line,allure-playwright",
    "APITests": "npx playwright test --grep @API --reporter=line,allure-playwright",
    "SafariNewConfig": "npx playwright test --config=playwright.config1.js --project=safari"
}
similarly, to run jenkins jobs with default HTML Report, use below scripts in package.json file. json file dowsn't allow comments, so added here for reference.
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "regression": "npx playwright test",      
    "webTests": "npx playwright test --grep @web",
    "APITests": "npx playwright test --grep @API",
    "SafariNewConfig": "npx playwright test --config=playwright.config1.js --project=safari"
}
*/

