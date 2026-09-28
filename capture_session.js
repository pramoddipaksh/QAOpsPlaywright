const { chromium } = require('playwright');

(async () => {
    console.log("🚀 Launching explicit session capturer...");
    console.log("🔒 Setting up isolated folder at: C:\\Users\\Namita\\playwright-project\\linkedin_profile");

    const context = await chromium.launchPersistentContext('C:\\Users\\Namita\\playwright-project\\linkedin_profile', {
        headless: false,
        viewport: { width: 1280, height: 720 },
        args: ['--disable-blink-features=AutomationControlled']
    });

    const page = await context.newPage();
    
    // Go to LinkedIn home page
    await page.goto('https://linkedin.com');

    console.log("\n-------------------------------------------------------------");
    console.log("👉 ACTIONS REQUIRED IN THE OPENED BROWSER WINDOW:");
    console.log("1. Type your email and password manually.");
    console.log("2. Solve any security puzzles/CAPTCHAs.");
    console.log("3. Enter your email verification OTP code if prompted.");
    console.log("4. Once you are successfully on your main homepage feed, come back here.");
    console.log("-------------------------------------------------------------\n");
    
    console.log("🔴 The browser will stay open permanently. Close this VS Code terminal panel manually when you are fully logged in to lock your session!");

    // Keep execution open indefinitely so the browser never closes automatically
    await page.waitForTimeout(9999999); 
})();