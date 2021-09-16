export class StatusHelper {
    constructor(element, textElement) {
        this.currentStatus = "";
        this.element = document.getElementById(element);
        this.statusMessageElement = document.getElementById(textElement);
        this.updateStatus(this.currentStatus);
    }

    updateStatus(statusMessage) {
        if (statusMessage !== "" && statusMessage !== null) {
            this.currentStatus = statusMessage;
            this.statusElement.innerHTML = this.currentStatus;
        }
    }

    show = () => {
        this.element.style.display = "flex";
    }

    hide = () => {
        this.element.style.display = "none";
    }
}