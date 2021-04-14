export class StatusHelper {
    constructor(statusElementId) {
        this.currentStatus = "Initializing";
        this.statusElement = document.getElementById(statusElementId);
    }

    updateStatus(statusMessage) {
        console.log(statusMessage);
        if (statusMessage !== "" && statusMessage !== null) {
            this.currentStatus = statusMessage;
            this.statusElement.innerHTML = this.currentStatus;
        }
    }
}