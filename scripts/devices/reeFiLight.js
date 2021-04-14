import { DuoExtreme } from "./devices/duoExtreme.js";
import { Duo } from "./devices/duo.js";
import { Uno } from "./devices/uno.js";
import { DateHelper } from "./helpers/dateHelper.js";
import { HtmlHelper } from "./helpers/htmlHelper.js";
import { MobileHelper } from "./helpers/mobileHelper.js";
import { GraphHelper } from "./helpers/graphHelper.js";
import { ScriptHelper } from "./helpers/scriptHelper.js";
import { SliderFormHelper } from "./helpers/sliderFormHelper.js";

export class ReeFiLight {
    constructor(model, debugEnabled) {
        this.debugEnabled = debugEnabled;
        this.model = model;
        this.device = initializeDeviceUI(this.model);
    }

    initializeDependencies() {
        this.initializeHelperDependencies();
        this.initializeServices();
    }

    // setup Helper services.
    initializeHelperDependencies() {
        this.dateHelper = new DateHelper();
        this.mobileHelper = new MobileHelper(this.debugEnabled);
        this.htmlHelper = new HtmlHelper(this.model, this.debugEnabled);
        this.scriptHelper = new ScriptHelper(this.debugEnabled);
    }

    // Setup all required services
    initializeServices() {
        this.chartService = new ChartService(this.debugEnabled);

    }
}