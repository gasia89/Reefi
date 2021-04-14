import { StatusHelper } from "./statusHelper.js";

export class HtmlHelper {
    constructor(model, debugEnabled) {
        this.model = model;
        this.debugEnabled = debugEnabled;
        this.statusHelper = new StatusHelper("status");
    }
}