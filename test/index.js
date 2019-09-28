const assert = require('assert').strict;
const test = require('selenium-webdriver/testing');
const { Builder, By } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const URL = 'http://localhost:1234';
let browser;

// Helper functions

// Clicks link has content
async function clickLink(target) {
  const $el = await browser.findElement(By.linkText(target));
  return $el.click();
}

// Asserts if url matches target
async function assertUrl(target) {
  const url = await browser.getCurrentUrl();
  assert.equal(url, `${URL}${target}`);
}

// Asserts if h1 has content
async function assertH1(target) {
  const $el = await browser.findElement(By.css('h1'));
  const text = await $el.getText();
  assert.equal(text, target);
}

// Asserts if title matches target
async function assertTitle(target) {
  const title = await browser.getTitle();
  assert.equal(title, `chnc16 | ${target}`);
}

// Test case
test.describe('Page', () => {
  // Hooks
  test.beforeEach(async function () {
    this.timeout(20000);

    const builder = new Builder().forBrowser('chrome');
    builder.setChromeOptions(new Chrome.Options().headless());

    browser = await builder.build();
    await browser.get(URL);
  });
  test.afterEach(() => browser.quit());

  test.it('Test /', async () => {
    await assertTitle('Hem')
    await assertH1('Välkomstmeddelande');
    await assertUrl('/');
  });

  test.it('Test go to /reports', async () => {
    await clickLink('Rapporter');
    await assertTitle('Rapporter');
    await assertH1('Rapporter');
    await assertUrl('/reports');
  });

  test.it('Test go to /register', async () => {
    await clickLink('Registrera');
    await assertTitle('Registrera');
    await assertH1('Registrera konto');
    await assertUrl('/register');
  });
});
