import { browser, by, element } from 'protractor';

export class AppPage {

  navbar = element(by.tagName('app-navbar'));
  loginButton = this.navbar.element(by.buttonText('Login'));
  addItemButton = this.navbar.element(by.css('.add-item-button'));
  userMenuToggle = this.navbar.element(by.css('.user.dropdown-toggle'));
  userMenuDropdown = this.navbar.element(by.css('.dropdown-menu'));
  logoutButton = this.userMenuDropdown.element(by.linkText('Logout'));

  modalContainer = element(by.tagName('modal-container'));
  loginModal = element(by.tagName('app-login-modal'));
  loginModalTitle = this.loginModal.element(by.tagName('h5'));
  loginEmailField = this.loginModal.element(by.css('input[type=email]'));
  loginPasswordField = this.loginModal.element(by.css('input[type=password]'));
  loginErrorAlert = this.loginModal.element(by.css('.alert-danger'));
  loginSubmit = this.loginModal.element(by.css('button[type=submit]'));

  navigateTo() {
    return browser.get('/');
  }

}
