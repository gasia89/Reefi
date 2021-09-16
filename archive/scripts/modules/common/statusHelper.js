export class StatusHelper {
    constructor(statusElementId, statusMessageElementId) {
        this.currentStatus = "Initializing";
        this.statusElement = document.getElementById(statusElementId);
        this.statusMessageElement = document.getElementById(statusMessageElementId);
    }

    updateStatus(statusMessage) {
        console.log(`Setting StatusMessage to: ${statusMessage}`);

        if (statusMessage !== null && statusMessage !== "") {
            this.currentStatus = statusMessage;
            this.statusMessageElement.innerHTML = statusMessage;
        }
    }
}