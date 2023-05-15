import { Chess, Piece, Square } from "chess.js";
import { Page } from "puppeteer";

export const numberToLowerCaseLetter = (number: number) =>
    String.fromCharCode("a".charCodeAt(0) + number - 1);

export const getChessGame = async (page: Page): Promise<Chess> => {
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
