import { StatusHelper } from "../../helpers/statusHelper.js";

export class Footer {
    constructor() {
        this.element = document.getElementById("footer");
        this.status = new StatusHelper("footerStatus", "footerStatusMessage");
    }

    show = () => {
        this.element.style.display = "flex";
    }

    hide = () => {
        this.element.style.display = "none";
    }
}