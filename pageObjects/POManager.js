const { LoginPage } = require('./LoginPage'); // import 'LoginPage' class
const { DashboardPage } = require('./DashboardPage'); // import 'DashboardPage' class
const { CartPage } = require('./CartPage'); // import 'CartPage' class
const { OrderReviewPage } = require('./OrderReviewPage'); // import 'OrdersReviewPage' class
const { OrderHistoryPage } = require('./OrderHistoryPage'); // import 'OrderHistoryPage' class

// This class is connected with = tests > M_ClientAppPageObject.spec.js
// This class is connected with = tests > pageObjects > LoginPage.js
// This class is connected with = tests > pageObjects > DashboardPage.js
// This class is connected with = tests > pageObjects > CartPage.js
class POManager {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
        this.dashboardPage = new DashboardPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.orderReviewPage = new OrderReviewPage(this.page);
        this.orderHistoryPage = new OrderHistoryPage(this.page);

    }

    getLoginPage() {

        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;

    }

    getCartPage() {
        return this.cartPage;
    }

    getOrderReviewPage() {
        return this.orderReviewPage;
    }

    getOrdersReviewPage() {
        return this.orderReviewPage;
    }

    getOrderHistoryPage() {
        return this.orderHistoryPage;
    }

}
module.exports = { POManager };