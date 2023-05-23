import GKM from "gkm-class";

export enum Hotkey {
    START_RECORDING = "F21",
    CONFIRM_OPPONENT = "F16",
    LIST_MOVES = "F17",
    NEW_GAME = "F18",
}

const handlers: {
    [key in Hotkey]: Function[];
} = {
    [Hotkey.START_RECORDING]: [],
    [Hotkey.CONFIRM_OPPONENT]: [],
    [Hotkey.LIST_MOVES]: [],
    [Hotkey.NEW_GAME]: [],
};

export const addKeyHandler = (key: Hotkey, cb: Function) => {
    handlers[key].push(cb);
};

const gkm = new GKM();

// Listen to all key events (pressed, released, typed)
gkm.on("key.*", function (data) {
    if (this.event !== 'key.released') {
        return;
    }
    
    // console.log(this.event + " " + data);
    const hotkey = data as Hotkey;
    if (!handlers[hotkey]) {
        return;
    }

    handlers[hotkey].forEach((cb) => cb());
});

process.on("beforeExit", (code) => {
    // Code to run before the application exits
    console.log("Exiting GKM");
    gkm.quit();
});
