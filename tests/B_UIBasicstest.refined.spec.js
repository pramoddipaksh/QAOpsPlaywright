const { test, expect } = require('@playwright/test');

const loginUrl = 'https://rahulshettyacademy.com/loginpagePractise/#/';
const validUsername = 'rahulshettyacademy';
const validPassword = 'Learning@830$3mK2';

test('@web Login shows an error for an invalid username', async ({ page }) => {
    await page.goto(loginUrl);

    await page.locator('#username').fill('rahulshetty');
    await page.locator('[type="password"]').fill(validPassword);
    await page.locator('#signInBtn').click();

    await expect(page.getByText(/Incorrect/i)).toBeVisible();
});

test('@web Login opens the shop for valid credentials', async ({ page }) => {
    await page.goto(loginUrl);

    await page.locator('#username').fill(validUsername);
    await page.locator('[type="password"]').fill(validPassword);
    await page.locator('#signInBtn').click();

    await expect(page).toHaveURL(/\/shop$/);
    await expect(page.getByText('iphone X', { exact: true })).toBeVisible();
});

test('@web UI controls select and verify form options', async ({ page }) => {
    await page.goto(loginUrl);

    const roleDropdown = page.locator('select.form-control');
    await roleDropdown.selectOption('consult');
    await expect(roleDropdown).toHaveValue('consult');

    const radioButtons = page.locator('.radiotextsty');
    const lastRadioButton = radioButtons.last();
    await lastRadioButton.click();
    await page.locator('#okayBtn').click();
    await expect(lastRadioButton).toBeChecked();

    const termsCheckbox = page.locator('#terms');
    await termsCheckbox.check();
    await expect(termsCheckbox).toBeChecked();
    await termsCheckbox.uncheck();
    await expect(termsCheckbox).not.toBeChecked();

    await expect(page.locator('a[href*="documents-request"]'))
        .toHaveClass(/blinkingText/);
});

test('@web Popup displays the support email domain', async ({ page }) => {
    await page.goto(loginUrl);

    const popupPromise = page.waitForEvent('popup');
    await page.locator('a[href*="documents-request"]').click();
    const popup = await popupPromise;

    const popupText = await popup.locator('.red').innerText();
    const emailAddress = popupText.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0];
    expect(emailAddress).toBeDefined();
    if (!emailAddress) {
        throw new Error('Expected the popup to contain a support email address.');
    }

    const emailDomain = emailAddress.split('@')[1];
    const usernameInput = page.locator('#username');
    await usernameInput.fill(emailDomain);
    await expect(usernameInput).toHaveValue(emailDomain);
});
