import { Page } from "../pages/page.js";

export class NavigationService extends Page {
    constructor(pageName, pageService, debugEnabled) {
        super(pageName);
        this.pageService = pageService;

        this.bindHtmlElements();
        this.bindEventListeners();
    }

    openNav() {
        if (window.innerWidth <= 600) {
            this.element.style.width = "100%";
        } else {
            this.element.style.width = "300px";
        }

        this.openNavBtn.style.visibility = "hidden";
        this.closeNavBtn.style.visibility = "visible";
    }

    closeNav() {
        this.element.style.width = "0";
        this.openNavBtn.style.visibility = "visible";
        this.closeNavBtn.style.visibility = "hidden";
    }

    bindHtmlElements() {
        // Navigation button elements
        this.openNavBtn = document.getElementById("openNavBtn");
        this.closeNavBtn = document.getElementById("closeNavBtn");
        this.wifiConfigBtn = document.getElementById("wifiSetupSection");
        this.setDateBtn = document.getElementById("wifiSetupSection");
        this.infoBtn = document.getElementById("wifiSetupSection");
        this.firmwareUpdateBtn = document.getElementById("wifiSetupSection");
        this.loadSettingsBtn = document.getElementById("wifiSetupSection");
        this.demoBtn = document.getElementById("wifiSetupSection");
        this.toggleDisplay = document.getElementById("wifiSetupSection");
        this.systemTools = document.getElementById("wifiSetupSection");
    }

    bindEventListeners() {
        var that = this;

        this.openNavBtn.addEventListener("click", function () { that.openNav() });
        this.closeNavBtn.addEventListener("click", function () { that.closeNav() });

        this.wifiConfigBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.setDateBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.infoBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.firmwareUpdateBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.loadSettingsBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.demoBtn.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.toggleDisplay.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });

        this.systemTools.addEventListener(function () {
            that.navigateToPage("wifiSetupSection")
        });
    }

    navigateToPage(pageName) {
        this.pageService.loadPage(pageName);
    }
}