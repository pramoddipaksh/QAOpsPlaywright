class CartPage {

    // This class is connected with = tests > M_ClientAppPageObject.spec.js

    constructor(page) {
        this.page = page;
        this.cartProducts = page.locator("div li").first();
        this.productText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
        this.orders = page.locator("button[routerlink*='myorders']");
        this.checkout = page.locator("text=Checkout");
    }

    async verifyProductIsDisplayed(productName) 
    {
        //await this.page.waitForLoadState('networkidle'); //returns when the required load state has been reached

        await this.getProductLocator(productName).waitFor({ state: 'visible' });
    }

    async Checkout() 
    {
        await this.checkout.click();

    }
    getProductLocator(productName) 
    {
        return this.page.locator("h3:has-text('" + productName + "')");

    }

}

module.exports = { CartPage };