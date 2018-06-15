import { AppPage } from './app.po';
import { browser, by, element, Key, ExpectedConditions as EC } from 'protractor';

describe('rentit web', () => {
  let page: AppPage;

  beforeAll(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should fail to login with non existing user', async () => {
    await page.loginButton.click();
    expect(page.loginModalTitle.getText()).toBe('Login');

    await page.loginEmailField.clear();
    await page.loginEmailField.sendKeys('nouser@noemail.com');

    await page.loginPasswordField.clear();
    await page.loginPasswordField.sendKeys('zzz');

    await page.loginSubmit.click();
    expect(page.loginErrorAlert.isPresent()).toBe(true);

    await page.modalContainer.click();
  });

  it('should login with existing user', async () => {
    await page.loginButton.click();
    expect(page.loginModalTitle.getText()).toBe('Login');

    await page.loginEmailField.clear();
    await page.loginEmailField.sendKeys('test@yahoo.com');

    await page.loginPasswordField.clear();
    await page.loginPasswordField.sendKeys('parola');

    await page.loginSubmit.click();

    // wait for modal to close
    await browser.wait(EC.not(EC.presenceOf(page.loginModal)));

    expect(page.loginButton.isPresent()).toBe(false);
    expect(page.addItemButton.isPresent()).toBe(true);
    expect(page.userMenuToggle.isPresent()).toBe(true);
    expect(page.userMenuToggle.getText()).toContain('Hi, te');
  });

  it('should logout', async () => {
    await page.userMenuToggle.click();
    await page.logoutButton.click();

    expect(page.loginButton.isPresent()).toBe(true);
    expect(page.addItemButton.isPresent()).toBe(false);
    expect(page.userMenuToggle.isPresent()).toBe(false);
  });
});
