import { WifiSetupPage } from "../pages/wifiSetupPage.js";
import { PowerManagementPage } from "../pages/powerManagementPage.js";
import { HtmlHelper } from "../helpers/htmlHelper.js";
import { LoadingPage } from "../pages/loadingPage.js";

export class PageService {
    constructor(webServer, htmlHelper, debugEnabled) {
        this.debugEnabled = debugEnabled;
        this.htmlHelper = htmlHelper;
        this.statusHelper = this.htmlHelper.statusHelper;
        this.webServer = webServer;
        this.loadingPage = new LoadingPage("loadingSection");
        this.wifiPage = new WifiSetupPage("wifiSetupSection", this.webServer, this.statusHelper, debugEnabled);
        this.powerManagementPage = new PowerManagementPage("powerManagementSection");

        this.pages = [this.wifiPage, this.powerManagementPage, this.loadingPage];

    }

    loadPage(pageName) {
        switch (pageName) {
            case pageName === "wifiSetupSection":
                console.log(`showing the ${pageName}`);
                this.loadingPage.hide();
                this.wifiPage.show();    
                break;
            case pageName === "loadingSection":
                this.wifiPage.hide();
                this.loadingPage.show();
                break;
            default:
                break;
        }
    }
}