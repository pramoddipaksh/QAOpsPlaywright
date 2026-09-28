const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const exec = require('child_process').exec;

chromium.use(stealth);

const CHECK_INTERVAL_MS = 180000; // 3 minutes
const ISOLATED_PROFILE_PATH = `C:\\Users\\Namita\\playwright-project\\linkedin_profile`;
const notifiedJobIds = new Set();

function triggerUrgentAlert() {
    exec('powershell -Command "[console]::beep(1800,400); Start-Sleep -m 150; [console]::beep(1800,500)"');
}

async function runNativeUiSearch() {
    console.log(`\n🔍 [${new Date().toLocaleTimeString()}] Opening LinkedIn Homepage...`);
    
    const context = await chromium.launchPersistentContext(ISOLATED_PROFILE_PATH, {
        headless: false, 
        viewport: { width: 1280, height: 720 },
        args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
    });

    const page = await context.newPage();

    try {
        // Step 1: Open base homepage natively
        await page.goto("https://www.linkedin.com", { timeout: 60000, waitUntil: 'load' });
        await page.waitForTimeout(4000);

        // Step 2: Click the "Jobs" Navigation icon on the page header
        console.log("Clicking the native 'Jobs' navigation tab item...");
        const jobsTabButton = page.locator('a[href*="/jobs/"], [data-global-nav-item="jobs"]').first();
        await jobsTabButton.click();
        
        console.log("⏳ Waiting for Jobs tab interface layout to stabilize...");
        await page.waitForTimeout(6000); // Critical delay for dynamic elements to settle down

        // Step 3: Locate Search Box using User-Centric placeholders
        console.log("Attempting to locate keyword input using visible text placeholders...");
        
        let keywordInput = null;

        // Try Strategy A: Match by the visible placeholder text you observed
        const placeholderTarget = page.getByPlaceholder('Describe the job you want', { exact: false });
        // Try Strategy B: Fallback array using native ARIA label mappings
        const fallbackAriaTarget = page.locator('input[aria-label*="Describe the job you want"], input[aria-label*="keyword"]').first();
        
        if (await placeholderTarget.isVisible()) {
            console.log("🎯 Element found via placeholder locator.");
            keywordInput = placeholderTarget;
        } else if (await fallbackAriaTarget.isVisible()) {
            console.log("🎯 Element found via fallback ARIA label locator.");
            keywordInput = fallbackAriaTarget;
        } else {
            // Strategy C: Last resort broad structural selector input search box
            console.log("⚠️ Text match locators not visible. Trying broad input tag search...");
            keywordInput = page.locator('.jobs-search-box__text-input, input[id*="keyword"]').first();
        }

        // Wait up to 10 seconds for the determined input box element to become active
        await keywordInput.waitFor({ state: 'visible', timeout: 10000 });
        
        await keywordInput.click();
        await page.waitForTimeout(500);
        await keywordInput.fill('Senior QA Engineer');
        await page.waitForTimeout(1000);

        // Execute search natively via the keyboard Enter key interface structure
        console.log("🚀 Submitting search keywords query...");
        await keywordInput.press('Enter');
        await page.waitForTimeout(6000); // 6-second delay to let search cards load completely

        // Step 4: Handle workplace configuration filter dropdowns
        console.log("Attempting to toggle 'Remote' options parameter selection...");
        const workplaceDropdown = page.locator('button[aria-label*="On-site/remote"], button[aria-label*="Workplace"]').first();
        await workplaceDropdown.click();
        await page.waitForTimeout(2000);

        // Choose the Remote option box item elements natively
        const remoteCheckbox = page.locator('label[for*="WORKPLACE_TYPE-2"], text=Remote').first();
        await remoteCheckbox.click();
        await page.waitForTimeout(1500);

        // Click the Result Validation Show/Apply Confirmation buttons
        const showResultsButton = page.locator('button[aria-label*="results"], button[data-control-name="filter_show_results"]').first();
        await showResultsButton.click();
        console.log("✅ Custom Workspace Filters Applied successfully.");
        await page.waitForTimeout(5000);

        // Step 5: Read resulting active jobs listings cards
        const jobCards = page.locator('.jobs-search-results-list li, [data-occludable-job-id], .job-card-container');
        const count = await jobCards.count();

        if (count === 0) {
            console.log("⚠️ Search completed, but no visible job listings cards were parsed on this layout iteration.");
            await context.close();
            return;
        }

        console.log(`🚀 Success! Processing top ${Math.min(count, 5)} active listings inside the pane view grid...`);
        let newJobsFound = false;

        for (let i = 0; i < Math.min(count, 5); i++) {
            try {
                const card = jobCards.nth(i);
                let jobId = await card.getAttribute('data-job-id');
                if (!jobId) {
                    const attributeId = await card.getAttribute('data-occludable-job-id');
                    jobId = attributeId ? attributeId.split(':').pop() : null;
                }

                if (jobId && !notifiedJobIds.has(jobId)) {
                    notifiedJobIds.add(jobId);
                    newJobsFound = true;

                    const titleText = await card.locator('.job-card-list__title, .base-search-card__title, a.job-card-container__link').first().innerText();
                    const companyText = await card.locator('.job-card-container__company-name, .base-search-card__subtitle').first().innerText();
                    const directJobUrl = `https://linkedin.com{jobId}/`;

                    console.log(`\n🚨 [ALERT: NEW REMOTE QA ROLE]`);
                    console.log(`📌 Title: ${titleText.trim()}`);
                    console.log(`🏢 Company: ${companyText.trim().replace(/\n/g, ' ')}`);
                    console.log(`🔗 Link: ${directJobUrl}`);
                }
            } catch (innerErr) {
                // Ignore parsing anomalies on standard card loops
            }
        }

        if (newJobsFound) {
            triggerUrgentAlert();
        } else {
            console.log("✅ Checked. No fresh un-flagged postings detected in this pass.");
        }

    } catch (error) {
        console.error(`⚠️ Interface Control Error: ${error.message}`);
    } finally {
        await context.close();
        console.log(`⏳ Standby mode active. Re-running the UI workflow loop in 3 minutes...\n`);
    }
}

async function main() {
    await runNativeUiSearch();
    setInterval(runNativeUiSearch, CHECK_INTERVAL_MS);
}

main();