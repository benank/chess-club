import { Chess, Move } from "chess.js";

export const getLastMove = (chess: Chess): Move | null => {
    const history = chess.history({ verbose: true });
    return history.length > 0 ? history[history.length - 1] : null;
};
