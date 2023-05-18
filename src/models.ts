export type Side = "b" | "w";

export interface GameState {
    fen: string;
    isRecording: boolean;
    isLastMoveInvalid: boolean;
    mySide: Side;
    time: Time;
}

export interface Time {
    mine: string;
    opponent: string;
}

export interface WizardGameState {
    fen: string;
    time: Time;
    mySide: Side;
}