import { Chess, Move, Piece, Square } from "chess.js";
import { BoundingBox, ElementHandle, Page } from "puppeteer";
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

export const movePiece = async (page: Page, move: Move) => {
    const board = (await page.$$(
        "chess-board, div#board, #board-board, #board-single"
    ))[0] as ElementHandle<Element>;

    const classNameProp = await board.getProperty("className");
    const className = await classNameProp.jsonValue();
    const classes: string[] = className.split(" ");
    const flipped = classes.includes("flipped");

    const boardBoundingBox = await board.boundingBox();

    if (!boardBoundingBox) {
        throw Error("Unable to get board bounding box");
    }

    const boardMap = convertBoundingBoxToBoard(boardBoundingBox, flipped);

    const sourcePosition = boardMap[move.from];
    const destPosition = boardMap[move.to];

    await page.mouse.move(sourcePosition.x, sourcePosition.y);
    await page.mouse.down();
    await page.mouse.move(destPosition.x, destPosition.y);
    await page.mouse.up();
};

const convertBoundingBoxToBoard = (
    bb: BoundingBox,
    flipped: boolean
): { [key: string]: { x: number; y: number } } => {
    const board: { [key: string]: { x: number; y: number } } = {};
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const squareSize = bb.width / 8;

    const startX = bb.x + (flipped ? squareSize * 7 : 0);
    const startY = bb.y + (flipped ? squareSize * 7 : 0);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const position = flipped
                ? `${letters[7 - col]}${row + 1}`
                : `${letters[col]}${8 - row}`;
            const x = startX + col * squareSize + squareSize / 2;
            const y = startY + row * squareSize + squareSize / 2;
            board[position] = { x, y };
        }
    }

    return board;
};
