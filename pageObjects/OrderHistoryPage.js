const { test, expect } = require("playwright/test");
//const {M_ClientAppPageObject} = require('../tests/M_ClientAppPageObject.spec.js'); // import 'M_ClientAppPageObject' class


class OrderHistoryPage {

    // This class is connected with = tests > M_ClientAppPageObject.spec.js

    constructor(page) {
        this.page = page;
        this.ordersTable = page.locator("tbody");
        this.rows = page.locator("tbody tr");
        this.orderIdDetails = page.locator(".col-text");

    }

    async searchCountryAndSelect(orderId) 
    {
        await this.ordersTable.waitFor();

        for (let i = 0; i < await this.rows.count(); ++i) 
            {
            const rowOrderId = await this.rows.nth(i).locator("th").textContent(); //store actual order ID 
            console.log("Row orderID captured as:" + rowOrderId);
            if (orderId.includes(rowOrderId)) 
                {
                await this.rows.nth(i).locator("button").first().click(); // clicks on 'View' button of that row which comes first then delete button 
                break;
            }
        }

    }

    async searchOrderAndSelect(orderId)
    {
        await this.searchCountryAndSelect(orderId);
    }

    async getOrderId() {
        return await this.orderIdDetails.textContent();
    }
}
module.exports = {OrderHistoryPage};  
