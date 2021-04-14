export class Slider {
    constructor(sliderElementId, formHelper) {
		this.Element = $(sliderElementId);
		this.FormHelper = formHelper;
    }

	showValue() {
		looping2 = false;
		for (var i = 0; i < LEDCH; i++) {
			$("N" + (i + 1)).value = $("Slider" + (i + 1)).value;
			updateRangeColor(i);
			$("Per" + (i + 1)).value = Math.round(1000 * $("Slider" + (i + 1)).value / 1023) / 10;
		}
		Update_Fields(Mode);
	}
}