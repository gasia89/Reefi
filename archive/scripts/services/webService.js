import { ConfigService } from "../services/configService.js";


export class WebService {
    constructor(htmlHelper, localHostAddressOverride, apiTarget, debugEnabled) {
        this.debugEnabled = debugEnabled;
        this.htmlHelper = htmlHelper;
        this.statusHelper = this.htmlHelper.statusHelper;


        if (this.debugEnabled) {
            console.log("web service started in debug mode");
            // when debugging, you want to target a remote uno, but have the code local.
            this.apiUrl = apiTarget;
            this.localhost = localHostAddressOverride;
            console.log(`localhostOverride = ${localHostAddressOverride}`);
            console.log(`apiTarget = ${apiTarget}`);
        }
        else {
            this.urlList = window.location.href.match(/[0-9.]+/);
            this.localhost = this.urlList[0];
            this.apiUrl = this.urlList[0];
        }

        this.configService = new ConfigService(this.apiUrl);
    }

    getConfigFile(endpointName) {
        var url = `http://${this.apiUrl}/${endpointName}.cfg`;
        this.fetch('GET', url, callback);
    }

    getTextFile(endpointName) {
        console.log(`getting text file from endpoint: ${endpointName}`);
        var url = `http://${this.apiUrl}/${endpointName}.txt`;
        return new Promise((resolve, reject) => {
            this.configService.loadConfigFromFile(url).then(res => {
                resolve(res);
            });
        });
    }

    getResponse(endpointName, callback) {
        var url = `http://${this.apiUrl}/${endpointName}`;
        this.fetch('GET', url, callback);
    }

    fetch(url, method, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = check_ready;
        function check_ready() {
            if (xhr.readyState === 4) {
                if (callback != null) {
                    callback(xhr.status === 200 ? xhr.responseText : null);
                }
            }
        }
        xhr.open(method, url, true);
        xhr.send();
    }
}