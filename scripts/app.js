import { StatusHelper } from "./helpers/statusHelper.js";
import { WebServer } from "./infrastructure/webServer.js";
import { PageService } from "./services/pageService.js";


export class App {
    constructor(localHostAddressOverride, apiTargetOverride, debugEnabled) {
        this.debugEnabled = debugEnabled;
        this.statusHelper = new StatusHelper("status");
        this.firstTimeSetupIsComplete = false;

        if (debugEnabled) {
            this.currentUrl = localHostAddressOverride;
            this.apiTargetOverride = apiTargetOverride;
            this.localHostAddressOverride = localHostAddressOverride;
            this.webServer = new WebServer(this.statusHelper, this.localHostAddressOverride, this.apiTargetOverride, this.debugEnabled);
        }
        else {
            this.urlList = window.location.href.match(/[0-9.]+/);
            this.currentUrl = urlList[0];
            this.webServer = new WebServer(this.statusHelper, this.currentUrl, this.currentUrl, false);
        }

        this.pageService = new PageService(this.webServer, this.statusHelper, debugEnabled);
    }

    start() {
        if (this.debugEnabled) {
            console.log("Debugging Enabled!");
        }

        if (this.firstTimeSetupIsComplete === false) {
            if (this.debugEnabled) {
                console.log("This is a first time setup!");
            }

            this.pageService.loadingPage.hide();
            this.pageService.wifiPage.show();
            this.pageService.wifiPage.initialize();
        }
        else {
            this.pageService.loadingPage.show();
        }
    }

    markSetupAsComplete() {
        this.firstTimeSetupIsComplete = true;
    }
}