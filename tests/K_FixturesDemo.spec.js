const { expect } = require('@playwright/test');
const { customtest } = require('../utils/fixtures.js'); //importing customtest from fixtures.js file

// The fixtures.js file && K_FixturesDemo.spec.js file == both linked/connected/referenced each other.

// FIXTURES

customtest('Fixtures Test Demo', async ({ authenticatedPage, createOrder, testDataForOrder }) => {
    //Login to application - create order - and verify order is created from History page
    await authenticatedPage.goto('https://rahulshettyacademy.com/client');
    await authenticatedPage.locator("button[routerlink*='myorders']").click(); // click on Orders link from order page
    console.log("Clicked on Orders link from Orders page successfully");
    await authenticatedPage.locator("tbody").waitFor(); // wait for tbody i.e. whole oderId table displays/load
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible({timeout: 10000}); // assert = verify orderId is visible on page
    console.log("Verified orderId is visible on page successfully");

    console.log(testDataForOrder.productName);
});