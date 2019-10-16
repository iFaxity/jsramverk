const assert = require('assert').strict;
const test = require('selenium-webdriver/testing');
const { Builder, By, until } = require('selenium-webdriver');
const Chrome = require('selenium-webdriver/chrome');

const URL = 'http://localhost:1234';
let browser;

// Helper functions

// Clicks link has content
async function clickLink(target) {
  const $el = await browser.wait(until.elementLocated(By.linkText(target)), 5000);
  return $el.click();
}

// Asserts if url matches target
async function assertUrl(target) {
  const url = await browser.getCurrentUrl();
  assert.equal(url, `${URL}${target}`);
}

// Asserts if h1 has content
async function assertH1(target) {
  const $el = await browser.wait(until.elementLocated(By.css('h1')), 5000);
  const text = await $el.getText();
  assert.equal(text, target);
}

// Asserts if title matches target
async function assertTitle(target) {
  const title = await browser.getTitle();
  assert.equal(title, `chnc16 | ${target}`);
}

const wait = (ms = 0) => new Promise(resolve => setTimeout(() => resolve(), ms));

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

  // Test cases
  test.it('Test go to register page', async function () {
    this.timeout(10000);
    await clickLink('Registrera');
    await wait(500);
    await assertH1('Registrera konto');
    await assertTitle('Registrera');
    await assertUrl('/register');
  });

  test.it('Test go to login page', async function () {
    this.timeout(10000);
    await clickLink('Login');
    await wait(500);
    await assertH1('Login');
    await assertTitle('Login');
    await assertUrl('/login');
  });

  test.it('Test go to first report', async function () {
    this.timeout(10000);
    await clickLink('Rapporter');
    await assertH1('Rapporter');
    await assertTitle('Rapporter');
    await assertUrl('/reports');

    // Click report for week 1
    await clickLink('Rapport vecka 1');
    await wait(500);
    await assertH1('Rapport vecka 1');
    await assertTitle('Rapport vecka 1');
    await assertUrl('/reports/week/1');
  });
});
