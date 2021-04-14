import { HtmlHelper } from "../helpers/htmlHelper.js";
import { PageService } from "../services/pageService.js";
import { WebService } from "../services/webService.js";
import { NavigationService } from "../services/navigationService.js";
import { HeaderService } from "../services/headerService.js";

export class ReeFiApp {
    constructor(model, deviceUrl, spaOverrideUrl, isFirstTimeSetup, debugEnabled) {
        // globals
        this.isFirstTimeSetup = isFirstTimeSetup;

        // helpers
        this.htmlHelper = new HtmlHelper(model, debugEnabled);

        if (debugEnabled) {
            console.log("ReeFi app started in Debug Mode");
        }

        // core services
        this.webService = new WebService(this.htmlHelper, spaOverrideUrl, deviceUrl, debugEnabled);
        this.pageService = new PageService(this.webService, this.htmlHelper, debugEnabled);
        this.navigationService = new NavigationService("sideNavContainer", this.pageService, debugEnabled);
        this.headerService = new HeaderService("appHeader");
    }

    start() {
        if (this.isFirstTimeSetup) {
            console.log("First Time Setup Start");
            this.pageService.loadPage("wifiSetupSection");
        }
    }
}