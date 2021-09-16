export class ReeFiFormBase {
    constructor(formElement, webService, statusHelper, debugEnabled) {
        this.formElement = document.getElementById(formElement);
        this.statusHelper = statusHelper;
        this.webService = webService;
        this.debugEnabled = debugEnabled;
        this.currentResult = {};
    }
}