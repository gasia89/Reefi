// This is the start point of the JS.

import { ConfigService } from "../services/configService.js";
import { ProfileService } from "../services/profileService.js";
import { WebserverService } from "../services/webserverService.js";
import { FanService } from "../services/fanService.js";
import { HtmlHelper } from "../helpers/htmlHelper.js";
import { ReeFiLight } from "./reeFiLight.js";

export class Uno extends ReeFiLight {
    constructor(model, debugEnabled) {
        super(model, debugEnabled) {
            if (debugEnabled === undefined) {
                this.debugEnabled = false;
            }
            else {
                this.debugEnabled = true;
                console.log("Debugging is enabled. I am about to get really chatty.");
            }

            this.HtmlHelper = new HtmlHelper(this.debugEnabled);

            // HTML Elements
            this.currentStatusElement = document.getElementById("status");

            // fields
            this.updateStatusDisplay();


            this.configService = new ConfigService(this.debugEnabled);
            this.profileService = new ProfileService(this.debugEnabled);
            this.fanService = new FanService(this.debugEnabled);
            this.webserverService = new WebserverService(this.debugEnabled);
        }
    }

    updateStatusDisplay(newStatus) {
        if (newStatus === undefined || newStatus === '') {
            console.log("Attempted to set the currentStatus to an invalid state. Ignoring your ill thought out command.");
        }
        else {
            this.currentStatusElement.innerHTML = newStatus;
            this.HtmlHelper.toggleElementVisibility(this.currentStatusElement, true);
        }
        
    }
}
