export class ConfigurationManager {
    constructor(configApiPath, debugOptions = null) {
        this.apiTarget = configApiPath;
        this.debugOptions = debugOptions;
        this.isFirstTimeSetup = true;

        if (debugOptions !== null && debugOptions.debugEnabled) {
            console.log("Initializing configuration manager in debug mode");
            this.userSettings = this.loadUserConfigFromRemote();
        } else {
            this.userSettings = this.loadUserConfig();
        }
    }

    loadUserConfig() {
        return new Promise((resolve, reject) => {
            if (this.debugOptions.debugEnabled) {
                console.log(`using debugOptions: ${JSON.stringify(this.debugOptions)}`);
                if (this.debugOptions.userSettings != null) {
                    // return the settings we passed in for debugging. 
                    resolve(this.debugOptions.userSettings);
                } else {
                    var loadOptionsPromise = new Promise((optionsResolve, optionsReject) => {
                        this.loadUserConfigFromRemote().then((result) => {
                            console.log(`Loaded userSettings from ${this.apiTarget}: \r\n${result}`);
                            optionsResolve(result);
                        });

                        optionsReject();
                    });

                    resolve(loadOptionsPromise);
                }
            } else {
                resolve(this.loadUserConfigFromRemote());
            }
        });
    }

    loadUserConfigFromRemote() {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();

            xhr.onLoad = (e) => {
                if (xhr.readyState !== 4) {
                    if (this.debugOptions.debugEnabled) {
                        console.log('Invalid ready state.');
                        reject();
                    }

                    if (xhr.status === 200) {
                        var data = xhrDoc.response;

                        if (this.debugOptions.debugEnabled) {
                            console.log(`response: \r\n ${data}`);
                        }

                        resolve(data);
                    }
                }
            }

            xhr.open('GET', this.apiTarget);

            if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }

            xhr.send();
        });
    }

    loadFromFile = (filePath) => {  
        var xhr = new XMLHttpRequest();
        var promise = new Promise((resolve, reject) => {

            if (this.debugOptions.debugEnabled) {
                console.log(`Loading file from path: '${filePath}'`);
            }

            xhr.onload = (e) => {
                if (xhr.readyState !== 4) {
                    if (this.debugOptions.debugEnabled) {
                        console.log('invalid ready state.');
                    }
                    
                    reject();
                }

                if (this.debugOptions.debugEnabled) {
                    console.log("ready state changed.");
                }
                
                if (xhr.status === 200) {
                    var data = xhr.response; //Here is a string of the text data 
                    console.log(data);
                    resolve(data);
                }
                else {
                    console.log(`Non-Success Status code recieved from Load File Endpoint: '${filePath}', status-code: '${xhr.status}'`);
                }
            }
        });

        xhr.open('GET', `${this.apiTarget}${ filePath }`);

        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
        }

        xhr.send(); //sending the request

        return promise;
    };
}