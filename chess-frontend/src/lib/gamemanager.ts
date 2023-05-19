import Client from './client';
import { SERVER_SYNC_ALL } from './events';
import type { GameState } from './models';
import { gameStateStore } from './store';

class GameManager {
	private _client: Client;

	constructor() {
		this._client = new Client('frontend');

		this._client.on(SERVER_SYNC_ALL, this.onServerSyncAll.bind(this));
	}

	private onServerSyncAll(gameStateStr: string) {
		const gameState = JSON.parse(gameStateStr) as GameState;
		gameStateStore.set(gameState);
	}
}

const gm = new GameManager();
export default gm;