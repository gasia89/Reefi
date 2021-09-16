import { ReeFiFormBase } from "../common/reeFiFormBase.js";

export class SSIDLookupForm extends ReeFiFormBase {
    constructor(formElement, webService, statusHelper, debugEnabled) {
        super(formElement, webService, statusHelper, debugEnabled);
        this.reScanBtn = document.getElementById("reScanBtn");
        this.scanResults = [];
    }

    initialize() {
        this.reScanBtn.addEventListener("click", this.scanForSSIDs);
    }

    scanForSSIDs() {

    }




    submit() {
        this.statusHelper.updateStatus("Status: Retrieving nearby SSID's...");

        return new Promise((resolveListLookup, rejectListLookup) => {
            this.webService.configService.loadWifiListFromDevice().then(ssidLookupResult => {
                var rawArray = ssidLookupResult.split(/,/);
                var ssidArray = [];
                this.emptyCtn(this.wifiList);

                if (rawArray.length >= 4) {


                    for (var i = 0; i < rawArray.length; i += 4) {
                        var lineArray = [rawArray[i], rawArray[i + 1], rawArray[i + 2], rawArray[i + 3]];
                        ssidArray.push(lineArray);
                        this.appendNode(this.wifiList, rawArray[i], rawArray[i + 1], rawArray[i + 2], rawArray[i + 3]);
                    }

                    this.statusHelper.updateStatus("Status: Retrieving SSID list successful.");
                    resolveListLookup(ssidArray);
                } else {
                    this.statusHelper.updateStatus("Status: No SSID found.  Please try again.");
                    rejectListLookup();
                }
            });
        });
    }
}