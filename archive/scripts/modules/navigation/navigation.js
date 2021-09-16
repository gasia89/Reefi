import { WifiSetupPage } from "../wifi/wifiSetupPage.js";

export class Navigation {
    constructor(configManager, header, footer, debugOptions = null) {
        this.element = document.getElementById("nav");
        this.sidenav = document.getElementById("sideNavContainer");
        this.mainPageElement = document.getElementById("#main");
        this.openNavBtn = document.getElementById("openNavBtn");
        this.closeNavBtn = document.getElementById("closeNavBtn");
        this.configManager = configManager;

        this.header = header;
        this.footer = footer;

        if (debugOptions !== null && debugOptions.debugEnabled) {
            console.log("Navigation initializing...");
        }

        this.wifiSetupPage = new WifiSetupPage(this.configManager, this.header.statusHelper, debugOptions);
        this.wifiSetupPage.initialize();

        // event handlers
        this.closeNav();
        let that = this;
        this.openNavBtn.addEventListener("click", that.openNav);
        this.closeNavBtn.addEventListener("click", that.closeNav);
    }

    openNav = () => {
        console.log("opening Nav...");
        if (window.innerWidth <= 1230) {
            this.element.style.width = "100%";
            this.sidenav.style.width = "100%";
            this.closeNavBtn.style.right = "15px";
        } else {
            this.element.style.width = "17.5%";
            this.sidenav.style.width = "15%";
            this.element.style.minWidth = "300px";
            this.sidenav.style.minWidth = "250px";
        }

        this.closeNavBtn.style.display = "block";
        this.openNavBtn.style.display = "none";
    }

    closeNav = () => {
        console.log("closing nav...");
        this.element.style.width = 0;
        this.closeNavBtn.style.display = "none";
        this.openNavBtn.style.display = "block";
    }
}