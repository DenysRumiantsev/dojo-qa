import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker'


type TestUser = {
  userName: string;
  email: string;
  password: string;
};

function createNewUserData(): TestUser {
  return {
    userName: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
};

async function registerUser(page: Page, user: TestUser) {
  await page.getByTestId('nav-sign-up').click();
  await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();

  await page.getByTestId('auth-username').fill(user.userName);
  await page.getByTestId('auth-email').fill(user.email);
  await page.getByTestId('auth-password').fill(user.password);
  await page.getByTestId('register-confirm-password').fill(user.password)

  await page.getByTestId('register-terms').check();
  await page.getByTestId('auth-submit').click();

  await expect(page.getByTestId('nav-profile')).toContainText(user.userName);
  await page.getByTestId('nav-profile').click();
  await page.getByRole('link', { name: 'Edit profile' }).click();
  await page.getByTestId('logout-button').click();
  await expect(page.getByTestId('nav-sign-in')).toBeVisible();
}

test.describe('registration', () => {
  let user: TestUser;

  test.beforeEach(async ({ page }) => {
    await page.goto(''); //baseUrl
    user = createNewUserData();
  });

  test('HW5-1-Register New user is successful', async ({ page }) => {
    await page.getByTestId('nav-sign-up').click();
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();

    await page.getByTestId('auth-username').fill(user.userName);
    await page.getByTestId('auth-email').fill(user.email);
    await page.getByTestId('auth-password').fill(user.password);
    await page.getByTestId('register-confirm-password').fill(user.password)

    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toContainText(user.userName);
  });

  test('HW5-2-Registration without data throw 3 errors', async ({ page }) => {
    await page.getByTestId('nav-sign-up').click();
    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toContainText('username ім\'я має містити щонайменше 3 символи');
    await expect(page.getByTestId('error-messages')).toContainText('email некоректний email');
    await expect(page.getByTestId('error-messages')).toContainText('password пароль має містити щонайменше 6 символів');
  });

  test('HW5-3-Registration non-unique user is rejected', async ({ page }) => {
    await page.getByTestId('nav-sign-up').click();
    await page.getByTestId('auth-username').fill('Olena');
    await page.getByTestId('auth-email').fill("olena@example.com");
    await page.getByTestId('auth-password').fill('qwerty');
    await page.getByTestId('register-confirm-password').fill('qwerty');

    await page.getByTestId('register-terms').check();
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages')).toContainText('body email або username вже зайняті');
  });

});

test.describe('login', () => {
  let user: TestUser;

  test.beforeEach(async ({ page }) => {
    await page.goto(''); //baseUrl
    user = createNewUserData();
    await registerUser(page, user)
  });


  test('HW5-4-registeded user can successfuly login', async ({ page }) => {
    await page.getByTestId('nav-sign-in').click();

    await page.getByTestId('auth-email').fill(user.email);
    await page.getByTestId('auth-password').fill(user.password);

    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('nav-profile')).toContainText(user.userName);

  });


  test('HW5-5-Incorrect password prevent user from login', async ({ page }) => {
    await page.getByTestId('nav-sign-in').click();
    await page.getByTestId('auth-email').fill(user.email);
    await page.getByTestId('auth-password').fill('12312312');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('email or password неправильні');
  });

  test('HW5-6-Incorrect or unregistered user cannot login', async ({ page }) => {
    await page.getByTestId('nav-sign-in').click();
    await page.getByTestId('auth-email').fill("user.nonexist@email.com");
    await page.getByTestId('auth-password').fill('12312312');
    await page.getByTestId('auth-submit').click();

    await expect(page.getByTestId('error-messages').getByRole('paragraph')).toContainText('email or password неправильні');
  });

});