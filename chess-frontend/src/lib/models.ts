export type Side = 'b' | 'w';

export interface GameState {
	pgn: string;
	isRecording: boolean;
	isLastMoveInvalid: boolean;
	mySide: Side;
	time: Time;
    opponentMoveConfirmed: boolean;
}

export interface Time {
	mine: string;
	opponent: string;
}

export interface WizardGameState {
	pgn: string;
	time: Time;
	mySide: Side;
}
