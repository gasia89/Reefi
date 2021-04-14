export class Duo {
    constructor(debugEnabled) {
        if (debugEnabled === undefined) {
            this.debugEnabled = false;
        }
        else {
            this.debugEnabled = debugEnabled;
        }

        this.Setup();
    }

    Setup() {
        console.log("This Device is not yet configured to work.");
    }
}