export class ScriptHelper {
    constructor(debugEnabled) {

        if (debugEnabled) {
            this.loadDebugScripts();
        }
        else {
            this.loadScripts();
        }
    }

    loadScripts() {

    }

    loadDebugScripts() {
        var scriptPaths = [""];
    }

    gled_init() {
        $("statusSetup").innerHTML = "Status: Retrieving stored LEDs...";
        fetch('http://' + curURL + '/gleds.txt', 'GET', new_GLEDs);
    }
}