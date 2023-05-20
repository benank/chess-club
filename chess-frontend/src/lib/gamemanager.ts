import Client from './client';
import { LIST_MOVES, PHYSICAL_MOVE_MADE, SERVER_SYNC_ALL } from './events';
import type { GameState } from './models';
import { attemptedPhysicalMove, gameStateStore, possibleMovesStore } from './store';

class GameManager {
	private _client: Client;

	constructor() {
		this._client = new Client('frontend');

		this._client.on(SERVER_SYNC_ALL, this.onServerSyncAll.bind(this));
		this._client.on(PHYSICAL_MOVE_MADE, this.onPhysicalMoveMade.bind(this));
		this._client.on(LIST_MOVES, this.onListMoves.bind(this));
	}

	private onServerSyncAll(gameStateStr: string) {
		const gameState = JSON.parse(gameStateStr) as GameState;
		gameStateStore.set(gameState);
	}
	
	// Output from voice command - not confirmed yet
	private onPhysicalMoveMade(move: string) {
		attemptedPhysicalMove.set(move);
		
		setTimeout(() => {
			attemptedPhysicalMove.set('');
		}, 5000);
	}
	
	private onListMoves(moves: string[]) {
		possibleMovesStore.set(moves);
		
		setTimeout(() => {
			possibleMovesStore.set([]);
		}, 5000);
	}
}

const gm = new GameManager();
export default gm;