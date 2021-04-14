import { StatusHelper } from "../modules/common/statusHelper.js";
import { SSIDLookupForm } from "../modules/wifi/ssidLookupForm.js";
import { SSIDSubmitForm } from "../modules/wifi/ssidSubmitForm.js";
import { Page } from "./page.js";

export class WifiSetupPage extends Page {
    constructor(elementId, webService, debugEnabled) {
        super(elementId, webService, debugEnabled);
        this.debugEnabled = debugEnabled;

        // helpers
        this.statusHelper = new StatusHelper("wifiStatusElement", "wifiStatusMessage");

        // services
        this.webServer = webServer;

        // user controls
        this.forceAPModeBtn = document.getElementById("forceAPModeBtn");

        // forms
        this.ssidLookupForm = new SSIDLookupForm("ssidLookupForm", this.webService, debugEnabled);
        this.ssidSubmitForm = new SSIDSubmitForm("ssidSubmitForm", this.webService, debugEnabled);
    }

    initialize() {
        this.loadSSIDList();

        // bind event listeners
        this.submitInputNode.addEventListener("click", this.loadSSIDList);
        this.showPasswordIcon.addEventListener("mouseover", function () { this.passwordInputNode.type = "text" });
        this.showPasswordIcon.addEventListener("mouseout", function () { this.passwordInputNode.type = "password" });
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
        super.show();
        
    }
}