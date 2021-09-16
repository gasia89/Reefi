import { ReeFiApp } from "./app/reeFiApp.js";

var reeFiApp;

window.onload = function () {


    /*
     These options override the initial setup process of the ReeFiApp, and will allow you
     to set alternative values to application settings for testing and debugging purposes.
     Friendly Reminder: Don't fuck with shit you don't understand.
     */
    let debugOptions = {
        // enable/disable debugging across the entire application with this flag.
        debugEnabled: true,

        // Set this value to whatever target IP/localhost:port target you would like for debugging.
        deviceApiTarget: "http://10.0.0.160/",

        // This is the target the application will use to control the device.
        configurationApiTarget: "http://localhost:51295/",

        // overrides the first time setup flag to test the setup page.
        overrideFirstTimeSetupToTrue: true,

        userSettings: {
            deviceName: "Uno",
            isFirstTimeSetup: true,
            deviceUrl: "http://10.0.0.160/"
        }
    };

    if (debugOptions.debugEnabled) {
        reeFiApp = new ReeFiApp(debugOptions);
    }
    else {
        // Production/Release mode
        reeFiApp = new ReeFiApp();
    }

    // start the application
    reeFiApp.start();
}