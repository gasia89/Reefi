import { MobileHelper } from "../helpers/mobileHelper.js";

export class FileService {
    constructor(debugEnabled) {
        this.mobileHelper = new MobileHelper(debugEnabled);
        this.userFileElement = $("myFile");
        this.urlList = window.location.href.match(/[0-9.]+/);

    }

    LoadUserFiletoStr() {
        if (userFileElement.files === undefined || userFileElement.files.length === 0) {
            alert('Please select a file!');
            return;
        }
        else {
            var reader = new FileReader();

            reader.onload = function (event) {
                if (debugEnabled) {
                    console.log('File content:', event.target.result);
                }

                for (var i = 0; i < urlList.length; i++) {
                    sendLED(urlList[i], event.target.result);
                }

                this.mobileHelper.setMobileStyling();

                looping2 = true;
                lcount = 0;
                SameData[0] = false;
                SameData[1] = false;
                SameData[2] = false;
                setTimeout(refresh_values, 2000);
            };

            reader.readAsText(file);
        }      
    }
}