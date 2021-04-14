import { ReeFiFormBase } from "../common/reeFiFormBase.js";

export class SSIDSubmitForm extends ReeFiFormBase {
    constructor(formElement, webService, statusHelper, ssidLookupForm, debugEnabled) {
        super(formElement, webService, statusHelper, debugEnabled);
        this.submitBtn = document.getElementById();
        this.reScanBtn = document.getElementById();
        this.ssidlookupForm = ssidLookupForm;
    }

    initialize() {
        this.submitBtn.addEventListener("click", this.submitSelectedSSID);
        this.reScanBtn.addEventListener("click", );
    }

    submitSelectedSSID() {

    }
}