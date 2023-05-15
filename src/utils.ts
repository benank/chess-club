import { Page } from "puppeteer";

export const getOpponentTime = async (page: Page): Promise<string> => {
    const usernameSelector = await page.waitForSelector("div.clock-component.clock-top > span.clock-time-monospace");
    return await usernameSelector?.evaluate((el) => el.textContent) ?? '';
}

export const getMyTime = async (page: Page): Promise<string> => {
    const usernameSelector = await page.waitForSelector("div.clock-component.clock-bottom > span.clock-time-monospace");
    return await usernameSelector?.evaluate((el) => el.textContent) ?? '';
}