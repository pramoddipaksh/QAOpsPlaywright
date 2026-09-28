// const {M_ClientAppPageObject} = require('../tests/M_ClientAppPageObject.spec.js'); // import 'M_ClientAppPageObject' class


class DashboardPage {
    
    // This class is connected with = tests > M_ClientAppPageObject.spec.js

    constructor(page) {
        this.page = page;
        this.products = page.locator('.card-body'); //captured all products titles
        this.productsText = page.locator('.card-body b'); //all products titles captured
        this.cart = page.locator('[routerlink*="cart"]');
        this.orders = page.locator("button[routerlink*='myorders']");
        //this.page.waitForLoadState('networkidle'); //returns when the required load state has been reached


    }

    async searchProductAddCart(productName) 
    {
        await this.productsText.first().waitFor({ state: 'visible' });
        const allTitles = await this.productsText.allTextContents();
        console.log("All products Titles: " + allTitles); //prints all products titles on console
        const productsCount = await this.products.count();
        console.log("Total product count: " + productsCount);

        for (let i = 0; i < productsCount; ++i) {
            if ((await this.products.nth(i).locator("b").textContent()).trim() === productName) {
                const addToCartButton = this.products.nth(i).getByText('Add To Cart', { exact: true });
                await addToCartButton.waitFor({ state: 'visible' });
                        await addToCartButton.click();
                console.log("Successfully clicked on desired product name 'Add To Cart' button");
                break;
            }
        }



    }

    async navigateToCart() {
        await this.cart.click();

    }

    async navigateToOrders() {
        await this.orders.click();
    }

}
module.exports = { DashboardPage };




