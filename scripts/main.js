$(() => {
    // Globals
    var _debugEnabled = true;
    var _isMobile = false;
    var _urlList = window.location.href.match(/[0-9.]+/);
    var _deviceUIUrl = 'http://';
    var devices = [];


    // old globals below
    var modes = ["Now", "Sunrise", "MidDay", "Sunset", "Night", "Moon", "Mode6", "Mode7", "Mode8", "Mode9", "Mode10"];
    var mode = "Now";
    var preMode = Mode;
    var ctx = [];
    var graph = [];
    var looping2 = true;
    var sameData = [false, false, false];
    var lcount = 0;
    var prevData = [];
    var nowChanged = false;
    var timeChanged = false;
    var firstCall = true;
    var numModes = 11;
    var validModes = 11;
    var deleteMode = 0;
    var touchtime = 0;
    var lastMyMenu;
    var nowEditable = true;
    var profilesMax = 20;
    var LEDS = [];
    var LEDCH = 9;

    var URL_Settings = [];
    var URL_Profiles = [];
    var URL_Nows = [];

    var FirmwareText;
    var fwCnt = 0;
    var initGraph;

    // Page Elements
    let sideNav = $("#mySidenav");
    let openNavBtns = $('.open-nav');
    let closeNavBtns = $('.close-nav');
    let infoFrame = $('#InfoFrame');
    let myForm = $('#myForm');
    let myFormSetup = $("#myFormSetup");
    let myFormLEDs = $("#myFormLEDs");
    let advancedSetup = $("#AdvSetup");
    let dateSupported = getDateSupportedVal();

    // swap the current URL based on debug status.
    if (_debugEnabled) {
        _curURL = "http://localhost:51295";
    } else {
        _deviceUIUrl += _urlList[0];
    }

    if (!_isMobile) {
        myForm.css('padding-left', '250px');
        myFormSetup.css('padding-left', '250px');
        myFormLEDs.css('padding-left', '250px');
        advancedSetup.css('padding-left', '250px');
        openNav();
    }

    openNav = () => {
        infoFrame.load(`${_deviceUIUrl}/info2`);
        sideNav.css('width', '250px');
    }

    closeNav = () => {
        if (_isMobile) {
            sideNav.css('width', '0px');
        }
    }

    getDateSupportedVal = () => {
        var input = document.createElement('input');
        var value = 'a';
        input.setAttribute('type', 'date');
        input.setAttribute('value', value);

        return (input.value !== value);
    }

    loadScript = (url, callback) => {
        $.getScript(url, (data, textStatus, jqxhr) => {
            if (_debug) {
                // this is the data loaded from the url provided.
                console.log(data);
                // this is the response in text
                console.log(textStatus);
                // log the HTTP Status code.
                console.log(`Status Code: ${jqxhr.status}`);
                // execute supplied callback.
                callback();
            }
        });
    }

    loadUserFiletoStr = () => {
        var file = $("#myFile").prop('files')[0];
        var files = $("#myFile").prop('files');

        if (!files.length) {
            alert('Please select a file!');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (event) {
            if (_debug) {
                console.log('File content:', event.target.result);
            }

            for (var i = 0; i < _urlList.length; i++) {
                if (i === 0) {
                    sendLED(_curURL, event.target.result);
                } else {
                    sendLED(_urlList[i], event.target.result);
                }
            }

            $("#AdvSetup").hide()
            $("#myForm").show();
            $("#myFormSetup").hide();
            $("#myFormLEDs").hide();

            looping2 = true;
            lcount = 0;
            SameData[0] = false;
            SameData[1] = false;
            SameData[2] = false;

            setTimeout(refreshValues, 2000);
        };

        reader.readAsText(file);
    }

    download = (filename, text) => {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

    myDownload = () => {
        fetch(curURL + '/settings_all.cfg', 'GET', DownloadSettings);
    }

    downloadSettings = (str) => {
        download($("#SaveFileName").val(), str);
    }

    startScripts = () => {
        //$("status").innerHTML = "Status: Retrieving menu...";
        //setTimeout(GLED_init, 700);
        Label_lv();
        $("#status").text("Status: Retrieving graphic library...");
        //setTimeout(graph_init, 100);
        GenGraph();
        GenSelection();
        GenCustomBtn();
        graph_init();
        GLED_init();
        LoadHTMLfame();
        LoadImgSrc();
    }


    loadHTMLfame = () => {
        if (FirstCall) {
            FirstCall = false;
            $('#WiFiFrame').load(curURL + '/wifi.html');
            //$('InfoFrame').src = 'http://'+curURL+'/info2';
        }
    }

    addZero = (i) => {
        if (i < 10) {
            i = "0" + i;
        }

        return i;
    }

    getDateTime = () => {
        var d = new Date();
        var day = addZero(d.getDate());
        var month = addZero(d.getMonth() + 1);
        var year = d.getFullYear();
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());

        $("#date").val(year + "-" + month + "-" + day);
        $("#time").val(h + ":" + m);
    }

    switchDisplay = () => {
        return new Promise((resolve) => {
            $("#AdvSetup").hide();
            $("#myForm").show();
            $("#myFormSetup").hide();
            $("#myFormLEDs").hide();
            resolve();
        });
    }

    refresh_values = () => {
        if ((looping2 == true) && (lcount < 30)) {
            $("status").text("Status: Retrieving settings...");
            let profilesUrl = _curURL + '/profiles.cfg';
            let nowUrl = _curURL + '/now.cfg';
            let settings3Url = _curUrl + '/settings3.cfg';

            if (_debugEnabled) {
                // log each path we are fetching, as we attempt to fetch it.
                // that way, if it breaks, the last log entry will be the path that failed.
                console.log("Fetching:");
                console.log(profilesUrl);
                fetch(profilesUrl, 'GET', new_values_p);

                console.log(nowUrl);
                fetch(nowUrl, 'GET', new_values_now);

                console.log(settings3Url);
                fetch(settings3Url, 'GET', new_values_9);
            } else {
                fetch(profilesUrl, 'GET', new_values_p);
                fetch(nowUrl, 'GET', new_values_now);
                fetch(settings3Url, 'GET', new_values_9);
            }

            lcount++;

            // 0 is p, 1 is r, 2 is now
            if (SameData[0] && SameData[1]) {
                setTimeout(refreshNow, 2000);
            } else {
                setTimeout(refreshValues, 2000);
            }
        } else {
            $("status").text(`Status: Ver${$("#Ver").val()}`);
        }

        if (lcount >= 30) {
            $("status").text(`Status: Ver${$("#Ver").val()}`);
        }
    }

    cancelRefresh = () => {
        return new Promise((resolve) => {
            $("status").text("Status: Canceled and Retrieving settings...");
            looping2 = true;
            lcount = 0;
            SameData[0] = false;
            SameData[1] = false;
            SameData[2] = false;
        });

        refreshValues();
    }

    saveDateTime = () => {
        var str = `Date=${$("#date").va()}&Time=${$("#time").val()}&TimeZone=${$("#timezone").val()}&DLS=${$("#DLS").is(":checked")}"&POT=${$("#POT").val()}&SelectDLS=${$("#SelectDLS").val()}`;

        for (var i = 0; i < urlList.length; i++) {
            fetch('http://' + urlList[i] + '/SaveDateTime?' + str, 'GET');
        }

        switchDisplay().then(() => {
            cancelRefresh().then(() => {
                refreshValues();
            });
        });

        //setTimeout(switchDisplay, 800);
        //setTimeout(cancel_refresh, 1000);
    }

    dLSFieldUpdate = () => {
        if ($("#DLS").is(":checked")) {
            $("#SelectDLSField").show();
        } else {
            $("#SelectDLSField").hide();
        }
    }

    setLightingMode = () => {
        for (var i = 0; i < _urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/LightingModeDemo', 'GET', SFX_ms);
            } else {
                fetch('http://' + _urlList[i] + '/LightingModeDemo', 'GET');
            }
        }
    }

    disablePOT = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/DisableLEDStartTest', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/DisableLEDStartTest', 'GET');
            }
        }
    }

    enablePOT = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/EnableLEDStartTest', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/EnableLEDStartTest', 'GET');
            }
        }
    }

    clearWifi = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/wifi_clear', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/wifi_clear', 'GET');
            }
        }
    }

    clearGroup = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/group_clear', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/group_clear', 'GET');
            }
        }

        //reload
        location.reload();
    }

    restart() {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/restart', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/restart', 'GET');
            }
        }
    }

    cool = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/cooldown', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/cooldown', 'GET');
            }
        }
    }

    loadImgSrc = () => {
        var imgsrc = document.createElement("img");
        imgsrc.src = "ReeFi_Logo_med_web.png";
        imgsrc.width = 300;
        imgsrc.height = 156;
        $("logo").appendChild(imgsrc);
    }

    createCanvas = (divName) => {

        var div = document.getElementById(divName);
        var canvas = document.createElement('canvas');
        div.appendChild(canvas);

        if (typeof G_vmlCanvasManager != 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }

        var ctx = canvas.getContext("2d");
        return ctx;
    }

    chConvert_9 = (l) => {
        var list = [];
        for (var i = 0; i < l.length; i++) {
            list[i] = parseInt(l[i]);
        }
        var LED_Array = [];

        if ($("#ModelType").val("Uno")) {

            LED_Array[0] = list[0] * 8 / 10.76;		//u2 16 * .5
            LED_Array[1] = list[1];				//u1 16 * .6725
            LED_Array[2] = list[2];				//v  16 * .6725
            LED_Array[3] = list[3] * 10 / 10.76;		//rb 10
            LED_Array[4] = list[4] * 6 / 10.76;		//B  6
            LED_Array[5] = list[5] * 2 / 10.76;		//l  2
            LED_Array[6] = list[6] * 1 / 10.76;		//a  1
            LED_Array[7] = list[7] * 1 / 10.76;		//ww 1
            LED_Array[8] = list[8] * 4 / 10.76;		//cw 4

        } else {

            LED_Array[0] = list[0] * 4 / 6;		//u2 4
            LED_Array[1] = list[1] * 4 / 6;		//u1 4
            LED_Array[2] = list[2];			//v  6
            LED_Array[3] = list[3];			//rb 6
            LED_Array[4] = list[4];			//B  6
            LED_Array[5] = list[5] * 2 / 6;		//l  2
            LED_Array[6] = list[6] * 2 / 6;		//a  2
            LED_Array[7] = list[7] * 2 / 6;		//ww 2
            LED_Array[8] = list[8] * 4 / 6;		//cw 4

        }


        return LED_Array;
    }

    setGraphParms = (i) => {
        graph[i].maxValue = 1023;
        graph[i].height = 300;
        if (modes.indexOf(Mode) == i) {
            graph[i].width = 70;
            graph[i].margin = 9;
            graph[i].border = 4;
        } else {
            graph[i].width = 50;
            graph[i].margin = 2;
            graph[i].border = 0;
        }
        //graph[i].backgroundColor = "#f1dfd5";
        //graph[i].colors = ["#3502ff", "#fffcf9", "#02ffd4", "#f20000", "#6100bc", "#a749ff"];  //RB, CW, Cyan, Red, UV1, UV2
        //graph[i].colors = ["#fffcf9", "#FFF5D7", "#FF9D39", "#B5FF00", "#0087FF", "#3502ff", "#8E00FF", "#6100bc", "#a749ff"];  //CW, WW, A, L, B, RB, V, U1, U2
        graph[i].colors = ["#aa83cb", "#785cb4", "#8E00FF", "#3502ff", "#0087FF", "#B5FF00", "#ffbd70", "#FFF089", "#FAFAFF"];  //U2,U1,V,RB,B,L,A,WW,CW
    }

    UpdateGraph_9 = () => {
        var L = [];
        for (var j = 0; j < NumModes; j++) {
            setGraphParms(j);

            if (modes.indexOf(Mode) == j) {
                graph[j].labelColor = "#FF0000";
                graph[j].font = "bold 16px sans-serif";
            } else {
                graph[j].labelColor = "#000000";
                graph[j].font = "bold 12px sans-serif";
            }
            graph[j].xAxisLabelArr = modes[j];

            for (var i = 0; i < 9; i++) {
                //L[i]=parseInt($("Num"+((i+1)+j*9)).value);

                if (j == 0) {
                    L[i] = parseInt($("nowch" + i).value);
                } else {
                    var Pindex = $(`#m ${j - 1}_pindex`).val();
                    L[i] = parseInt($(`#p${Pindex}_ch${i}`).val()) * parseInt($(`#m${j - 1}_master`).val()) / 100;
                    //L[i]=parseInt($("p"+Pindex+"_ch"+i).value);
                }
            }

            graph[j].update(chConvert_9(L));
        }

        $("#status").text(`Status: Ver ${$("#Ver").val()}`);
        //var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        //$("status").innerHTML = "width = " + width;
    }

    fetchCROS = (url, method, callback) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = checkReady;

        function checkReady() {
            if (xhr.readyState === 4) {
                if (callback != null) {
                    callback(xhr.status === 200 ? xhr.responseText : null);
                }
            }
        }
        xhr.open(method, url, true);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.send({ 'request': "authentication token" });
    }


    // event handlers
    openNavBtns.on("click", openNav);
    closeNavBtns.on("click", closeNav);


    // multi-device logic
    appendDevice = (deviceIP) => {
        for (var i = 0; i < devices.length; i++) {
            if (devices[i].indexOf(deviceIP)) {
                console.log("Detected Duplicate IP being added to device list. Blocked.");
            } else {
                devices.push(`http://${deviceIP}`);
            }
        }
    }

    fetch = (url, method, callback, itr, node) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = check_ready;
        function check_ready() {
            if (xhr.readyState === 4) {
                if (callback != null) {
                    if ((itr != null) && (node != null)) {
                        if (xhr.status === 200) {
                            callback(xhr.responseText, itr, node);
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(xhr.status === 200 ? xhr.responseText : null);
                    }
                }
            }
        }
        xhr.open(method, url, true);
        xhr.send();
    }

    sFXPlay = () => {
        SFX.pause();
        SFX.currentTime = 0;
        SFX.play();
    }

    sFXMs = (strlist) => {
        if (strlist) {
            var d = strlist;
            setTimeout(sFXPlay, d);
        }
    }

    newValuesP = (strlist) => {
        if (strlist) {

            var list = strlist.split(/[,\n]/);

            if (list[0] != "<html>") {
                if (strlist == prevData[0]) {
                    SameData[0] = true;
                }

                $("#status").text("Status: Done");
                prevData[0] = strlist;

                GenFields_p(list);
            }
        }
    }

    newValuesNow = (strlist) => {
        if (strlist) {

            var list = strlist.split(/[,\n]/);
            if (list[0] != "<html>") {
                if (strlist == prevData[2]) {
                    SameData[2] = true;
                }

                $("#status").innerHTML = "Status: Done";

                prevData[2] = strlist;

                if (SameData[0] && SameData[1] && SameData[2]) {
                    looping2 = false;
                    $("#status").text(`Status: Ver${$("Ver").val()}`);
                }

                if (looping2) {
                    GenFields_now(list);
                }
            }
        }
    }

    newValues9 = (strlist) => {

        if (strlist) {
            var list = strlist.split(/[,\n]/);

            if (list[0] != "<html>") {
                if (strlist == prevData[1]) {
                    SameData[1] = true;
                }

                $("#status").text("Status: Done");
                NowChanged = false;
                TimeChanged = false;
                for (var i = 0; i < NumModes; i++) {
                    $(`#graphDiv${(i + 1)}`).css("background-color", "rgba(0,0,0,0)");
                    //$("Time"+(i)).style.backgroundColor="";
                    //graph[i].backgroundColor = "#f1dfd5";
                }

                if (looping2) {
                    GenFields_v3(list);
                    ModGraph();
                    UpdateGraph_9();
                    Selection_init();
                }

                prevData[1] = strlist;
            }
        }
    }

    saveNows = (strlist, itr, menuitem) => {
        URL_Nows[itr] = strlist;

        if (itr == 0) {
            looping2 = true;
            newValuesNow(strlist);
        } else {
            if (strlist != URL_Nows[0]) {
                menuitem.css("color", "#FCF003");
            }
        }
    }

    saveSettings = (strlist, itr, menuitem) => {
        URL_Settings[itr] = strlist;

        if (itr == 0) {
            looping2 = true;
            new_values_9(strlist);
        } else {
            if (strlist != URL_Settings[0]) {
                menuitem.css("color", "#FCF003");
            }
        }
    }

    saveProfiles = (strlist, itr, menuitem) => {
        URL_Profiles[itr] = strlist;

        if (itr == 0) {
            new_values_p(strlist);
        } else {
            if (strlist != URL_Profiles[0]) {
                menuitem.css("color", "#FCF003");
            }
        }
    }

    resumeRefresh = () => {
        $("#status").text("Status: Retrieving settings...");

        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/resume.txt', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/resume.txt', 'GET');
            }
        }

        looping2 = true;
        lcount = 0;
        SameData[2] = false;
        setTimeout(refreshNow, 2000)
        $("#graphDiv1").css("background-color", "rgba(0,0,0,0)");
    }

    refreshNow = () => {
        if ((looping2 == true) && (lcount < 30)) {
            $("#status").text("Status: Retrieving settings...");
            fetch(curURL + '/now.cfg', 'GET', newValuesNow);
            lcount++;
            updateMode(modes.indexOf(Mode));
            setTimeout(refresh_now, 2000);
        } else {
            $("#status").text(`Status: Ver${$("Ver").val()}`);
        }

        if (lcount >= 30) {
            $("#status").text(`Status: Ver${$("Ver").val()}`);
        }
    }

    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    deleteMode = (Mode) => {
        DeleteMode = modes.indexOf(Mode);
        saveRefresh();
    }

    sendNowRefresh = () => {
        $("#status").text("Status: Sending NOW settings...");

        looping2 = true;
        lcount = 0;
        SameData = [true, true, false];

        var NowData = getFormArgs($("#myFormMainNow"));

        NowData = encodeURIComponent(NowData);

        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                sendLED(_curUrl, "NoUpdate=Save" + NowData);
            } else {
                sendLED(urlList[i], "NoUpdate=Save" + NowData);
            }
        }

        $("#graphDiv1").css('background-color', "rgba(0,0,0,0)");

        setTimeout(refreshNow, 2000);
    }

    save_refresh = () => {
        if (DeleteMode == 0) {
            $("#status").text("Status: Saving settings...");
        } else {
            $("#status").text("Status: Deleting " + Mode + " and Save settings...");
        }

        looping2 = true;
        lcount = 0;
        SameData[0] = false;
        SameData[1] = false;
        SameData[2] = false;
        //get form data

        var FormData = getFormArgs($("#myFormMain"));
        var NowData = getFormArgs($("#myFormMainNow"));

        if ($("#graphDiv1").css("background-color") !== "rgba(0,0,0,0)") {
            FormData += "&" + NowData;
        }

        FormData += "&DeleteMode=" + (DeleteMode - 1);
        DeleteMode = 0;

        FormData = encodeURIComponent(FormData);

        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                sendLED(_curUrl, "NoUpdate=Save" + FormData);
            } else {
                sendLED(urlList[i], "NoUpdate=Save" + FormData);
            }
        }

        // clear color if under aquarium group_clear
        var index;
        if (urlList.length > 1) {
            index = findParentChildNodeIndex(lastMyMenu) + 1;

            for (var i = 0; i < urlList.length; i++) {
                lastMyMenu.parentNode.childNodes[i + index].style.color = "";
            }
        }

        //setTimeout(refresh_values.bind(null, urllist[0]), 2500);
        setTimeout(refreshValues, 2000);
    }

    initGraph = () => {
        for (var i = 0; i < NumModes; i++) {
            ctx[i] = createCanvas("graphDiv" + (i + 1));
            graph[i] = new BarGraph(ctx[i]);
            graph[i].width = 45;
            graph[i].height = 50;
            graph[i].margin = 0;
            graph[i].backgroundColor = "LightGray";
        }
        $("#status").text("Status: Retrieving settings...");
    }

    graph_init = () => {
        // loadScript("bar_graph_v.js", InitGraph);
        initGraph();
        $("#status").text("Status: Retrieving menu...");
        //setTimeout(GLED_init, 50);
        //setTimeout(refresh_values, 150);
        //refresh_values();

        fetch('http://' + curURL + '/profiles.cfg', 'GET', new_values_p);
        fetch('http://' + curURL + '/now.cfg', 'GET', new_values_now);
        fetch('http://' + curURL + '/settings3.cfg', 'GET', new_values_9);

        setTimeout(SetHeader, 650);
    }

    setHeader = () => {
        // update header
        if ($("#ModelType").val() === "Uno") {
            $("#header").text($("header").text() + " Uno");
        } else {
            $("header").text($("header").text() + " Duo Extreme");
        }
    }

    GLED_init() {
        $("#statusSetup").text("Status: Retrieving stored LEDs...");
        fetch(_curURL + '/gleds.txt', 'GET', new_GLEDs);
    }

    updateModeName = () => {
        var mInt = modes.indexOf(Mode);
        var previousMode = Mode;
        if (mInt > 0) {
            looping2 = false;
            $(`#graphDiv${(mInt + 1)}`).css('background-color', "#FFFF00");
            //$("Time"+(mInt)).style.backgroundColor="#FFFF00";
            //graph[mInt].backgroundColor = "#FFFF00";
            modes[mInt] = $("#mode_name").text().split(/[< &%^*#@>'"/]/)[0];
            $("#m${(mInt - 1)}_name").val(modes[mInt]);
            Mode = modes[mInt];
            UpdateGraph9();

            if (Mode == "Moon") {
                updateMode(mInt);
            }
            if ((previousMode == "Moon") && (Mode != "Moon")) {
                updateMode(mInt);
            }
        }
    }

    clearValue = (id) => {
        $(`#${id}`).val("");
    }

    dblTap = (mInt) => {
        var selMode = modes[mInt];

        if ((((new Date().getTime()) - touchtime) < 800) && (selMode == preMode)) {
            nowEditable = true;
            update2Now(mInt);
            touchtime = new Date().getTime();
        } else {
            updateMode(mInt);
            touchtime = new Date().getTime();
            preMode = Mode;
        }
    }

    profile2Now = (Pindex) => {
        updateMode(0);

        var num;

        for (var i = 0; i < 9; i++) {

            num = $("#p" + Pindex + "_ch" + i).val();
            $("#N" + (i + 1)).val(num);
            $("#Slider" + (i + 1)).val(num);
            $("#Per" + (i + 1)).val(Math.round(1000 * num / 1023) / 10);
            updateRangeColor(i);
        }

        updateFields(Mode);
    }

    update2Now = (mInt) => {
        //Update_Mode(mInt);
        updateMode(0);

        var num;

        for (var i = 0; i < 9; i++) {

            if (mInt == 0) {
                num = $("nowch" + i).val();
            } else {
                var Pindex = $("#m" + (mInt - 1) + "_pindex").val();
                num = $("#p" + Pindex + "_ch" + i).val() * $("#m" + (mInt - 1) + "_master").val() / 100;
            }

            $("#N" + (i + 1)).val(num);
            $("#Slider" + (i + 1)).val(num);
            $("#Per" + (i + 1)).val(Math.round(1000 * num / 1023) / 10);
            updateRangeColor(i);
        }

        updateFields(Mode);
    }

    updateMode = (mInt) => {
        selection(mInt);
        mode = modes[mInt];
        $("#NumOfModes").val(ValidModes - 1);
        $("#mode_status").text("");
        $("#mode_name").off("input", updateModeName);

        if (mInt == 0) {
            $("#Accl1").show();
            $("#Accl2").show();
            $("#modeRow").attr('colspan', 3);
            $("#Time").attr('colspan', 2);
            $("#DeleteMode").hide();
            //$("mode").innerHTML = Mode+" Status: ";
            $("#mode").text(Mode);
            $("#mode_name").prop('contenteditable', false);
            $("#mode_name").text($("#cMode").val());

            if ($("#cMode").val() == "Moon") {
                $("#mode").text(Mode + " Status: " + $("#cMode").val() + " at " + $("#cMoon").val() + "%");
            }
            $("#Time").children()[0].data("Current Time");
            $("#Rate").css('visibility', 'hidden');
            $("#R").hide();

            if (dateSupported) {
                $("#H").hide();
                $("#M").hide();
                $("#Time").children()[2].text("");
                $("#time2").show();
            } else {
                $("#H").show();
                $("#M").show();
                $("#Time").children()[2].text(":");
                $("#time2").hide();
            }

            $("#time2").val(addZero($("#chr").val()) + ":" + addZero($("#cmin").val()));
            $("#H").val($("#chr").val());
            $("#M").val($("#cmin").val());
            $("#pwrH").val($("#shr").val());
            $("#pwrM").val($("shr").val());
            $("#Time").children()[6].data(", TimeZone");
            $("#Zone").val($("#TZ").val());
            $("#Zone").show();
            $("#Resume_row").show();

            if (parseInt($("#cMode").val().split("Manual")[1]) > 0) {
                $("#Resume").css('visibility', 'visible');
            } else {
                $("#Resume").css('visibility', 'hidden');
            }

            if (nowEditable) {
                $("#F").show();
                $("#SliderAll").show();
            } else {
                $("#F").hide();
                $("#SliderAll").hide();
            }
            $("#Time").show();
            $("#PwrTime").hide();

            $("#Time").css('visibility', 'hidden');
            $("#MasterBar").hide();
            $("#CustomBtns").show();
        } else {

            $("#F").show();
            $("#SliderAll").show();

            $("#Accl1").hide();
            $("#Accl2").hide();
            $("#modeRow").prop('colspan', 3);
            $("#Time").prop('colspan', 4);
            $("#DeleteMode").show();
            $("#mode").text("Period: ");
            $("#mode_name").prop('contenteditable', true);
            $("#mode_name").text(mode);

            if (mode == "Moon") {
                $("#mode_status").text(" at " + $("#cMoon").val() + "% Full");
            }

            $("#mode_name").on("input", updateModeName);

            $("#Time").children()[0].data("Start Time");

            $("#Rate").val($("#m" + (mInt - 1) + "_rate").val());
            $("#Rate").css('visibility', 'visible');
            $("#R").show();
            $("#H").val($("#m" + (mInt - 1) + "_hr").val());
            $("#M").val($("#m" + (mInt - 1) + "_min").val());
            $("#time2").val(addZero($("#m" + (mInt - 1) + "_hr").val()) + ":" + addZero($("#m" + (mInt - 1) + "_min").val()));
            $("#Time").children()[6].data("");
            $("#Zone").hide();
            $("#Resume").css("visibility", "hidden");
            $("#F").hide();
            $("#PwrTime").hide();
            $("#Time").hide();
            $("#Time").css('visibility', 'visible');
            $("#Resume_row").hide();

            $("#SliderM").value = $("m" + (mInt - 1) + "_master").value;
            $("#PerM").value = $("m" + (mInt - 1) + "_master").value;
            $("#MasterBar").show();
            $("#CustomBtns").hide();
        }

        if (mode == "Moon") {
            $("#label").css("visibility", "visible");
            $("#label").text("Min Moon");
            $("#Peak").hide();
            $("#Cloud").css("visibility", "hidden");
        } else {
            $("#Peak").hide();
            $("#Cloud").css('visibility', 'visible');
            $("#label").css('visibility', 'visible');
            $("#label").text("Cloud Factor");
        }
        if (mInt == 0) {
            $("#CloudRow").hide();
            $("#Peak").hide();
            $("#Cloud").hide();
            $("#label").hide();
        } else {
            $("#CloudRow").show();
            $("#Peak").hide();
            $("#Cloud").show();
            $("#label").show();
        }

        if (mInt == 0) {
            for (var i = 0; i < 9; i++) {
                $("#M" + (i + 1) + "td").hide();
            }
        } else {
            for (var i = 0; i < 9; i++) {
                var Pindex = $("m" + (mInt - 1) + "_pindex").val();
                $("#M" + (i + 1)).val($("#p" + Pindex + "_cf" + i).val());
                $("#M" + (i + 1) + "td").hide();
            }
        }
        for (var i = 0; i < 9; i++) {
            var num;
            if (mInt == 0) {
                num = $("#nowch" + i).val();
            } else {
                var Pindex = $("#m" + (mInt - 1) + "_pindex").val();
                num = $("#p" + Pindex + "_ch" + i).val();
            }

            $("#N" + (i + 1)).val(num);
            $("#Slider" + (i + 1)).val(num);
            $("#Per" + (i + 1)).val(Math.round(1000 * num / 1023) / 10);
            updateRangeColor(i);
        }

        if (mInt > 0) {
            updateRangeMColor();
        }


        $("#Time0").text(formatTime($("#chr").val(), $("#cmin").val()));
        $("#Time0").css('color', "rgba(0,0,0,0)");

        for (var i = 0; i < (NumModes - 1); i++) {
            $("#Time" + (i + 1)).text(formatTime($("#m" + i + "_hr").val(), $("#m" + i + "_min").val()));
            $("#Time" + (i + 1)).css('color', "rgba(0,0,0,0)");
            $("#Time" + (i + 1)).css('font-size', "");
            $("#P_name" + (i + 1)).css('color', "rgba(0,0,0,0)");
            $("#P_name" + (i + 1)).css('font-size', "");
            $("#P_name" + (i + 1)).css('width', "50px");
        }

        $("#Time" + mInt).css('color', "#FF0000");
        $("#Time" + mInt).style.fontSize = "16px";
        $("#P_name" + mInt).css('color', "#FF0000");
        $("#P_name" + mInt).css('font-size', "16px");
        $("#P_name" + mInt).css('width', "");

        $("#C").val($("#MaxCloud").val());
        $("#Cloud").children()[0].data("Cloud " + $("#cCloud").val() + "%, Max:");
        $("#Fan").val($("#FanMode").val());

        $("#Acclimate1").val(Math.round(10 * parseFloat($("#AccPercent").val())) / 10);
        $("#Acclimate2").val(Math.round($("#AccDays").val()));
        if ($("#AccDays").val() > 0) {
            $("#Accl2").css('color', "#FF0000");
            $("#Accl1").css('color', "#FF0000");
            $("#Accl2").css('font-weight', "bold");
            $("#Accl1").css('font-weight', "bold");

        } else {
            $("#Accl2").style.color = "";
            $("#Accl1").style.color = "";
            $("#Accl2").css('font-weight', 'normal');
            $("#Accl1").css('font-weight', 'normal');
        }

        for (var i = 0; i < 6; i++) {
            $("#cbtn" + i).val($("#p" + $("#m" + i + "_cindex").val() + "_name").val());
        }

        updateGraph9();
    }

    formatTime = (hr, min) => {
        var time;
        var m;

        if (parseInt(hr) == 0) {
            time = "12:";
        } else if (parseInt(hr) < 13) {
            time = hr + ":";
        } else {
            time = (parseInt(hr) - 12) + ":";
        }
        if (parseInt(hr) < 12) {
            m = "a";
        } else {
            m = "p"
        }
        if (parseInt(min) < 10) {
            time = time + "0" + min + m;
        } else {
            time = time + min + m;
        }
        return (time);
    }

    updateRangeColor = (i) => {
        var val = ($("#Slider" + (i + 1)).val() - $("#Slider" + (i + 1)).prop('min') / ($("#Slider" + (i + 1)).prop('max') - $("#Slider" + (i + 1)).prop('min'));

        if (modes.indexOf(Mode) > 0) {
            val = val * parseInt($("#SliderM").val()) / 100;
        }

        $("#Slider" + (i + 1)).css("background-image", '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + val + ', #008CEF), '
            + 'color-stop(' + val + ', #B4B4B4)'
            + ')');
    }

    labelLv = () => {
        if ($("#N1").is("visible")) {
            for (var i = 0; i < 9; i++) {
                $("#Per" + (i + 1)).hide();
                $("#pLabel" + (i + 1)).hide();
                $("#N" + (i + 1)).show();
                $("#Label" + (i + 1)).show();
            }
        } else {
            for (var i = 0; i < 9; i++) {
                $("#Per" + (i + 1)).show();
                $("#pLabel" + (i + 1)).show();
                $("#N" + (i + 1)).hide();
                $("#Label" + (i + 1)).hide();
            }
        }
    }

    stopLoop = () => {
        looping2 = false;
    }

    updateRangeMColor = () => {
        var min = 0;
        var max = 100;
        var l = [];
        var index = 0;

        for (var i = 1; i < (LEDCH + 1); i++) {
            if (parseInt($("#N" + i).val()) > 0) {
                l[index] = parseInt($("#N" + i).val());
                index++;
            }
        }

        if (l.length == 0) {
            min = 0;
            max = 200;
            $("#SliderM").val(100);
            $("#PerM").val(100);
        } else {
            min = Math.round(100 * 2 / (Math.min(...l)));
            max = Math.round(100 * 1024 / (Math.max(...l)));
        }

        if (min > 100) {
            min = 100;
        }

        $("#SliderM").prop('min', min);
        $("#SliderM").prop('max', max);


        if (max < $("#PerM").val()) {
            $("#SliderM").val(max);
            $("#PerM").val(max);
        }


        var val = ($("#SliderM").val() - $("#SliderM").prop('min')) / ($("SliderM").prop('max') - $("SliderM").prop('min'));
        $("#SliderM").css('background-image',
            '-webkit-gradient(linear, left top, right top, '
            + 'color-stop(' + val + ', #008CEF), '
            + 'color-stop(' + val + ', #B4B4B4)'
            + ')');
    }

    masterSlider = () => {
        $("#PerM").val($("#SliderM").val());
        updateRangeMColor();

        for (var i = 0; i < LEDCH; i++) {
            updateRangeColor(i);
        }

        updateFields(mode);
    }

    masterPer = () => {
        $("#SliderM").val() = $("#PerM").val();
        updateRangeMColor();

        for (var i = 0; i < LEDCH; i++) {
            updateRangeColor(i);
        }

        updateFields(mode);
    }

    showValue = () => {
        looping2 = false;

        for (var i = 0; i < LEDCH; i++) {
            $("#N" + (i + 1)).val($("#Slider" + (i + 1)).val());
            updateRangeColor(i);
            $("#Per" + (i + 1)).val(Math.round(1000 * $("#Slider" + (i + 1)).val() / 1023) / 10);
        }
        updateFields(mode);
    }

    updateTime2(mode) {
        var list = $("#time2").val().split(":");
        $("#H").val(parseInt(list[0]));
        $("#M").val(parseInt(list[1]));
        updateTime(mode);
    }

    updateTime = (mode) => {
        var mInt = modes.indexOf(Mode);
        updateFields(mode);

        if (mInt == 0) {
            timeChanged = true;
            looping2 = false;
            $("#Time" + mInt).text(formatTime($("#cHr1").val(), $("#cMin1").val()));
        } else {
            $("#Time" + mInt).text(formatTime($("#Hr" + mInt).val(), $("Min" + mInt).value));
        }
    }

    updateFieldsP = (mode) => {
        for (var i = 0; i < LEDCH; i++) {
            if ($("#Per" + (i + 1)).val() > 100) {
                $("#Per" + (i + 1)).val(100);
            }
            if ($("#Per" + (i + 1)).val() < 0) {
                $("#Per" + (i + 1)).val(0);
            }
            $("#N" + (i + 1)).val(Math.round(parseFloat($("#Per" + (i + 1)).val()) / 100 * 1023));
        }
        updateFields(mode);
    }

    updateFieldsN = (mode) => {
        for (var i = 0; i < LEDCH; i++) {
            if ($("#N" + (i + 1)).val() > 1023) {
                $("#N" + (i + 1)).val() = 1023;
            }
            if ($("#N" + (i + 1)).val() < 0) {
                $("#N" + (i + 1)).val() = 0;
            }
            $("#Per" + (i + 1)).val(Math.round(1000 * $("#N" + (i + 1)).val() / 1023) / 10);
        }

        updateFields(mode);
    }

    BarGraph = (ctx) => {

        // Private properties and methods

        var that = this;
        var startArr;
        var endArr;
        var looping = false;

        // Loop method adjusts the height of bar and redraws if neccessary
        var loop = function () {

            var delta;
            var animationComplete = true;

            // Boolean to prevent update function from looping if already looping
            looping = true;

            // For each bar
            for (var i = 0; i < endArr.length; i += 1) {
                // Change the current bar height toward its target height
                delta = (endArr[i] - startArr[i]) / that.animationSteps;
                that.curArr[i] += delta;
                if (delta < 1) {
                    that.curArr[i] = endArr[i];
                }
                // If any change is made then flip a switch
                if (delta) {
                    animationComplete = false;
                }
            }
            // If no change was made to any bars then we are done
            if (animationComplete) {
                looping = false;
                draw(that.curArr);
            } else {
                // Draw and call loop again
                draw(that.curArr);
                setTimeout(loop, that.animationInterval / that.animationSteps);
            }
        };

        modGraph = () => {
            if (($("#NumOfModes").val() > -1) && ($("#NumOfModes").val() < 11)) {
                validModes = $("#NumOfModes").val();
                validModes++;
                hidGraph();
            }
            if (validModes > 10) {
                $("#myMenuBar").css('width', "20px");
            } else if (ValidModes > 9) {
                $("#myMenuBar").css('width', "40px";
            } else if (ValidModes > 8) {
                $("#myMenuBar").css('width', "60px";
            } else {
                $("#myMenuBar").css('width', "80px";
            }

            if ($("#NumOfModes").val() > 9) {
                $("#AddMode").hide();
            } else {
                $("#AddMode").show();
            }
        }

        // Draw method updates the canvas with the current display
        var draw = (arr) => {
            var numOfBars = arr.length;
            var barWidth;
            var barHeight;
            var SumBarHeight = 0;
            var border = that.border;
            var ratio;
            var maxBarHeight;
            var gradient;
            var largestValue;
            var graphAreaX = 0;
            var graphAreaY = 0;
            var graphAreaWidth = that.width;
            var graphAreaHeight = that.height;
            var i;

            // Update the dimensions of the canvas only if they have changed
            if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
                ctx.canvas.width = that.width;
                ctx.canvas.height = that.height;
            }

            // Draw the background color
            ctx.fillStyle = that.backgroundColor;
            ctx.fillRect(0, 0, that.width, that.height);

            // If x axis labels exist then make room
            if (that.xAxisLabelArr) {
                graphAreaHeight -= 15;
            }

            // Calculate dimensions of the bar
            barWidth = graphAreaWidth - that.margin * 2;
            if ($("#ModelType").val() === "Uno") {
                maxBarHeight = (graphAreaHeight - 20) / 5;
            } else {
                maxBarHeight = (graphAreaHeight - 20) / 6;
            }

            // Determine the largest value in the bar array
            var largestValue = 0;
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] > largestValue) {
                    largestValue = arr[i];
                }
            }

            // For each bar
            for (i = 0; i < arr.length; i += 1) {
                // Set the ratio of current bar compared to the maximum
                if (that.maxValue) {
                    ratio = arr[i] / that.maxValue;
                } else {
                    ratio = arr[i] / largestValue;
                }

                barHeight = ratio * maxBarHeight;


                // Turn on shadow
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;
                ctx.shadowColor = "#999";

                // Draw bar background
                ctx.fillStyle = "#333";
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(that.margin,
                    graphAreaHeight - barHeight - SumBarHeight,
                    barWidth,
                    barHeight);


                // Turn off shadow
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;


                // Create gradient
                if (ratio > 1) { ratio = 1; }
                gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
                gradient.addColorStop(1 - ratio, that.colors[i % that.colors.length]);
                //gradient.addColorStop(1, "#ffffff");
                ctx.fillStyle = gradient;


                // Fill rectangle with gradient
                ctx.fillRect(that.margin + border,
                    graphAreaHeight - barHeight - SumBarHeight,
                    barWidth - border * 2,
                    barHeight);


                /*
                // Write bar value
                ctx.fillStyle = "#333";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                // Use try / catch to stop IE 8 from going to error town
                try {
                  ctx.fillText(parseInt(arr[i],10),
                    i * that.width / numOfBars + (that.width / numOfBars) / 2,
                    graphAreaHeight - barHeight - 10);
                } catch (ex) {}
                */

                SumBarHeight = SumBarHeight + barHeight;

            }

            // Draw bar label if it exists
            if (that.xAxisLabelArr) {
                // Use try / catch to stop IE 8 from going to error town
                ctx.fillStyle = that.labelColor;
                ctx.font = that.font;
                ctx.textAlign = "center";

                try {
                    ctx.fillText(that.xAxisLabelArr,
                        that.width / 2,
                        that.height - 2);
                } catch (ex) { }
            }

            // Draw top label
            if (that.xAxisLabelArr) {
                // Use try / catch to stop IE 8 from going to error town
                ctx.fillStyle = "#333";
                ctx.font = that.font;
                ctx.textAlign = "center";

                if ($("#ModelType").val() === "Uno") {
                    try {
                        ctx.fillText(Math.round(36.26 * SumBarHeight / maxBarHeight) + "W",
                            that.width / 2,
                            that.height - SumBarHeight - 20);
                    } catch (ex) { }

                } else {

                    try {
                        ctx.fillText(Math.round(36 * SumBarHeight / maxBarHeight) + "W",
                            that.width / 2,
                            that.height - SumBarHeight - 20);
                    } catch (ex) { }
                }

            }

        }

        // Public properties and methods

        this.width = 300;
        this.height = 150;
        this.maxValue;
        this.margin = 5;
        this.colors = ["purple", "red", "green", "yellow"];
        this.curArr = [];
        this.backgroundColor = "#fff";
        this.xAxisLabelArr = [];
        this.yAxisLabelArr = [];
        this.animationInterval = 100;
        this.animationSteps = 10;
        this.labelColor = "#333";
        this.border = 1;
        this.font = "bold 12px sans-serif";


        // Update method sets the end bar array and starts the animation
        this.update = function (newArr) {

            // If length of target and current array is different
            if (that.curArr.length !== newArr.length) {
                that.curArr = newArr;
                draw(newArr);
            } else {
                // Set the starting array to the current array
                startArr = that.curArr;
                // Set the target array to the new array
                endArr = newArr;
                // Animate from the start array to the end array
                if (!looping) {
                    loop();
                }
            }
        };
    }

    updateFields = (mode) => {
        var mInt = modes.indexOf(Mode);
        looping2 = false;
        var Pindex;

        if (mInt > 0) {
            Pindex = $("#m" + (mInt - 1) + "_pindex").val();
        }

        $("NumOfModes").val(ValidModes - 1);

        for (var i = 0; i < LEDCH; i++) {
            if (parseInt($("#N" + (i + 1)).val()) > 1023) {
                $("#N" + (i + 1)).val(1023);
            }
            if (parseInt($("N" + (i + 1)).val()) < 0) {
                $("N" + (i + 1)).val(0);
            }

            if (mInt == 0) {
                $("#nowch" + i).val($("#N" + (i + 1)).val());
            } else {
                $("#p" + Pindex + "_ch" + i).val($("#N" + (i + 1)).val());
                $("p" + Pindex + "_cf" + i).val($("#M" + (i + 1)).val());
            }

            $("#Slider" + (i + 1)).val($("#N" + (i + 1)).val());
        }

        if (mInt > 0) {
            $("#m" + (mInt - 1) + "_hr").val($("#H").val());
            $("#m" + (mInt - 1) + "_min").val($("#M").val());
            $("#m" + (mInt - 1) + "_rate").val($("#Rate").val());
            $("#m" + (mInt - 1) + "_master").val($("#SliderM").val());
        } else {
            $("#chr").val($("#H").val());
            $("#cmin").val($("#M").val());
            $("#shr").val($("#pwrH").val());
            $("#smin").val($("#pwrM").val());
        }

        $("#MaxCloud").val($("#C").val());
        $("#TZ").val($("#Zone").val());
        $("#FanMode").val($("#Fan").val());
        $("#AccPercent").val($("#Acclimate1").val());
        $("#AccDays").val($("#Acclimate2").val());

        if ($("#AccDays").val() > 0) {
            $("#AccDays").css('color', "#FF0000");
            $("#AccPercent").css('color', "#FF0000");
            $("#AccDays").css('font-weight', "bold");
            $("#AccPercent").css('font-weight', "bold");

        } else {
            $("#AccDays").css('color', 'rgba(0,0,0,0)');
            $("#AccPercent").css('color', 'rgba(0,0,0,0)');
            $("#AccDays").css('font-weight', "normal");
            $("#AccPercent").css('font-weight', "normal");
        }

        $("#graphDiv" + (mInt + 1)).css("background-color", "#FFFF00");
        //$("Time"+(mInt)).style.backgroundColor="#FFFF00";
        //graph[mInt].backgroundColor = "#FFFF00";
        if (mInt == 0) {
            nowChanged = true;
        }

        updateGraph9();

        for (var i = 0; i < LEDCH; i++) {
            updateRangeColor(i);
        }

        updateRangeMColor();

        if (modes.indexOf(Mode) > 0) {
            var p = $("#Settings" + (modes.indexOf(Mode) - 1)).find(":selected");
            for (var j = 0; j < (NumModes - 1); j++) {
                document.getElementById("Settings" + j).options[p].textContent = document.getElementById('#Settings' + j).options[p].val() + "(" + profileWatts(p) + "W)";
            }
        }
    }

    profileWatts = (P) => {
        var watt = 0;
        watt += 3 * 8 * parseInt($("p" + P + "_ch" + 0).value) / 1023;
        watt += 3 * 8 * parseInt($("p" + P + "_ch" + 1).value) / 1023;
        watt += 3 * 12 * parseInt($("p" + P + "_ch" + 2).value) / 1023;
        watt += 3 * 12 * parseInt($("p" + P + "_ch" + 3).value) / 1023;
        watt += 3 * 12 * parseInt($("p" + P + "_ch" + 4).value) / 1023;
        watt += 3 * 4 * parseInt($("p" + P + "_ch" + 5).value) / 1023;
        watt += 3 * 4 * parseInt($("p" + P + "_ch" + 6).value) / 1023;
        watt += 3 * 4 * parseInt($("p" + P + "_ch" + 7).value) / 1023;
        watt += 3 * 8 * parseInt($("p" + P + "_ch" + 8).value) / 1023;

        watt = Math.round(watt * 10) / 10;

        return watt;
    }

    addFields = (StrID, list, container, display, width, edit) => {
        for (var i = 1; i < (list.length + 1); i++) {
            var input = document.createElement("input");
            input.value = list[i - 1];

            if (edit == false) {
                input.readOnly = true;
            }

            if (display == false) {
                input.style.display = "none";
            }
            input.style.fontSize = "8pt";
            if (width) {
                input.style.width = width;
            }
            input.name = StrID + i;
            input.id = StrID + i;

            container.append(input);
        }
    }

    addFieldsV3 = (ID, V, ctn) => {
        var input = document.createElement("input");
        input.id = ID;
        input.name = ID;
        input.value = V;
        input.style.display = "none";
        ctn.append(input);
    }

    genFieldsV3 = (list) => {
        var container = $("#container");
        container.empty();

        for (var i = 0; i < list.length; i++) {
            var list2 = list[i].split(/[=]/);

            if (list2.length == 2) {
                addFieldsV3(list2[0], list2[1], container);
            }
        }

        ValidModes = parseInt($("#VM").val()) + 1;

        for (var j = 1; j < NumModes; j++) {
            modes[j] = $("#m" + (j - 1) + "_name").val();
        }

        $("#timezone").value = $("#TZ").value;
        $("#POT").value = addZero(parseInt($("#shr").value)) + ":" + addZero(parseInt($("#smin").value));
        $("#DLS").checked = (parseInt($("#ADLS").value) == 1);
        $("SelectDLS").value = $("SelectedDLS").value;

        updateMode(modes.indexOf(Mode));
    }

    genFields_P = (list) => {
        var container = $("#containerp");
        container.empty();

        for (var i = 0; i < list.length; i++) {
            var list2 = list[i].split(/[=]/);
            if (list2.length == 2) {
                addFieldsV3(list2[0], list2[1], container);
            }
        }
    }

    genFieldsNow = (list) => {
        var container = $("#containernow");
        var containerC = $("#containerC");
        container.empty();
        containerC.empty();

        for (var i = 0; i < list.length; i++) {
            var list2 = list[i].split(/[=]/);
            if (list2.length == 2) {
                if (list2[0] == "cMode") {
                    AddFields_v3(list2[0], list2[1], containerC);
                } else {
                    AddFields_v3(list2[0], list2[1], container);
                }

            }
        }
    }

    GenFields_9(list) {
        var container = $("#container");
        container.empty();

        var num = [];
        var index = -1;
        var num_ind;
        var name = [];
        var hr = [];
        var min = [];
        var rate = [];
        var cf = [];
        var mm = [];
        var cm = [];
        var isValid = [];


        validModes = list[0];
        validModes++;

        for (var j = 0; j < 9; j++) {
            num[j] = list[j + 1];
            num_ind = j;
            index = j + 1;
        }

        for (var j = 0; j < (numModes - 1); j++) {
            for (var i = 0; i < 9; i++) {
                num_ind++;
                num[num_ind] = list[10 + i + (12 * j)];
            }
            hr[j] = list[19 + j * 12];
            min[j] = list[20 + j * 12];
            rate[j] = list[21 + j * 12];
            index = 21 + j * 12;
        }


        addFields("Num", num, container, false);
        addFields("Hr", hr, container, false);
        addFields("Min", min, container, false);
        addFields("Delay", rate, container, false);
        index++;
        addFields("sHr", list.slice(index, index + 1), container, false);
        POT_hr = list.slice(index, index + 1)[0];
        index++;
        AddFields("sMin", list.slice(index, index + 1), container, false);
        POT_min = list.slice(index, index + 1)[0];
        $("#POT").val(addZero(POT_hr) + ":" + addZero(POT_min));
        index++;
        addFields("TZ", list.slice(index, index + 1), container, false);
        $("timezone").value = list.slice(index, index + 1)[0];
        index++;
        addFields("Cloud", [list.slice(index, index + 1), list.slice(index + 26, index + 27)], container, false);  //cloud max, c cloud
        index++;
        addFields("CF", list.slice(index, index + 9), container, false);		//cloud factor
        index = index + 9;
        addFields("Peak", list.slice(index, index + 3), container, false);
        index = index + 3;
        addFields("MF", list.slice(index, index + 9), container, false);		//moon factor
        index = index + 9;
        addFields("Mode", list.slice(index, index + 1), container, false);
        index++;
        addFields("cHr", list.slice(index, index + 1), container, false);
        index++;
        addFields("cMin", list.slice(index, index + 1), container, false);
        index++;
        addFields("cMoon", list.slice(index, index + 1), container, false);
        index++;
        index++;
        addFields("Ver", list.slice(index, index + 1), container, false);
        index++;
        addFields("FAN", list.slice(index, index + 1), container, false);

        for (var j = 1; j < numModes; j++) {
            modes[j] = list[index + j];
        }
        index = index + numModes;

        addFields("Acc", list.slice(index, index + 2), container, false);
        index++;
        index++;

        $("#DLS").prop("checked", (list.slice(index, index + 1)[0] == "1"));

        updateMode(modes.indexOf(mode));
    }

    setupNav = () => {
        looping2 = false;
        $("#AdvSetup").hide();
        $("#myForm").hide();
        $("#myFormSetup").show();
        $("#myFormLEDs").show();
        closeNav();
        //fetch('http://'+curURL+'/reefileds.txt','GET', null);
    }

    aquariumNav = () => {
        looping2 = false;
        $("#AdvSetup").hide();
        $("#myForm").show();
        $("#myFormSetup").hide();
        $("#myFormLEDs").hide();
        closeNav();

        looping2 = true;
        lcount = 0;
        SameData[0] = false;
        SameData[1] = false;
        SameData[2] = false;
        refreshValues();
    }

    displayOnOff = () => {
        for (var i = 0; i < urlList.length; i++) {
            if (i === 0) {
                fetch(_curUrl + '/DisplayOnOff', 'GET');
            } else {
                fetch('http://' + urlList[i] + '/DisplayOnOff', 'GET');
            }
        }

        closeNav();
    }

    AdvanceSetup = (id, s = 'none') => {
        looping2 = false;
        $("#AdvSetup").show();
        $("#myForm").hide();
        $("#myFormSetup").hide();
        $("#myFormLEDs").hide();

        if (id == infoFrame) {
            id.prop('src', curURL + '/info');
        }
        if (id === fWFrame) {
            id.prop('src', curURL + '/firmware');

            for (var i = 1; i < _urlList.length; i++) {
                fetch('http://' + urlList[i] + '/firmware', 'GET');
            }
        }
        if (id == resetDefaultFrame) {
            if (s === 'ReeFi_SPS') {
                id.prop('src', curURL + '/reset_defaultReeFiSPS';
            }
            if (s === 'SPS') {
                id.prop('src', curURL + '/reset_default';
            }
            if (s === 'LPS') {
                id.prop('src', curURL + '/reset_defaultLPS';
            }
            if (s === 'User') {
                id.prop('src', curURL + '/reset_defaultUser';
            }
        }

        if ((id === Demo) && (sFX.prop('src') === curURL + '/')) {
            sFX.prop('src', "thunder_sound_FX.mp3");
        }

        // hide all
        var iframes = $("iframe");

        for (var i = 0; i < iframes.length; i++) {
            iframes[i].hide();
        }
        $("#PreFW").hide();
        $("#PreDefault").hide();
        $("#DateTime").hide();
        $("#Demo").hide();
        $("#InfoHeader").hide();
        $("#logo").hide();
        $("#Admin").hide();


        // show active
        id.show();

        if (id === preFW) {
            let iframe = $("#FirmwareFrame")[0];
            let iframewindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;

            $("#FirmwareFrame").attr('src', 'http://www.reefi-lab.com/reefilab/LED/gen2/firmware/ver.html');
            iframewindow.location.href = $("#FirmwareFrame").prop('src') + "?n=" + fwCnt;
            fwCnt++;
            $("#FirmwareFrame").show();
            $("#FirmwareFrame").css('height', '600px');
            $("#FirmwareFrame").css('width', '600px');
            $("#FirmwareStatus").show();
            $("#FirmwareStatusText").text("Current Version: " + $("#Ver").val());
        } else {
            $("#FirmwareFrame").hide();
            $("#FirmwareStatus").hide();
        }


        if ((id == dateTime) || (id == demo) || (id == preFW) || (id == admin)) {
            $("#InfoHeader").show();
            $("#logo").show();
            dLSFieldUpdate();
        }

        if (id == preDefault) {
            $("#logo").show();
        }

        if ((id != PreFW) && (id != PreDefault) && (id != DateTime) && (id != Demo)) {
            resizeIframe(id);
        }

        closeNav();
    }

    resizeIframe = (id) => {
        //document.getElementById(id).style.height = document.getElementById(id).contentWindow.document.body.scrollHeight + 'px';
        //document.getElementById(id).style.width = document.getElementById(id).contentWindow.document.body.scrollWidth + 'px';
        let iframe = id[0];
        let iframewindow = iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument.defaultView;

        if ((id == fWFrame) || (id == infoFrame)) {
            id.css("height", '1000px');
            id.css("width", '500px');
        } else {
            id.css("height", iframewindow.document.body.scrollHeight + 'px');
            id.css("width", iframewindow.document.body.scrollWidth + 'px');

            if (iframewindow.document.body.scrollHeight < 900) {
                id.css("height", '900px');
            }
        }
    }

    newLEDs = (strlist) => {
        if (strlist) {
            var list = strlist.split(",");
            genLEDs(list);
        }
    }

    getLEDs = () => {
        $("statusSetup").text("Status: Scanning for all ReeFi LEDs...");
        fetch(curURL + '/reefileds.txt', 'GET', newLEDs);
    }

    genLEDs = (list) => {
        var container = $("#LEDS");
        var container2 = $("#AQNUM");
        container.empty();
        container2.empty();
        addFields("HostName", list.sort(), container, true, "180px", false);
        addFields("AqurNum", genNum(list.length), container2, true, "80px");
        //set blink
        setBlink(container);
        $("statusSetup").text("Status: Scan Completed.");
    }

    setBlink = (container) => {
        for (var i = 0; i < container.children().length; i++) {
            container.children()[i].on("click", () => {
                var url = container.children()[i].val().split(" ");
                return sendLED(url[1], "NoUpdate=Save&BLINK1=2");
            });
        }
    }

    genNum = (s) => {
        var assign = [];
        var strlist = "";

        for (var i = 0; i < s; i++) {
            assign[i] = i + 1;
        }

        return assign;
    }

    groupLEDSave = () => {
        $("#statusSetup").text("Status: Saving Group LED info...");
        groupLED();
        sendGLED(curURL, "NoUpdate=Save" + getFormArgs($("#myFormLEDs")));
        $("#statusSetup").text("Status: Saved Group LED info.");
        //GLED_init();
        setTimeout(gLEDInit, 1500);
    }

    groupLED = () => {
        var aquaNums = [];
        var ledLists = [];
        var AQNUM = $("#AQNUM");
        var LEDS = $("#LEDS");
        var newAq = true;

        for (var i = 0; i < AQNUM.children().length; i++) {
            newAq = true;

            for (var j = 0; j < aquaNums.length; j++) {
                if (aquaNums[j] === AQNUM.children()[i].val()) {
                    newAq = false;
                    break;
                }
            }
            if (newAq) {
                aquaNums.push(AQNUM.children()[i].val());
            }
        }
        for (var i = 0; i < aquaNums.length; i++) {
            ledLists[i] = [];
            ledLists[i].push(aquaNums[i]);

            for (var j = 0; j < AQNUM.children().length; j++) {
                if (aquaNums[i] == AQNUM.children()[j].val()) {
                    ledLists[i].push(LEDS.children()[j].val());
                }
            }
        }
        var container = $("#GroupLEDCtn");
        container.empty();

        var ledstr = [];

        for (var i = 0; i < ledLists.length; i++) {
            ledstr[i] = ledLists[i][0];

            for (var j = 1; j < ledLists[i].length; j++) {
                ledstr[i] = ledstr[i] + "," + ledLists[i][j];
            }
        }
        addFields("GLEDS", ledstr.sort(), container, false);
        addMenu();
        $("statusSetup").text("Status: Done");
    }

    getHostIP = () => {
        var ip = $("#ReeFiAddIp").val();
        fetch('http://' + ip + '/GetHostIP', 'GET', manualLoadGLED);
        $("#statusSetup").text("Status: Searching....");
    }

    manualLoadGLED = (strlist) => {
        var list = [];

        if (strlist != null) {
            list[0] = strlist;

            var container = $("#LEDS");
            var container2 = $("#AQNUM");

            addFields("HostName", list.sort(), container, true, "180px", false);
            addFields("AqurNum", genNum(list.length), container2, true, "80px");
            setBlink(container);
            $("#statusSetup").text("Status: Completed.");
        } else {
            $("#statusSetup").text("Status: Network error, timed out.");
        }
    }

    new_GLEDs = (strlist) => {
        if (strlist) {
            var list = strlist.split(/[,\n]/);
            if (list[0] != "<html>") {
                loadGLED(list);
            }
        }
    }

    loadGLED = (list) => {
        var tank;
        var tanks = [];
        var leds = [];
        var ctn1 = $("#AQNUM");
        var ctn2 = $("#LEDS");
        ctn1.empty();
        ctn2.empty();

        for (var i = 0; i < list.length; i++) {
            if (list[i].length < 5) {
                tank = list[i];
            } else {
                tanks.push(tank);
                leds.push(list[i]);
            }
        }

        addFields("HostName", leds, ctn2, true, "180px", false);
        addFields("AqurNum", tanks, ctn1, true, "80px");
        setBlink(ctn2);
        groupLED();
    }

    findParentChildNodeIndex = (node) => {
        var parentNodeIndex = null;
        var parentNode;
        parentNode = node.parent();

        for (var i = 0; i < parentNode.children().length; i++) {
            if (parentNode.children()[i] === node) {
                parentNodeIndex = i;
                return parentNodeIndex;
            }
        }

        return parentNodeIndex;
    }

    appendNode = (ctn, name, link, size, pad) => {
        var node = document.createElement("a");
        var textnode = document.createTextNode(name);
        var parentNodeIndex = 0;
        node.style.fontSize = size;
        node.style.padding = pad;
        node.appendChild(textnode);
        if (link == "#") {
            node.addEventListener("click", async function () {
                if (lastMyMenu != null) {
                    lastMyMenu.style.color = "";
                }

                this.style.color = "#FF0000";
                lastMyMenu = this;
                //GrpLedEvent(name.slice(-1));
                grpLedEvent(name.split(" ")[1]);
                $("#InfoHeader").text(name);

                //check matching settings
                //find node position
                uRL_Settings = [];
                uRL_Profiles = [];
                looping2 = false;

                parentNodeIndex = findParentChildNodeIndex(lastMyMenu) + 1;

                // init 0 first
                lastMyMenu.parent().children()[parentNodeIndex].css("color", "rgba(0,0,0,0)");

                fetch(_curUrl + '/profiles.cfg', 'GET', saveProfiles, 0, lastMyMenu.parent().children()[parentNodeIndex]);
                while (uRL_Profiles[0] == null) {
                    // wait for data
                    await sleep(50);
                }

                fetch(_curURL + '/now.cfg', 'GET', saveNows, 0, lastMyMenu.parent().children()[parentNodeIndex]);
                while (uRL_Nows[0] == null) {
                    // wait for data
                    await sleep(50);
                }

                fetch(_curURL + '/settings3.cfg', 'GET', saveSettings, 0, lastMyMenu.parent().children()[parentNodeIndex]);
                while (uRL_Settings[0] == null) {
                    // wait for data
                    await sleep(50);
                }

                for (var i = 1; i < urlList.length; i++) {
                    lastMyMenu.parent().children()[i + parentNodeIndex].css("color", "rgba(0,0,0,0)");
                    fetch('http://' + urlList[i] + '/settings3.cfg', 'GET', SaveSettings, i, lastMyMenu.parent().children()[i + parentNodeIndex]);
                    fetch('http://' + urlList[i] + '/profiles.cfg', 'GET', SaveProfiles, i, lastMyMenu.parent().children()[i + parentNodeIndex]);
                    //fetch('http://'+urlList[i]+'/now.cfg','GET',SaveNows, i, lastMyMenu.parentNode.childNodes[i+parentNodeIndex]);
                }

                $("#AdvSetup").hide();
                $("#myForm").show();
                $("#myFormSetup").hide();
                $("#myFormLEDs").hide();
                closeNav();

                //setTimeout(aquariumNav, 1500);
                aquariumNav();

            });
        } else {
            node.addEventListener("click", function () {
                if (lastMyMenu != null) {
                    lastMyMenu.css("color", "rgba(0,0,0,0)");
                }

                this.style.color = "#FF0000";
                lastMyMenu = this;
                $("header").text(name);
                $("InfoHeader").text(name);
                //urlList = [];
                //curURL = link.match(/[0-9.]+/);
                urlList.push(_curURL);
                aquariumNav();
            });
        }
        ctn.append(node);
    }

    $(document).ready(() => {
        startScripts();
    })
});