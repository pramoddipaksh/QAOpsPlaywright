const base = require('@playwright/test');

// customtest = from test-base.js file, which is extended from 'test' class of playwright and used to run this test case.
// testDataForOrder = JS Object, fixture data from test-base.js file, which is passed to this test case as an argument.
// This below code is used to run the test case with fixture data from test-base.js file, which is passed to this test case as an argument.
// also it uses customtest = from test-base.js file, which is extended from 'test' class of playwright and used to run this test case.
exports.customtest =  base.test.extend(
{
    //declare custom fixtures here
    testDataForOrder: {
        username: "pramoddshirale@gmail.com",
        password: "P@ssw0rd",
        productName: "ZARA COAT 3"
    }
}
)