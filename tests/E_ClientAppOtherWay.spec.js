import { test, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';

test('Webst Client App Login', async({page}) =>
{
    const products = page.locator('.card-body'); //captured all products titles
    const productName = 'ZARA COAT 3';
    const email = 'pramoddshirale@gmail.com';

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login'); // URL

//  other way to fill username and password fields= getByPlaceholder()
    await page.getByPlaceholder('email@example.com').fill('pramoddshirale@gmail.com'); // username field
    await page.getByPlaceholder('enter your passsword').fill('P@ssw0rd'); // password field
    
    //await page.locator("[value='Login']").click(); // login button

//  other way to click on login button = getByRole()
    await page.getByRole('button', { name: 'Login' }).click(); // clicks on login button

    //await page.waitForLoadState('networkidle'); //returns when the required load state has been reached
    await page.locator('.card-body b').first().waitFor(); //waiting atleast first cart to load; networkidle = flaky

//  other way to click on 'Add to Cart' button of desired product = filter() + getByRole()
    await page.locator('.card-body').filter({ hasText: productName }).getByRole('button', { name: 'Add To Cart' }).click(); // clicks on 'Add to Cart' button of desired product

//  other way to click on 'Cart' link from top right corner of page = getByRole() + getByRole()
    await page.getByRole('listitem').getByRole('button', { name: 'Cart' }).click(); // clicks on 'Cart' link from top right corner of page

    await page.locator("div li").first().waitFor();//wait for item/product to load on page

//  other way to assert = verify added product name exist on cart page = getByText()    
    await expect(page.getByText("ZARA COAT 3")).toBeVisible(); 

//  other way to click on 'Checkout' button = getByRole()
    await page.getByRole('button', { name: 'Checkout' }).click(); 
    
//  other way to select country from dynamic dropdown = getByPlaceholder() + pressSequentially() + locator() + waitFor() + locator() + count() + textContent() + click()
     await page.getByPlaceholder('Select Country').pressSequentially("ind"); // pressSequentially()=> to press keys one by one if there is special keyboard handling on the page

//  other way to click on "India" country option from dynamic dropdown = getByRole() + locator() + waitFor() + locator() + count() + textContent() + click()     
    await page.getByRole('button', { name: 'India' }).nth(1).click(); // click on the desired country option

//  other way to click on 'Place Order' button = getByText() + click()    
    await page.getByText('Place Order').click(); // click on the desired country option

//  other way to assert = verify order confirmation message exist on page = getByText() + toBeVisible()
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();





});