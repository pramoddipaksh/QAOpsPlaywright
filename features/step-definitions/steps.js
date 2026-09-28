const { When, Then, Given } = require('@cucumber/cucumber'); // first declare this because we are using cucumber
const { expect } = require('@playwright/test');  // playwright = to launch browser, test = to run test case, expect = assertion
const { POManager } = require('../../pageObjects/POManager'); // import 'POManager' class
const playwright = require('@playwright/test'); // playwright = to launch browser, test = to run test case, expect = assertion

When('a login to Ecommerce application with {string} and {string}', { timeout: 100 * 1000 }, async function (username, password) {
    // Write code here that turns the phrase above into concrete actions


    this.poManager = new POManager(this.page);
    const products = this.page.locator(".card-body");
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(username, password);
});

When('Add {string} to the cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
    this.dashboardPage = this.poManager.getDashboardPage();
    await this.dashboardPage.searchProductAddCart(productName);
    await this.dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the Cart', async function (productName) {
    // Write code here that turns the phrase above into concrete actions
    const cartPage = this.poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(productName);
    await cartPage.Checkout();
});

When('Enter valid details and Place the Order', async function () {
    // Write code here that turns the phrase above into concrete actions
    const ordersReviewPage = this.poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("ind", "India");
    this.orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(this.orderId);
});

Then('Verify order is present in the OrderHistory', async function () {
    // Write code here that turns the phrase above into concrete actions
    await this.dashboardPage.navigateToOrders();
    const orderHistoryPage = this.poManager.getOrderHistoryPage();
    await orderHistoryPage.searchOrderAndSelect(this.orderId);
    expect(this.orderId.includes(await orderHistoryPage.getOrderId())).toBeTruthy();
});


Given('a login to Ecommerce2 application with {string} and {string}',{ timeout: 100 * 1000 }, async function (username, password) {
    
    const userName = this.page.locator('#username'); // username editbox
    const passWord = this.page.locator("[type='password']"); // password editbox
    const signIn = this.page.locator('#signInBtn'); //signIn button
    
    await this.page.goto("https://rahulshettyacademy.com/loginpagePractise"); // "goto" opens URL in browser, page=> global fixture
    console.log(await this.page.title());
    await userName.fill(username);  //type in username editbox
    await passWord.fill(password); //type in password editbox
    await signIn.click();  // click on signInBtn 
});

Then('Verify Error message is displayed', async function () {
   console.log(await this.page.locator("[style*='display: block']").textContent()); //capture error sentence
   await expect(this.page.locator("[style*='display: block']")).toContainText("Incorrect"); 
});





