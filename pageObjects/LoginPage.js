//const {M_ClientAppPageObject} = require('../tests/M_ClientAppPageObject.spec.js'); // import 'M_ClientAppPageObject' class

class LoginPage {

// This class is connected with = tests > M_ClientAppPageObject.spec.js


    constructor(page) {
        this.page = page;
        this.signInButton = page.locator("[value='Login']"); // login button
        this.userName = page.locator('#userEmail');
        this.password = page.locator('#userPassword');
    }

    async goTo() {
    await this.page.goto(
        "https://rahulshettyacademy.com/client/#/auth/login",
        { waitUntil: "domcontentloaded", timeout: 60000 }
    );
    }   

    async validLogin(username, password) {
        await this.userName.type(username);
        await this.password.type(password);
        await this.signInButton.click();
    }


}
module.exports = { LoginPage };