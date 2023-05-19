import { Chess, Piece, Square } from "chess.js";
import { Page } from "puppeteer";
import { Side } from "./models";

export const numberToLowerCaseLetter = (number: number) =>
    String.fromCharCode("a".charCodeAt(0) + number - 1);

export const getChessGamePGN = async (page: Page): Promise<Chess> => {
    const chess = new Chess();

    const moves = await page.$$(
        "vertical-move-list.move-list-wrapper-component > div.move"
    );

    const sideSelectors = ["white", "black"];

    for (const move of moves) {
        for (const sideSelector of sideSelectors) {
            const moveHandles = await move.$$(`div.${sideSelector}.node`);
            if (moveHandles.length !== 1) {
                return chess;
            }

            const moveHandle = moveHandles[0];
            const movePosition = await page.evaluate(
                (element) => element.innerText,
                moveHandle
            );
            const pieceSpan = await moveHandle.$$("span");
            let piece = "";

            if (pieceSpan.length === 1) {
                piece =
                    (await page.evaluate(
                        (element) => element.getAttribute("data-figurine"),
                        pieceSpan[0]
                    )) || "";
            }

            const moveStr = `${piece}${movePosition}`;
            chess.move(moveStr);
            console.log(`${sideSelector} move: ${moveStr}`);
        }
    }

    return chess;
};

export const getChessGameFEN = async (page: Page): Promise<Chess> => {
    await page.waitForSelector(
        "chess-board > div.piece, div#board > div.piece, #board-board > div.piece"
    );
    const pieces = await page.$$(
        "chess-board > div.piece, div#board > div.piece, #board-board > div.piece"
    );

    const chess = new Chess();
    chess.clear();

    for (const piece of pieces) {
        const classNameProp = await piece.getProperty("className");
        const className = await classNameProp.jsonValue();
        const [_, type, square] = className.split(" ");
        const [x, y] = square
            .replace("square-", "")
            .split("")
            .map((s) => parseInt(s));
        const [color, symbol] = type.split("");
        const position = `${numberToLowerCaseLetter(x)}${y}`;
        chess.put(
            {
                type: symbol,
                color,
            } as Piece,
            position as Square
        );
    }

    return chess;
};

export const getOpponentTime = async (page: Page): Promise<string> => {
    const usernameSelector = await page.waitForSelector(
        "div.clock-component.clock-top > span.clock-time-monospace"
    );
    return (await usernameSelector?.evaluate((el) => el.textContent)) ?? "";
};

export const getMyTime = async (page: Page): Promise<string> => {
    const usernameSelector = await page.waitForSelector(
        "div.clock-component.clock-bottom > span.clock-time-monospace"
    );
    return (await usernameSelector?.evaluate((el) => el.textContent)) ?? "";
};

export const getMySide = async (page: Page): Promise<Side> => {
    const sideElements = await page.$$("div.clock-component.clock-bottom");
    let side: Side = "w";

    for (const element of sideElements) {
        const classNameProp = await element.getProperty("className");
        const className = await classNameProp.jsonValue();
        const classNames = className.split(" ");
        side = classNames.includes("clock-white") ? "w" : "b";
    }

    return side;
};

export const getOtherSide = (side: Side): Side => {
    return side == "w" ? "b" : "w";
};

export const getIsMyTurn = async (page: Page): Promise<boolean> => {
    const sideElements = await page.$$("div.clock-component.clock-bottom");
    let isMyTurn = false;

    for (const element of sideElements) {
        const classNameProp = await element.getProperty("className");
        const className = await classNameProp.jsonValue();
        const classNames = className.split(" ");
        isMyTurn = classNames.includes("clock-player-turn");
    }

    return isMyTurn;
};
