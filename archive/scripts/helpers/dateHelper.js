export class DateHelper {
    constructor() {
        this.isDateSupported = false;
        this.setup();
    }

    setup() {
        var inputElement = document.createElement('input');
        var value = 'a';
        inputElement.setAttribute('type', 'date');
        inputElement.setAttribute('value', value);
        this.isDateSupported = (inputElement.value !== value);
    }
}