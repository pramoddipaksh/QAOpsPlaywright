// This fixtures.js file is used to create custom fixtures for Playwright tests. It extends the base test object provided by Playwright to include additional functionality, such as authenticated page access and order creation.
// The fixtures.js file && K_FixturesDemo.spec.js file == both linked/connected/referenced each other.
// The APIUtils.js file also referenced in this fixtures.js file to create order using API call. The APIUtils.js file is used to create a new order using the API and return the response to the test function that will be executed after this fixture is set up.

const base = require('@playwright/test'); // base is further extended using test.extend() method to create a new test object called customtest. This allows us to customize the test environment and add additional functionality to the tests.
const {APIUtils} = require("./APIUtils.js"); // same folder, so just ./APIUtils
const {request} = require('@playwright/test'); // request = Exposes API that can be used for the Web API testing.
const orderPayload = {orders: [{country: 'Cuba', productOrderedId: '6960eac0c941646b7a8b3e68'}]}; // order payload copied from browser n/w tab - payload 
const apiLoginPayload = {userEmail: "param@param.com", userPassword: "P@ssw0rd"}; // globally declared and stored values
// FIXTURES

// base = base is further extended using test.extend() method to create a new test object called customtest. This allows us to customize   
exports.customtest = base.test.extend({
    // first custom fixture
    authenticatedPage: async ({ page }, use) => {
        await page.goto('https://rahulshettyacademy.com/client'); // URL
        await page.locator('#userEmail').fill('param@param.com'); // username field
        await page.locator('#userPassword').fill('P@ssw0rd'); // password field
        await page.locator("[value='Login']").click(); // login button
        await page.waitForLoadState('networkidle'); //returns when the required load state has been reached
        
        await use(page); // use() method is used to pass the page object to the test function that will be executed after this fixture is set up.
    
        // tear down code - after test execution, the below code will be executed. 
        // always write tear down code after use() method, otherwise it will not execute after test execution.
        await context.close(); // close the browser context after test execution
    },

    // second custom fixture
    createOrder: async({}, use)=> 
    {
        // copied below 3 lines from tests/G_APIWebPart1WithAPIUtils.spec.js file
        const apiContext = await request.newContext(); // Creates new instances of APIRequestContext
        const apiUtils = new APIUtils(apiContext, apiLoginPayload); // created object of 'apiUtils' & it accepts 2 parameters as stated
        const response = await apiUtils.createOrder(orderPayload);
        
        await use(response);  
        
        // tear down code
        await apiContext.dispose(); // dispose() = Disposes the APIRequestContext instance and all its resources. After calling this method, the instance can no longer be used.    
    },

    // third custom fixture
    testDataForOrder: {
        productName: 'ADIDAS ORIGINAL', // globally declared and stored values
    }

});