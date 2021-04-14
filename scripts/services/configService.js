export class ConfigService {
    constructor(apiUrl) {
        this.wifiList = '';
        this.apiUrl = apiUrl;
        this.wifiListPromise = null;
    }

    loadWifiListFromDevice() {
        return new Promise((resolve, reject) => {
            this.loadConfigFromFile(`http://${this.apiUrl}/wifi_list.txt`).then(res => {
                resolve(res);
            });
        });
    }

    loadConfigFromFile(filePath) {
        console.log(`Loading file from path: '${filePath}'`);
        var xhrDoc = new XMLHttpRequest();
        var promise = new Promise((resolve, reject) => {

            xhrDoc.onload = (e) => {
                if (xhrDoc.readyState !== 4) {
                    console.log('invalid ready state.');
                    reject();
                }

                console.log("ready state changed.");

                if (xhrDoc.status === 200) {
                    var data = xhrDoc.response; //Here is a string of the text data 
                    console.log(data);
                    resolve(data);
                }
                else {
                    console.log(`Non-Success Status code recieved from Load File Endpoint: '${filePath}', status-code: '${xhrDoc.status}'`);
                }
            }
        });

        xhrDoc.open('GET', filePath)
        if (xhrDoc.overrideMimeType) {
            xhrDoc.overrideMimeType('text/plain; charset=x-user-defined');
        }

        xhrDoc.send(); //sending the request

        return promise;
    };
}
