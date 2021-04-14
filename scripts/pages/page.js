export class Page {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }

    show() {
        this.element.style.display = "inline-block";
    }

    hide() {
        this.element.style.display = "none";
    }
}