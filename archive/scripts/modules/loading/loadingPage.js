import { Page } from "./page.js";

export class LoadingPage extends Page {
    constructor(elementId) {
        super(elementId);
    }

    show() {
        console.log("showing loading page.");
        super.show();
    }
}