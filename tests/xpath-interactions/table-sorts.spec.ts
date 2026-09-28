import { test, expect, Page } from "@playwright/test";
import { count } from "node:console";

const dojoInteractionsUrl = 'http://104.168.59.50/laboratory/interactions';

//locators for the task
const sortHeaderLocator = "//h2[text() = 'Sortable table']";
const checkedCounter = "//span[@data-testid='interactions-selected-count']"

const sortNameLocator = "//button[@data-testid='interactions-sort-name']"
const sortStatusLocator = "//button[@data-testid='interactions-sort-status']"
const sortDurationLocator = "//button[@data-testid='interactions-sort-duration']"
const tableRawLocator = '//tbody/tr'

test.describe("xPath-table-sort-tests", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(dojoInteractionsUrl);

    });

    test('Sort table by name dsc', async ({ page }) => {
        await expect(page.locator(tableRawLocator).first()).toContainText('Авторизація');
        await expect(page.locator(tableRawLocator).last()).toContainText('Failed');

        await page.locator(sortNameLocator).click();

        await expect(page.locator('//th[@aria-sort="descending"]')).toBeVisible();
        await expect(page.locator(tableRawLocator).first()).toContainText('Створення статті');
        await expect(page.locator(tableRawLocator).last()).toContainText('Авторизація');
    });

    test('Sort table by name asc', async ({ page }) => {

        await expect(page.locator(tableRawLocator).first()).toContainText('Авторизація');
        await expect(page.locator(tableRawLocator).last()).toContainText('Failed');
        await page.locator(sortNameLocator).click({clickCount: 2});

        await expect(page.locator('//th[@aria-sort="ascending"]')).toBeVisible();
        await expect(page.locator(tableRawLocator).last()).toContainText('Створення статті');
    });

    test('checking row operation increase counter', async ({ page }) => {
        await expect(page.locator(checkedCounter)).toHaveText("Вибрано: 0");
        await page.locator("//input[@aria-label='Вибрати Створення статті']").click();
        
        await expect(page.locator(checkedCounter)).toHaveText("Вибрано: 1");

        await page.locator("//input[@aria-label='Вибрати Завантаження файлу']").click(); 
        await expect(page.locator(checkedCounter)).toHaveText("Вибрано: 2");
    });
    

});