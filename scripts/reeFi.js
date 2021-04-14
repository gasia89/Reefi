import { DuoExtreme } from "./devices/duoExtreme.js";
import { Duo } from "./devices/duo.js";
import { Uno } from "./devices/uno.js";
import { DateHelper } from "./helpers/dateHelper.js";
import { HtmlHelper } from "./helpers/htmlHelper.js";
import { MobileHelper } from "./helpers/mobileHelper.js";
import { GraphHelper } from "./helpers/graphHelper.js";
import { ScriptHelper } from "./helpers/scriptHelper.js";
import { SliderFormHelper } from "./helpers/sliderFormHelper.js";

export class ReeFi {
    constructor(debugEnabled) {
        // Debug arguments
        this.debugArgs = {
            deviceUrl: "http://someAddressHere.com/",
            model: "Uno",
            debugEnabled: true,
        };

        // fields
        this.model = "";
        this.deviceUrl = "";
        this.debugEnabled = false;

        // Helpers
        this.dateHelper = new DateHelper();
        this.mobileHelper = new MobileHelper(debugEnabled);
        this.htmlHelper = new HtmlHelper();
        this.scriptHelper = new ScriptHelper(debugEnabled);

        // Initialize
        this.initializeDependencies();
        this.Setup();
        this.ActiveDevice = this.LoadDevice(this.model);
    }

    initializeDependencies() {
        this.initializeHelperDependencies();
        this.initializeServices();
    }

    // setup Helper services.
    initializeHelperDependencies() {
        this.dateHelper = new DateHelper();
        this.mobileHelper = new MobileHelper(debugEnabled);
        this.htmlHelper = new HtmlHelper();
        this.scriptHelper = new ScriptHelper(debugEnabled);
    }

    // Setup all required services
    initializeServices() {
        this.chartService = new ChartService(this.debugEnabled);
        this.formService = new FormService(this.model, this.debugEnabled);
    }

    Setup(setupArgs) {
        if (setupArgs === undefined) {          
            this.modelType = this.debugArgs.modelType;
            this.deviceUrl = this.debugArgs.deviceUrl;
            this.debugEnabled = this.debugArgs.debugEnabled;
            this.graphHelper = new GraphHelper(this.modelType, this.debugEnabled);
            console.log("setupArgs cannot be undefined, using default hard-coded debug settings for now.");
            console.log("debugEnabled: " + this.debugArgs.debugEnabled);
            console.log("modelType: " + this.debugArgs.modelType);
            console.log("deviceUrl: " + this.debugArgs.deviceUrl);
        }
        else {
            this.modelType = setupArgs.modelType;
            this.deviceUrl = setupArgs.deviceUrl;
            this.graphHelper = new GraphHelper(this.modelType);

            if (setupArg.debugEnabled !== undefined) {
                this.debugEnabled = setupArgs.debugEnabled;
                
            }
        }
    }

    LoadDevice(modelName) {
        if (modelName !== '') {
            if (modelName === "Uno") {
                if (this.debugEnabled) {
                    console.log("Loading deviceType: Uno");
                }

                $("header").innerHTML = $("header").innerHTML + " Uno";

                return new Uno(this.debugEnabled);
            }
            else if (modelName === "DE") {
                if (this.debugEnabled) {
                    console.log("Loading deviceType: Uno");
                }

                $("header").innerHTML = $("header").innerHTML + " Duo Extreme";

                return new DuoExtreme(this.debugEnabled);
            }
            else if (modelName === "Duo") {
                if (this.debugEnabled) {
                    console.log("Loading deviceType: ");
                }

                $("header").innerHTML = $("header").innerHTML + " Duo";

                return new Duo(this.debugEnabled);
            }
        }
    }
}