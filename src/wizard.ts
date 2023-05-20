import dotenv from "dotenv";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import AnonymizeUAPlugin from "puppeteer-extra-plugin-anonymize-ua";
import {
    getChessGamePGN,
    getIsMyTurn,
    getMySide,
    getMyTime,
    getOpponentTime,
    getOtherSide,
    movePiece,
} from "./wizard-utils";
import Client from "./client";
import {
    SYNC_ONLINE_BOARD_STATE,
    SYNC_PHYSICAL_MOVE_TO_ONLINE,
} from "./events";
import { WizardGameState } from "./models";
import { Move } from "chess.js";
import { Page } from "puppeteer";
puppeteer
    .use(StealthPlugin())
    .use(
        AdblockerPlugin({
            blockTrackers: true,
            blockTrackersAndAnnoyances: true,
        })
    )
    .use(AnonymizeUAPlugin());
dotenv.config();

const client = new Client("wizard");

let page: Page;

client.on(SYNC_PHYSICAL_MOVE_TO_ONLINE, async (moveStr: string) => {
    try {
        const move = JSON.parse(moveStr) as Move;
        await movePiece(page, move);
        console.log(`Moved piece from ${move.from} to ${move.to}`);
    } catch (err) {
        console.log('Error moving piece:', err);
    }
});

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        devtools: false,
        defaultViewport: null,
        // executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-notifications",
            "--window-size=1280,1024",
            "--ignore-certifcate-errors",
            "--ignore-certifcate-errors-spki-list",
        ],
        // Disables "Chome is being controlled by automation software" banner
        // ignoreDefaultArgs: ["--enable-automation"],
        ignoreHTTPSErrors: true,
    });
    page = await browser.newPage();

    await page.goto("https://www.chess.com/login");

    // // Set screen size
    await page.setViewport({ width: 1280, height: 1024 });

    // // Type into search box
    await page.type("#username", process.env.CHESS_USERNAME ?? "");
    await page.type("#password", process.env.CHESS_PASSWORD ?? "");

    // // Wait and click on first result
    // const searchResultSelector = '.search-box__link';
    // await page.waitForSelector(searchResultSelector);
    await page.click("button#login");

    // // Locate the full title with a unique string
    const usernameSelector = await page.waitForSelector("a.home-username-link");
    const username = await usernameSelector?.evaluate((el) => el.textContent);

    if (username !== process.env.CHESS_USERNAME) {
        console.log(
            `Found username (${username}) does not match expected username ${process.env.CHESS_USERNAME}`
        );
        await browser.close();
    }

    await page.goto("https://www.chess.com/play/online");

    setInterval(async () => {
        try {
            const chess = await getChessGamePGN(page);
            const mySide = await getMySide(page);
            await getChessGamePGN(page);
            client.send(
                SYNC_ONLINE_BOARD_STATE,
                JSON.stringify(<WizardGameState>{
                    pgn: chess.pgn(),
                    mySide: mySide,
                    time: {
                        mine: await getMyTime(page),
                        opponent: await getOpponentTime(page),
                    },
                })
            );
        } catch (err) {
            console.log(`Error when refreshing chess game:`, err);
        }
    }, 250);
})();
