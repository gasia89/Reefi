import { StatusHelper } from "../../helpers/statusHelper.js";

export class Header {
    constructor() {
        this.element = document.getElementById("header");
        this.statusHelper = new StatusHelper("headerStatus", "headerStatusMessage");
        this.logo = document.getElementById("appHeaderLogo");
    }

    show = () => {
        this.element.display = "flex";
    }

    hide = () => {
        this.element.display = "none";
    }
}