
export class WifiSetupPage {
    constructor(configManager, statusHelper, debugOptions = null) {
        this.element = document.getElementById("wifiSetupPage");
        this.configManager = configManager;

        if (debugOptions !== null) {
            this.debugEnabled = debugOptions.debugEnabled;
        } else {
            this.debugEnabled = false;
        }

        // helpers
        this.statusHelper = statusHelper;

        // user controls
        this.forceAPModeBtn = document.getElementById("forceAPModeBtn");
        this.saveSSIDBtn = document.getElementById("saveSSIDBtn");
        this.rescanSSIDBtn = document.getElementById("scanSSIDBtn");
        this.advancedSetupOptionsCheckbox = document.getElementById("advancedSetupOptionsCheckbox");
        this.advancedSetupOptionsContainer = document.getElementById("advancedSetupOptions");
    }

    initialize() {
        if (this.debugEnabled) {
            console.log("Initializing the Wifi Setup page.");
        }
        
        this.loadSSIDList();

        // bind event listeners
        this.saveSSIDBtn.addEventListener("click", this.loadSSIDList);
        //this.showPasswordIcon.addEventListener("mouseover", function () { this.passwordInputNode.type = "text" });
        //this.showPasswordIcon.addEventListener("mouseout", function () { this.passwordInputNode.type = "password" });
        console.log(this.advancedSetupOptionsCheckbox);
        this.advancedSetupOptionsCheckbox.addEventListener("click", (e) => {
            console.log("clicked");
            if (e.currentTarget.checked) {
                this.advancedSetupOptionsContainer.style.display = true;
            }
            else {
                this.advancedSetupOptionsContainer.style.display = false;
            }
        });
    }

    loadSSIDList = () => {
        this.configManager.loadFromFile('wifi_list.txt').then((result) => {
            console.log(`WiFi SSID List: \r\n${JSON.stringify(result)}`);
            return (result);
        })
    }

    forceAPMode() {
        this.statusHelper.updateStatus("Status: Switching to Forced AP Mode.");
        this.webServer.getResponse('ForcedAP', null);
    }

    getWifiStatus() {
        this.statusHelper.updateStatus("Status: Fetching WiFi Status...");
        this.webServer.getResponse('wifistatus', this.getStatus);
    }

    getStatus(strmsg) {
        var list = strmsg.split(" ");
        var that = this;
        if (list[0] == "Attempting") {
            var wifiStatusPromise = new Promise((response, reject) => {
                that.getWifiStatus(strmsg)
            });

            setTimeout(this.getWifiStatus, 3000);
        }

        this.statusHelper("Status: " + strmsg);
    }

    getAdvancedSetupOptionsIsChecked = () => {
        return this.advancedSetupOptionsCheckbox.checked === true;
    }

    get_wifi_status() {
        setTimeout(getting_wifi_status, 2000);
        this.statusHelper.updateStatus("Status: Attempting to connect...");
    }

    emptyCtn(ctn) {
        while (ctn.hasChildNodes()) {
            ctn.removeChild(ctn.lastChild);
        }
    }

    appendNode(ctn, name, str, enc, ch) {
        var ctnr = document.createElement("div");
        var node = document.createElement("a");
        var snode = document.createElement("span");
        snode.style.width = "120px";
        var textnode = document.createTextNode(name);
        var textsnode;
        if (ch > 9) {
            textsnode = document.createTextNode(str + "%   ch:" + ch);
        } else {
            textsnode = document.createTextNode(str + "%   ch:0" + ch);
        }
        node.href = "#p";
        node.onclick = function () { c(this); };
        node.appendChild(textnode);
        ctnr.appendChild(node);

        snode.appendChild(textsnode);
        if (enc.valueOf() == String("*").valueOf()) {
            snode.className = "q l";
        } else {
            snode.className = "q ";
        }
        ctnr.appendChild(snode);
        ctn.appendChild(ctnr);
    }

    show() {
        this.statusHelper.updateStatus("Status: Waiting for SSID Selection");
        var body = document.getElementsByTagName("BODY")[0];
        body.style.backgroundColor = "#fff";
        this.element.style.display = "flex";
    }

    hide() {
        var body = document.getElementsByTagName("BODY")[0];
        body.style.backgroundColor = "LightGray";
    }


}