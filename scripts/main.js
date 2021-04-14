import { ReeFi } from "/scripts/reeFi.js";
const _reeFi = new ReeFi();

navigator.serviceWorker && navigator.serviceWorker.register('sw.js').then(function (registration) {
	console.log('Excellent, registered with scope: ', registration.scope);
});


var debug = true;

var modes = ["Now", "Sunrise", "MidDay", "Sunset", "Night", "Moon", "Mode6", "Mode7", "Mode8", "Mode9", "Mode10"];
var ModelType = "Uno";
var Mode = "Now";
var PreMode = Mode;
var ctx = [];
var graph = [];
var looping2 = true;
var SameData = [false, false, false];
var lcount = 0;
var prevData = [];
var NowChanged = false;
var TimeChanged = false;
var FirstCall = true;
var urlList = window.location.href.match(/[0-9.]+/);
var curURL = urlList[0];
var $ = function (id) { return document.getElementById(id); };
var NumModes = 11;
var ValidModes = 11;
var DeleteMode = 0;
var touchtime = 0;
var lastMyMenu;
var NowEditable = true;
var ProfilesMax = 20;
var LEDS = [];
var LEDCH = 9;

var FirmwareText;
var fwCnt = 0;

function LoadUserFiletoStr() {
	var file = $("myFile").files[0];
	var files = $("myFile").files;
	if (!files.length) {
		alert('Please select a file!');
		return;
	}

	var reader = new FileReader();
	reader.onload = function (event) {
		//console.log('File content:', event.target.result);

		for (var i = 0; i < urlList.length; i++) {
			sendLED(urlList[i], event.target.result);
		}

		$("AdvSetup").style.display = "none";
		$("myForm").style.display = "";
		$("myFormSetup").style.display = "none";
		$("myFormLEDs").style.display = "none";

		looping2 = true;
		lcount = 0;
		SameData[0] = false;
		SameData[1] = false;
		SameData[2] = false;
		setTimeout(refresh_values, 2000);
	};
	reader.readAsText(file);
}

function download(filename, text) {
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

function MyDownload() {
	if (debug) {

	} else {
		fetch('http://' + curURL + '/settings_all.cfg', 'GET', DownloadSettings);
	}
}

function DownloadSettings(str) {
	download($("SaveFileName").value, str);
}

window.onload = function () {
	document.getElementById("status").innerHTML = "Status: Retrieving script library...";
	startScript();
}


function addZero(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function get_DateTime() {
	var d = new Date();
	var day = addZero(d.getDate());
	var month = addZero(d.getMonth() + 1);
	var year = d.getFullYear();
	var h = addZero(d.getHours());
	var m = addZero(d.getMinutes());

	$("date").value = year + "-" + month + "-" + day;
	$("time").value = h + ":" + m;
}

function save_DateTime() {
	var str = "Date=" + $("date").value + "&Time=" + $("time").value + "&TimeZone=" + $("timezone").value + "&DLS=" + $("DLS").checked + "&POT=" + $("POT").value + "&SelectDLS=" + $("SelectDLS").value;
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/SaveDateTime?' + str, 'GET');
	}

	function SwitchDisplay() {
		$("AdvSetup").style.display = "none";
		$("myForm").style.display = "";
		$("myFormSetup").style.display = "none";
		$("myFormLEDs").style.display = "none";
	}

	setTimeout(SwitchDisplay, 800);
	setTimeout(cancel_refresh, 1000);
}

function DLS_fieldupdate() {
	if ($("DLS").checked) {
		$("SelectDLSField").style.display = "";
	} else {
		$("SelectDLSField").style.display = "none";
	}
}

function set_LightingMode() {
	for (var i = 0; i < urlList.length; i++) {
		if (i == 0) {
			fetch('http://' + urlList[i] + '/LightingModeDemo', 'GET', SFX_ms);
		} else {
			fetch('http://' + urlList[i] + '/LightingModeDemo', 'GET');
		}
	}
}

function clear_wifi() {
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/wifi_clear', 'GET');
	}
}

function clear_Group() {
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/group_clear', 'GET');
	}
	//reload
	location.reload();
}

function restart() {
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/restart', 'GET');
	}
}

function cool() {
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/cooldown', 'GET');
	}
}


function startScript() {
	//$("status").innerHTML = "Status: Retrieving menu...";
	//setTimeout(GLED_init, 700);
	_reeFi.graphHelper.label_lv();
	$("status").innerHTML = "Status: Retrieving graphic library...";
	//setTimeout(graph_init, 100);
	_reeFi.graphHelper.genGraph();
	_reeFi.htmlHelper.genSelection();
	_reeFi.htmlHelper.genCustomBtn();
	_reeFi.graphHelper.graphInit();
	_reeFi.scriptHelper.gled_init();
	_reeFi.htmlHelper.loadHTMLfame();
	_reeFi.htmlHelper.loadImgSrc();
}

function createCanvas(divName) {

	var div = $(divName);
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	if (typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	var ctx = canvas.getContext("2d");
	return ctx;
}


function ChConvert_9(l) {
	var list = [];
	for (var i = 0; i < l.length; i++) {
		list[i] = parseInt(l[i]);
	}
	var LED_Array = [];

	if ($("ModelType").value == "Uno") {

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




function UpdateGraph_9() {
	function setgraphparms_9(i) {
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
	var L = [];
	for (var j = 0; j < NumModes; j++) {
		setgraphparms_9(j);
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
				var Pindex = $("m" + (j - 1) + "_pindex").value;
				L[i] = parseInt($("p" + Pindex + "_ch" + i).value) * parseInt($("m" + (j - 1) + "_master").value) / 100;
				//L[i]=parseInt($("p"+Pindex+"_ch"+i).value);
			}
		}
		graph[j].update(ChConvert_9(L));
	}
	$("status").innerHTML = "Status: Ver" + $("Ver").value;
	//var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	//$("status").innerHTML = "width = " + width;
}


function fetchCROS(url, method, callback) {
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
	xhr.withCredentials = true;
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.send({ 'request': "authentication token" });
}

function fetch(url, method, callback) {
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

function SFX_play() {
	SFX.pause();
	SFX.currentTime = 0;
	SFX.play();
}

function SFX_ms(strlist) {
	if (strlist) {
		var d = strlist;
		setTimeout(SFX_play, d);
	}

}

function new_values_p(strlist) {
	if (strlist) {

		var list = strlist.split(/[,\n]/);
		if (list[0] != "<html>") {
			if (strlist == prevData[0]) {
				SameData[0] = true;
			}

			$("status").innerHTML = "Status: Done";
			prevData[0] = strlist;

			GenFields_p(list);
		}
	}
}

function new_values_now(strlist) {
	if (strlist) {

		var list = strlist.split(/[,\n]/);
		if (list[0] != "<html>") {
			if (strlist == prevData[2]) {
				SameData[2] = true;
			}

			$("status").innerHTML = "Status: Done";

			prevData[2] = strlist;

			if (SameData[0] && SameData[1] && SameData[2]) {
				looping2 = false;
				$("status").innerHTML = "Status: Ver" + $("Ver").value;
			}

			if (looping2) {
				GenFields_now(list);
			}
		}
	}
}


function new_values_9(strlist) {
	if (strlist) {

		var list = strlist.split(/[,\n]/);
		if (list[0] != "<html>") {
			if (strlist == prevData[1]) {
				SameData[1] = true;
			}

			$("status").innerHTML = "Status: Done";
			NowChanged = false;
			TimeChanged = false;
			for (var i = 0; i < NumModes; i++) {
				$("graphDiv" + (i + 1)).style.backgroundColor = "";
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

function resume_refresh() {
	$("status").innerHTML = "Status: Retrieving settings...";
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/resume.txt', 'GET');
	}
	looping2 = true;
	lcount = 0;
	SameData[2] = false;
	setTimeout(refresh_now, 2000)
	$("graphDiv1").style.backgroundColor = ""
}

var maintProfile = {
	p0_name: 'Maintenance',
	p0_ch0: 0,
	p0_cf0: 0,
	p0_ch1: 0,
	p0_cf1: 0,
	p0_ch2: 0,
	p0_cf2: 0,
	p0_ch3: 200,
	p0_cf3: 0,
	p0_ch4: 200,
	p0_cf4: 0,
	p0_ch5: 50,
	p0_cf5: 0,
	p0_ch6: 50,
	p0_cf6: 0,
	p0_ch7: 150,
	p0_cf7: 0,
	p0_ch8: 200,
	p0_cf8: 0
}

var nowProfile = {
	nowch0: 588,
	nowch1: 588,
	nowch2: 588,
	nowch3: 588,
	nowch4: 588,
	nowch5: 89,
	nowch6: 89,
	nowch7: 152,
	nowch8: 245,
	cMoon: 13,
	chr: 16,
	cmin: 11,
	cCloud: 0,
	cMode: "After - 0 % Cloud",
	Ver: 3.00
}


function refresh_values() {
	if ((looping2 == true) && (lcount < 30)) {
		$("status").innerHTML = "Status: Retrieving settings...";
		if (debug) {
			new_values_p("p0_name=Maintenance,p0_ch0=0,p0_cf0=0,p0_ch1=0,p0_cf1=0,p0_ch2=0,p0_cf2=0,p0_ch3=200,p0_cf3=0,p0_ch4=200,p0_cf4=0,p0_ch5=50,p0_cf5=0,p0_ch6=50,p0_cf6=0,p0_ch7=150,p0_cf7=0,p0_ch8=200,p0_cf8=0,p1_name=Photo SPS,p1_ch0=800,p1_cf0=0,p1_ch1=1023,p1_cf1=0,p1_ch2=1023,p1_cf2=0,p1_ch3=1023,p1_cf3=0,p1_ch4=1023,p1_cf4=0,p1_ch5=100,p1_cf5=0,p1_ch6=100,p1_cf6=0,p1_ch7=200,p1_cf7=0,p1_ch8=300,p1_cf8=0,p2_name=Photo LPS,p2_ch0=537,p2_cf0=0,p2_ch1=691,p2_cf1=0,p2_ch2=745,p2_cf2=0,p2_ch3=900,p2_cf3=0,p2_ch4=745,p2_cf4=0,p2_ch5=25,p2_cf5=0,p2_ch6=25,p2_cf6=0,p2_ch7=25,p2_cf7=0,p2_ch8=50,p2_cf8=0,p3_name=Blue+,p3_ch0=650,p3_cf0=0,p3_ch1=800,p3_cf1=0,p3_ch2=800,p3_cf2=0,p3_ch3=1023,p3_cf3=0,p3_ch4=650,p3_cf4=0,p3_ch5=30,p3_cf5=0,p3_ch6=30,p3_cf6=0,p3_ch7=30,p3_cf7=0,p3_ch8=30,p3_cf8=0,p4_name=RB+,p4_ch0=100,p4_cf0=0,p4_ch1=250,p4_cf1=0,p4_ch2=250,p4_cf2=0,p4_ch3=450,p4_cf3=0,p4_ch4=100,p4_cf4=0,p4_ch5=0,p4_cf5=0,p4_ch6=0,p4_cf6=0,p4_ch7=0,p4_cf7=0,p4_ch8=0,p4_cf8=0,p5_name=UV+,p5_ch0=700,p5_cf0=0,p5_ch1=900,p5_cf1=0,p5_ch2=0,p5_cf2=0,p5_ch3=0,p5_cf3=0,p5_ch4=0,p5_cf4=0,p5_ch5=0,p5_cf5=0,p5_ch6=0,p5_cf6=0,p5_ch7=0,p5_cf7=0,p5_ch8=0,p5_cf8=0,p6_name=Sunrise_v2,p6_ch0=0,p6_cf0=0,p6_ch1=0,p6_cf1=0,p6_ch2=0,p6_cf2=0,p6_ch3=100,p6_cf3=0,p6_ch4=0,p6_cf4=0,p6_ch5=0,p6_cf5=0,p6_ch6=15,p6_cf6=0,p6_ch7=20,p6_cf7=0,p6_ch8=0,p6_cf8=0,p7_name=Early_v2,p7_ch0=0,p7_cf0=0,p7_ch1=100,p7_cf1=0,p7_ch2=100,p7_cf2=0,p7_ch3=450,p7_cf3=0,p7_ch4=0,p7_cf4=0,p7_ch5=0,p7_cf5=0,p7_ch6=0,p7_cf6=0,p7_ch7=0,p7_cf7=0,p7_ch8=0,p7_cf8=0,p8_name=Morning_v2,p8_ch0=650,p8_cf0=0,p8_ch1=800,p8_cf1=0,p8_ch2=800,p8_cf2=0,p8_ch3=1023,p8_cf3=0,p8_ch4=650,p8_cf4=0,p8_ch5=30,p8_cf5=0,p8_ch6=30,p8_cf6=0,p8_ch7=30,p8_cf7=0,p8_ch8=30,p8_cf8=0,p9_name=Day+,p9_ch0=725,p9_cf0=0,p9_ch1=1023,p9_cf1=0,p9_ch2=1023,p9_cf2=0,p9_ch3=1023,p9_cf3=0,p9_ch4=1023,p9_cf4=0,p9_ch5=70,p9_cf5=0,p9_ch6=70,p9_cf6=0,p9_ch7=70,p9_cf7=0,p9_ch8=150,p9_cf8=0,p10_name=Peak,p10_ch0=800,p10_cf0=1,p10_ch1=1023,p10_cf1=1,p10_ch2=1023,p10_cf2=1,p10_ch3=1023,p10_cf3=1,p10_ch4=1023,p10_cf4=1,p10_ch5=100,p10_cf5=5,p10_ch6=100,p10_cf6=5,p10_ch7=200,p10_cf7=5,p10_ch8=300,p10_cf8=5,p11_name=After_v2,p11_ch0=775,p11_cf0=0,p11_ch1=1023,p11_cf1=0,p11_ch2=1023,p11_cf2=0,p11_ch3=1023,p11_cf3=0,p11_ch4=1023,p11_cf4=0,p11_ch5=70,p11_cf5=0,p11_ch6=70,p11_cf6=0,p11_ch7=70,p11_cf7=0,p11_ch8=150,p11_cf8=0,p12_name=Evening_v2,p12_ch0=650,p12_cf0=0,p12_ch1=800,p12_cf1=0,p12_ch2=800,p12_cf2=0,p12_ch3=1023,p12_cf3=0,p12_ch4=650,p12_cf4=0,p12_ch5=30,p12_cf5=0,p12_ch6=30,p12_cf6=0,p12_ch7=30,p12_cf7=0,p12_ch8=30,p12_cf8=0,p13_name=Night_v2,p13_ch0=100,p13_cf0=0,p13_ch1=350,p13_cf1=0,p13_ch2=350,p13_cf2=0,p13_ch3=600,p13_cf3=0,p13_ch4=150,p13_cf4=0,p13_ch5=0,p13_cf5=0,p13_ch6=0,p13_cf6=0,p13_ch7=0,p13_cf7=0,p13_ch8=0,p13_cf8=0,p14_name=Moon,p14_ch0=0,p14_cf0=0,p14_ch1=0,p14_cf1=0,p14_ch2=0,p14_cf2=0,p14_ch3=30,p14_cf3=0,p14_ch4=15,p14_cf4=0,p14_ch5=0,p14_cf5=0,p14_ch6=0,p14_cf6=0,p14_ch7=0,p14_cf7=0,p14_ch8=0,p14_cf8=0,p15_name=Day LPS,p15_ch0=500,p15_cf0=0,p15_ch1=500,p15_cf1=0,p15_ch2=500,p15_cf2=0,p15_ch3=700,p15_cf3=1,p15_ch4=400,p15_cf4=0,p15_ch5=25,p15_cf5=0,p15_ch6=25,p15_cf6=0,p15_ch7=25,p15_cf7=0,p15_ch8=50,p15_cf8=0,p16_name=Blue LPS,p16_ch0=350,p16_cf0=0,p16_ch1=350,p16_cf1=0,p16_ch2=350,p16_cf2=0,p16_ch3=600,p16_cf3=0,p16_ch4=350,p16_cf4=0,p16_ch5=20,p16_cf5=0,p16_ch6=20,p16_cf6=0,p16_ch7=20,p16_cf7=0,p16_ch8=20,p16_cf8=0,p17_name=Peak LPS,p17_ch0=600,p17_cf0=0,p17_ch1=600,p17_cf1=0,p17_ch2=600,p17_cf2=0,p17_ch3=850,p17_cf3=0,p17_ch4=500,p17_cf4=0,p17_ch5=50,p17_cf5=0,p17_ch6=50,p17_cf6=0,p17_ch7=70,p17_cf7=0,p17_ch8=100,p17_cf8=0,p18_name=Profile_19,p18_ch0=0,p18_cf0=0,p18_ch1=0,p18_cf1=0,p18_ch2=0,p18_cf2=0,p18_ch3=0,p18_cf3=0,p18_ch4=0,p18_cf4=0,p18_ch5=0,p18_cf5=0,p18_ch6=0,p18_cf6=0,p18_ch7=0,p18_cf7=0,p18_ch8=0,p18_cf8=0,p19_name=Profile_20,p19_ch0=0,p19_cf0=0,p19_ch1=0,p19_cf1=0,p19_ch2=0,p19_cf2=0,p19_ch3=0,p19_cf3=0,p19_ch4=0,p19_cf4=0,p19_ch5=0,p19_cf5=0,p19_ch6=0,p19_cf6=0,p19_ch7=0,p19_cf7=0,p19_ch8=0,p19_cf8=0,");
			new_values_now("nowch0=588,nowch1=588,nowch2=588,nowch3=588,nowch4=588,nowch5=89,nowch6=89,nowch7=152,nowch8=245,cMoon=13,chr=16,cmin=11,cCloud=0,cMode=After - 0% Cloud,Ver=3.00");
			new_values_9(`m0_pindex=6,m0_hr=7,m0_min=30,m0_rate=15,m0_name=Sunrise,m0_master=100,m1_pindex=4,m1_hr=7,m1_min=45,m1_rate=5,m1_name=Early,m1_master=100,m2_pindex=3,m2_hr=8,m2_min=0,m2_rate=120,m2_name=Morning,m2_master=100,m3_pindex=9,m3_hr=12,m3_min=0,m3_rate=30,m3_name=Day,m3_master=100,m4_pindex=10,m4_hr=14,m4_min=0,m4_rate=30,m4_name=Peak,m4_master=100,m5_pindex=9,m5_hr=16,m5_min=0,m5_rate=30,m5_name=After,m5_master=100,m6_pindex=3,m6_hr=18,m6_min=0,m6_rate=60,m6_name=Evening,m6_master=100,m7_pindex=4,m7_hr=20,m7_min=0,m7_rate=30,m7_name=Night,m7_master=100,m8_pindex=14,m8_hr=22,m8_min=30,m8_rate=2,m8_name=Moon,m8_master=100,m9_pindex=15,m9_hr=22,m9_min=30,m9_rate=2,m9_name=Moon,m9_master=100,shr=2,smin=15,TZ=-8,ADLS=0,SelectedDLS=USA,MaxCloud=0,AccPercent=94.45,AccDays=7.00,VM=9,FanMode=0,m0_cindex=0,m1_cindex=1,m2_cindex=2,m3_cindex=3,m4_cindex=4,m5_cindex=5,ModelType=${ModelType},`);
		} else {
			fetch('http://' + curURL + '/profiles.cfg', 'GET', new_values_p);
			fetch('http://' + curURL + '/now.cfg', 'GET', new_values_now);
			fetch('http://' + curURL + '/settings3.cfg', 'GET', new_values_9);
		}
		lcount++;
		// 0 is p, 1 is r, 2 is now
		if (SameData[0] && SameData[1]) {
			setTimeout(refresh_now, 2000);
		} else {
			setTimeout(refresh_values, 2000);
		}
	} else {
		$("status").innerHTML = "Status: Ver" + $("Ver").value;
	}
	if (lcount >= 30) {
		$("status").innerHTML = "Status: Ver" + $("Ver").value;
	}
}

function refresh_now() {
	if ((looping2 == true) && (lcount < 30)) {
		$("status").innerHTML = "Status: Retrieving settings...";
		if (debug) {
			new_values_now("nowch0=588,nowch1=588,nowch2=588,nowch3=588,nowch4=588,nowch5=89,nowch6=89,nowch7=152,nowch8=245,cMoon=13,chr=16,cmin=11,cCloud=0,cMode=After - 0% Cloud,Ver=3.00");
		} else {
			fetch('http://' + curURL + '/now.cfg', 'GET', new_values_now);
		}
		lcount++;
		Update_Mode(modes.indexOf(Mode));
		setTimeout(refresh_now, 2000);
	} else {
		$("status").innerHTML = "Status: Ver" + $("Ver").value;
	}
	if (lcount >= 30) {
		$("status").innerHTML = "Status: Ver" + $("Ver").value;
	}
}

function deletemode(Mode) {
	DeleteMode = modes.indexOf(Mode);
	save_refresh();


}

function sendNow_refresh() {
	$("status").innerHTML = "Status: Sending NOW settings...";

	looping2 = true;
	lcount = 0;
	SameData = [true, true, false];

	var NowData = getFormArgs($("myFormMainNow"));
	NowData = encodeURIComponent(NowData);
	for (var i = 0; i < urlList.length; i++) {
		sendLED(urlList[i], "NoUpdate=Save" + NowData);
	}

	$("graphDiv1").style.backgroundColor = "";

	setTimeout(refresh_now, 2000);

}

function save_refresh() {
	if (DeleteMode == 0) {
		$("status").innerHTML = "Status: Saving settings...";
	} else {
		$("status").innerHTML = "Status: Deleting " + Mode + " and Save settings...";
	}

	looping2 = true;
	lcount = 0;
	SameData[0] = false;
	SameData[1] = false;
	SameData[2] = false;
	//get form data

	var FormData = getFormArgs($("myFormMain"));
	var NowData = getFormArgs($("myFormMainNow"));

	if ($("graphDiv1").style.backgroundColor != "") {
		FormData += "&" + NowData;
	}

	FormData += "&DeleteMode=" + (DeleteMode - 1);
	DeleteMode = 0;

	FormData = encodeURIComponent(FormData);


	for (var i = 0; i < urlList.length; i++) {
		sendLED(urlList[i], "NoUpdate=Save" + FormData);
	}
	//setTimeout(refresh_values.bind(null, urllist[0]), 2500);
	setTimeout(refresh_values, 2000);
}

function cancel_refresh() {
	$("status").innerHTML = "Status: Canceled and Retrieving settings...";
	looping2 = true;
	lcount = 0;
	SameData[0] = false;
	SameData[1] = false;
	SameData[2] = false;
	refresh_values();
}





function Update_ModeName() {
	var mInt = modes.indexOf(Mode);
	var previousMode = Mode;
	if (mInt > 0) {
		looping2 = false;
		$("graphDiv" + (mInt + 1)).style.backgroundColor = "#FFFF00";
		//$("Time"+(mInt)).style.backgroundColor="#FFFF00";
		//graph[mInt].backgroundColor = "#FFFF00";
		modes[mInt] = $("mode_name").innerHTML.split(/[< &%^*#@>'"/]/)[0];
		$("m" + (mInt - 1) + "_name").value = modes[mInt];
		Mode = modes[mInt];
		UpdateGraph_9();
		if (Mode == "Moon") {
			Update_Mode(mInt);
		}
		if ((previousMode == "Moon") && (Mode != "Moon")) {
			Update_Mode(mInt);
		}
	}
}


function ClearValue(id) {
	$(id).value = "";
}

function dbltap(mInt) {
	var SelMode = modes[mInt];
	if ((((new Date().getTime()) - touchtime) < 800) && (SelMode == PreMode)) {
		NowEditable = true;
		Update2Now(mInt);
		touchtime = new Date().getTime();
	} else {
		Update_Mode(mInt);
		touchtime = new Date().getTime();
		PreMode = Mode;
	}
}


function Profile2Now(Pindex) {
	Update_Mode(0);

	var num;

	for (var i = 0; i < 9; i++) {

		num = $("p" + Pindex + "_ch" + i).value;


		$("N" + (i + 1)).value = num;
		$("Slider" + (i + 1)).value = num;
		$("Per" + (i + 1)).value = Math.round(1000 * num / 1023) / 10;
		updateRangeColor(i);
	}

	Update_Fields(Mode);

}


function Update2Now(mInt) {
	//Update_Mode(mInt);
	Update_Mode(0);

	var num;

	for (var i = 0; i < 9; i++) {

		if (mInt == 0) {
			num = $("nowch" + i).value;
		} else {
			var Pindex = $("m" + (mInt - 1) + "_pindex").value;
			num = $("p" + Pindex + "_ch" + i).value * $("m" + (mInt - 1) + "_master").value / 100;
		}

		$("N" + (i + 1)).value = num;
		$("Slider" + (i + 1)).value = num;
		$("Per" + (i + 1)).value = Math.round(1000 * num / 1023) / 10;
		updateRangeColor(i);
	}

	Update_Fields(Mode);

}



function Update_Mode(mInt) {
	Selection(mInt);
	Mode = modes[mInt];
	$("NumOfModes").value = ValidModes - 1;
	$("mode_status").innerHTML = "";
	$("mode_name").removeEventListener("input", Update_ModeName);
	if (mInt == 0) {
		$("Accl1").style.display = "";
		$("Accl2").style.display = "";
		$("modeRow").colSpan = 3;
		$("Time").colSpan = 2;
		$("DeleteMode").style.display = "none";
		//$("mode").innerHTML = Mode+" Status: ";
		$("mode").innerHTML = Mode;
		$("mode_name").contentEditable = "false";
		$("mode_name").innerHTML = $("cMode").value;
		if ($("cMode").value == "Moon") {
			$("mode").innerHTML = Mode + " Status: " + $("cMode").value + " at " +
				$("cMoon").value + "%";
		}
		$("Time").childNodes[0].data = "Current Time";
		$("Rate").style.visibility = "hidden";
		$("R").style.display = "none";
		if (_reeFi.dateHelper.isDateSupported) {
			$("H").style.display = "none";
			$("M").style.display = "none";
			$("Time").childNodes[2].textContent = "";
			$("time2").style.display = "";
		} else {
			$("H").style.display = "";
			$("M").style.display = "";
			$("Time").childNodes[2].textContent = ":";
			$("time2").style.display = "none";
		}
		$("time2").value = addZero($("chr").value) + ":" + addZero($("cmin").value);
		$("H").value = $("chr").value;
		$("M").value = $("cmin").value;
		$("pwrH").value = $("shr").value;
		$("pwrM").value = $("shr").value;
		$("Time").childNodes[6].data = ", TimeZone";
		$("Zone").value = $("TZ").value;
		$("Zone").style.display = "";
		$("Resume_row").style.display = "";
		if (parseInt($("cMode").value.split("Manual")[1]) > 0) {
			$("Resume").style.visibility = "";
		} else {
			$("Resume").style.visibility = "hidden";
		}

		if (NowEditable) {
			$("F").style.display = "";
			$("SliderAll").style.display = "";
		} else {
			$("F").style.display = "none";
			$("SliderAll").style.display = "none";
		}
		$("Time").style.display = "";
		$("PwrTime").style.display = "none";

		$("Time").style.visibility = "hidden";
		$("MasterBar").style.display = "none";
		$("CustomBtns").style.display = "";
	} else {

		$("F").style.display = "";
		$("SliderAll").style.display = "";

		$("Accl1").style.display = "none";
		$("Accl2").style.display = "none";
		$("modeRow").colSpan = 3;
		$("Time").colSpan = 4;
		$("DeleteMode").style.display = "";
		$("mode").innerHTML = "Period: ";
		$("mode_name").contentEditable = "true";
		$("mode_name").innerHTML = Mode;
		if (Mode == "Moon") {
			$("mode_status").innerHTML = " at " + $("cMoon").value + "% Full";
		}

		$("mode_name").addEventListener("input", Update_ModeName, false);

		$("Time").childNodes[0].data = "Start Time";

		$("Rate").value = $("m" + (mInt - 1) + "_rate").value;
		$("Rate").style.visibility = "";
		$("R").style.display = "";
		$("H").value = $("m" + (mInt - 1) + "_hr").value;
		$("M").value = $("m" + (mInt - 1) + "_min").value;
		$("time2").value = addZero($("m" + (mInt - 1) + "_hr").value) + ":" + addZero($("m" + (mInt - 1) + "_min").value);
		$("Time").childNodes[6].data = "";
		$("Zone").style.display = "none";
		$("Resume").style.visibility = "hidden";
		$("F").style.display = "none";
		$("PwrTime").style.display = "none";
		$("Time").style.display = "none";
		$("Time").style.visibility = "";
		$("Resume_row").style.display = "none";

		$("SliderM").value = $("m" + (mInt - 1) + "_master").value;
		$("PerM").value = $("m" + (mInt - 1) + "_master").value;
		$("MasterBar").style.display = "";
		$("CustomBtns").style.display = "none";
	}

	if (Mode == "Moon") {
		$("label").style.visibility = "";
		$("label").innerHTML = ("Min Moon");
		$("Peak").style.display = "none";
		$("Cloud").style.visibility = "hidden";
	} else {
		$("Peak").style.display = "none";
		$("Cloud").style.visibility = "";
		$("label").style.visibility = "";
		$("label").innerHTML = ("Cloud Factor");
	}
	if (mInt == 0) {
		$("CloudRow").style.display = "none";
		$("Peak").style.display = "none";
		$("Cloud").style.display = "none";
		$("label").style.display = "none";
	} else {
		$("CloudRow").style.display = "";
		$("Peak").style.display = "none";
		$("Cloud").style.display = "";
		$("label").style.display = "";
	}

	if (mInt == 0) {
		for (var i = 0; i < 9; i++) {
			$("M" + (i + 1) + "td").style.display = "none";
		}
	} else {
		for (var i = 0; i < 9; i++) {
			var Pindex = $("m" + (mInt - 1) + "_pindex").value;
			$("M" + (i + 1)).value = $("p" + Pindex + "_cf" + i).value;
			$("M" + (i + 1) + "td").style.display = "";
		}
	}
	for (var i = 0; i < 9; i++) {
		var num;
		if (mInt == 0) {
			num = $("nowch" + i).value;
		} else {
			var Pindex = $("m" + (mInt - 1) + "_pindex").value;
			num = $("p" + Pindex + "_ch" + i).value;
		}

		$("N" + (i + 1)).value = num;
		$("Slider" + (i + 1)).value = num;
		$("Per" + (i + 1)).value = Math.round(1000 * num / 1023) / 10;
		updateRangeColor(i);
	}

	if (mInt > 0) {
		updateRangeMColor();
	}


	$("Time0").innerHTML = formatTime($("chr").value, $("cmin").value);
	$("Time0").style.color = "";
	for (var i = 0; i < (NumModes - 1); i++) {
		$("Time" + (i + 1)).innerHTML = formatTime($("m" + i + "_hr").value, $("m" + i + "_min").value);
		$("Time" + (i + 1)).style.color = "";
		$("Time" + (i + 1)).style.fontSize = "";
		$("P_name" + (i + 1)).style.color = "";
		$("P_name" + (i + 1)).style.fontSize = "";
		$("P_name" + (i + 1)).style.width = "50px";
	}
	$("Time" + mInt).style.color = "#FF0000";
	$("Time" + mInt).style.fontSize = "16px";
	$("P_name" + mInt).style.color = "#FF0000";
	$("P_name" + mInt).style.fontSize = "16px";
	$("P_name" + mInt).style.width = "";

	$("C").value = $("MaxCloud").value;
	$("Cloud").childNodes[0].data = "Cloud " + $("cCloud").value + "%, Max:";
	$("Fan").value = $("FanMode").value;

	$("Acclimate1").value = Math.round(10 * parseFloat($("AccPercent").value)) / 10;
	$("Acclimate2").value = Math.round($("AccDays").value);
	if ($("AccDays").value > 0) {
		$("Accl2").style.color = "#FF0000";
		$("Accl1").style.color = "#FF0000";
		$("Accl2").style.fontWeight = "bold";
		$("Accl1").style.fontWeight = "bold";

	} else {
		$("Accl2").style.color = "";
		$("Accl1").style.color = "";
		$("Accl2").style.fontWeight = "";
		$("Accl1").style.fontWeight = "";
	}

	for (var i = 0; i < 6; i++) {
		$("cbtn" + i).value = $("p" + $("m" + i + "_cindex").value + "_name").value;
	}


	UpdateGraph_9();
}

function formatTime(Hr, Min) {
	var Time;
	var M;
	if (parseInt(Hr) == 0) {
		Time = "12:";
	} else if (parseInt(Hr) < 13) {
		Time = Hr + ":";
	} else {
		Time = (parseInt(Hr) - 12) + ":";
	}
	if (parseInt(Hr) < 12) {
		M = "a";
	} else {
		M = "p"
	}
	if (parseInt(Min) < 10) {
		Time = Time + "0" + Min + M;
	} else {
		Time = Time + Min + M;
	}
	return (Time);
}

function updateRangeColor(i) {
	var val = ($("Slider" + (i + 1)).value - $("Slider" + (i + 1)).min) / ($("Slider" + (i + 1)).max - $("Slider" + (i + 1)).min);

	if (modes.indexOf(Mode) > 0) {
		val = val * parseInt($("SliderM").value) / 100;
	}

	$("Slider" + (i + 1)).style.backgroundImage =
		'-webkit-gradient(linear, left top, right top, '
		+ 'color-stop(' + val + ', #008CEF), '
		+ 'color-stop(' + val + ', #B4B4B4)'
		+ ')';
}



function stopLoop() {
	looping2 = false;
}

function updateRangeMColor() {
	var min = 0;
	var max = 100;
	var L = [];
	var index = 0;

	for (var i = 1; i < (LEDCH + 1); i++) {
		if (parseInt($("N" + i).value) > 0) {
			L[index] = parseInt($("N" + i).value);
			index++;
		}
	}

	if (L.length == 0) {
		min = 0;
		max = 200;
		$("SliderM").value = 100;
		$("PerM").value = 100;
	} else {
		min = Math.round(100 * 2 / (Math.min(...L)));
		max = Math.round(100 * 1024 / (Math.max(...L)));
	}

	if (min > 100) {
		min = 100;
	}

	$("SliderM").min = min;
	$("SliderM").max = max;


	if (max < $("PerM").value) {
		$("SliderM").value = max;
		$("PerM").value = max;
	}


	var val = ($("SliderM").value - $("SliderM").min) / ($("SliderM").max - $("SliderM").min);
	$("SliderM").style.backgroundImage =
		'-webkit-gradient(linear, left top, right top, '
		+ 'color-stop(' + val + ', #008CEF), '
		+ 'color-stop(' + val + ', #B4B4B4)'
		+ ')';


}

function MasterSlider() {
	$("PerM").value = $("SliderM").value;
	updateRangeMColor();

	for (var i = 0; i < LEDCH; i++) {
		updateRangeColor(i);
	}

	Update_Fields(Mode);

}

function MasterPer() {
	$("SliderM").value = $("PerM").value;
	updateRangeMColor();

	for (var i = 0; i < LEDCH; i++) {
		updateRangeColor(i);
	}

	Update_Fields(Mode);

}

function showValue() {
	looping2 = false;
	for (var i = 0; i < LEDCH; i++) {
		$("N" + (i + 1)).value = $("Slider" + (i + 1)).value;
		updateRangeColor(i);
		$("Per" + (i + 1)).value = Math.round(1000 * $("Slider" + (i + 1)).value / 1023) / 10;
	}
	Update_Fields(Mode);
}
function Update_Time2(Mode) {
	var list = $("time2").value.split(":");
	$("H").value = parseInt(list[0]);
	$("M").value = parseInt(list[1]);
	Update_Time(Mode);
}
function Update_Time(Mode) {
	var mInt = modes.indexOf(Mode);
	Update_Fields(Mode);
	if (mInt == 0) {
		TimeChanged = true;
		looping2 = false;
		$("Time" + (mInt)).innerHTML = formatTime($("cHr1").value, $("cMin1").value);
	} else {
		$("Time" + (mInt)).innerHTML = formatTime($("Hr" + (mInt)).value, $("Min" + (mInt)).value);
	}
}
function Update_Fields_P(Mode) {
	for (var i = 0; i < LEDCH; i++) {
		if ($("Per" + (i + 1)).value > 100) {
			$("Per" + (i + 1)).value = 100;
		}
		if ($("Per" + (i + 1)).value < 0) {
			$("Per" + (i + 1)).value = 0;
		}
		$("N" + (i + 1)).value = Math.round(parseFloat($("Per" + (i + 1)).value) / 100 * 1023);
	}
	Update_Fields(Mode);
}

function Update_Fields_N(Mode) {
	for (var i = 0; i < LEDCH; i++) {
		if ($("N" + (i + 1)).value > 1023) {
			$("N" + (i + 1)).value = 1023;
		}
		if ($("N" + (i + 1)).value < 0) {
			$("N" + (i + 1)).value = 0;
		}
		$("Per" + (i + 1)).value = Math.round(1000 * $("N" + (i + 1)).value / 1023) / 10;
	}
	Update_Fields(Mode);
}

function Update_Fields(Mode) {
	var mInt = modes.indexOf(Mode);
	looping2 = false;
	var Pindex;

	if (mInt > 0) {
		Pindex = $("m" + (mInt - 1) + "_pindex").value;
	}

	$("NumOfModes").value = ValidModes - 1;

	for (var i = 0; i < LEDCH; i++) {
		if (parseInt($("N" + (i + 1)).value) > 1023) {
			$("N" + (i + 1)).value = 1023;
		}
		if (parseInt($("N" + (i + 1)).value) < 0) {
			$("N" + (i + 1)).value = 0;
		}

		if (mInt == 0) {
			$("nowch" + i).value = $("N" + (i + 1)).value;
		} else {
			$("p" + Pindex + "_ch" + i).value = $("N" + (i + 1)).value;
			$("p" + Pindex + "_cf" + i).value = $("M" + (i + 1)).value;
		}
		$("Slider" + (i + 1)).value = $("N" + (i + 1)).value;
	}
	if (mInt > 0) {
		$("m" + (mInt - 1) + "_hr").value = $("H").value;
		$("m" + (mInt - 1) + "_min").value = $("M").value;
		$("m" + (mInt - 1) + "_rate").value = $("Rate").value;
		$("m" + (mInt - 1) + "_master").value = $("SliderM").value;
	} else {
		$("chr").value = $("H").value;
		$("cmin").value = $("M").value;
		$("shr").value = $("pwrH").value;
		$("smin").value = $("pwrM").value;
	}
	$("MaxCloud").value = $("C").value;
	$("TZ").value = $("Zone").value;
	$("FanMode").value = $("Fan").value;
	$("AccPercent").value = $("Acclimate1").value;
	$("AccDays").value = $("Acclimate2").value;
	if ($("AccDays").value > 0) {
		$("AccDays").style.color = "#FF0000";
		$("AccPercent").style.color = "#FF0000";
		$("AccDays").style.fontWeight = "bold";
		$("AccPercent").style.fontWeight = "bold";

	} else {
		$("AccDays").style.color = "";
		$("AccPercent").style.color = "";
		$("AccDays").style.fontWeight = "";
		$("AccPercent").style.fontWeight = "";
	}

	$("graphDiv" + (mInt + 1)).style.backgroundColor = "#FFFF00";
	//$("Time"+(mInt)).style.backgroundColor="#FFFF00";
	//graph[mInt].backgroundColor = "#FFFF00";
	if (mInt == 0) {
		NowChanged = true;
	}

	UpdateGraph_9();

	for (var i = 0; i < LEDCH; i++) {
		updateRangeColor(i);
	}
	updateRangeMColor();


	if (modes.indexOf(Mode) > 0) {
		var P = $("Settings" + (modes.indexOf(Mode) - 1)).selectedIndex;
		for (var j = 0; j < (NumModes - 1); j++) {
			$("Settings" + j).options[P].textContent = $("Settings" + j).options[P].value + "(" + ProfileWatts(P) + "W)";
		}
	}


}

function AddFields(StrID, list, container, display, width, edit) {
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

		container.appendChild(input);
	}
}

function AddFields_v3(ID, V, ctn) {
	var input = document.createElement("input");
	input.id = ID;
	input.name = ID;
	input.value = V;
	input.style.display = "none";
	ctn.appendChild(input);
}

function GenFields_v3(list) {
	var container = $("container");
	_reeFi.htmlHelper.emptyCtn(container);

	for (var i = 0; i < list.length; i++) {
		var list2 = list[i].split(/[=]/);
		if (list2.length == 2) {
			AddFields_v3(list2[0], list2[1], container);
		}
	}

	ValidModes = parseInt($("VM").value) + 1;

	for (var j = 1; j < NumModes; j++) {
		modes[j] = $("m" + (j - 1) + "_name").value;
	}

	$("timezone").value = $("TZ").value;
	$("POT").value = addZero(parseInt($("shr").value)) + ":" + addZero(parseInt($("smin").value));
	$("DLS").checked = (parseInt($("ADLS").value) == 1);
	$("SelectDLS").value = $("SelectedDLS").value;

	Update_Mode(modes.indexOf(Mode));
}

function GenFields_p(list) {
	var container = $("containerp");
	_reeFi.htmlHelper.emptyCtn(container);

	for (var i = 0; i < list.length; i++) {
		var list2 = list[i].split(/[=]/);
		if (list2.length == 2) {
			AddFields_v3(list2[0], list2[1], container);
		}
	}
}

function GenFields_now(list) {
	var container = $("containernow");
	var containerC = $("containerC");
	_reeFi.htmlHelper.emptyCtn(container);
	_reeFi.htmlHelper.emptyCtn(containerC);

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


function GenFields_9(list) {
	var container = $("container");
	_reeFi.htmlHelper.emptyCtn(container);
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


	ValidModes = list[0];
	ValidModes++;

	for (var j = 0; j < 9; j++) {
		num[j] = list[j + 1];
		num_ind = j;
		index = j + 1;
	}

	for (var j = 0; j < (NumModes - 1); j++) {
		for (var i = 0; i < 9; i++) {
			num_ind++;
			num[num_ind] = list[10 + i + (12 * j)];
		}
		hr[j] = list[19 + j * 12];
		min[j] = list[20 + j * 12];
		rate[j] = list[21 + j * 12];
		index = 21 + j * 12;
	}


	AddFields("Num", num, container, false);
	AddFields("Hr", hr, container, false);
	AddFields("Min", min, container, false);
	AddFields("Delay", rate, container, false);
	index++;
	AddFields("sHr", list.slice(index, index + 1), container, false);
	POT_hr = list.slice(index, index + 1)[0];
	index++;
	AddFields("sMin", list.slice(index, index + 1), container, false);
	POT_min = list.slice(index, index + 1)[0];
	$("POT").value = addZero(POT_hr) + ":" + addZero(POT_min);
	index++;
	AddFields("TZ", list.slice(index, index + 1), container, false);
	$("timezone").value = list.slice(index, index + 1)[0];
	index++;
	AddFields("Cloud", [list.slice(index, index + 1), list.slice(index + 26, index + 27)], container, false);  //cloud max, c cloud
	index++;
	AddFields("CF", list.slice(index, index + 9), container, false);		//cloud factor
	index = index + 9;
	AddFields("Peak", list.slice(index, index + 3), container, false);
	index = index + 3;
	AddFields("MF", list.slice(index, index + 9), container, false);		//moon factor
	index = index + 9;
	AddFields("Mode", list.slice(index, index + 1), container, false);
	index++;
	AddFields("cHr", list.slice(index, index + 1), container, false);
	index++;
	AddFields("cMin", list.slice(index, index + 1), container, false);
	index++;
	AddFields("cMoon", list.slice(index, index + 1), container, false);
	index++;
	index++;
	AddFields("Ver", list.slice(index, index + 1), container, false);
	index++;
	AddFields("FAN", list.slice(index, index + 1), container, false);

	for (var j = 1; j < NumModes; j++) {
		modes[j] = list[index + j];
	}
	index = index + NumModes;

	AddFields("Acc", list.slice(index, index + 2), container, false);
	index++;
	index++;

	$("DLS").checked = (list.slice(index, index + 1)[0] == "1");

	Update_Mode(modes.indexOf(Mode));
}

function openNav() {
	$("InfoFrame").src = 'http://' + curURL + '/info2';
	$("mySidenav").style.width = "250px";
}
function closeNav() {
	if (isMobile) {
		$("mySidenav").style.width = "0";
	}
}
function setupNav() {
	looping2 = false;
	$("AdvSetup").style.display = "none";
	$("myForm").style.display = "none";
	$("myFormSetup").style.display = "block";
	$("myFormLEDs").style.display = "block";
	closeNav();
	//fetch('http://'+curURL+'/reefileds.txt','GET', null);
}
function aquariumNav() {
	looping2 = false;
	$("AdvSetup").style.display = "none";
	$("myForm").style.display = "";
	$("myFormSetup").style.display = "none";
	$("myFormLEDs").style.display = "none";
	closeNav();
	looping2 = true;
	lcount = 0;
	SameData[0] = false;
	SameData[1] = false;
	SameData[2] = false;
	refresh_values();
}

function DisplayOnOff() {
	for (var i = 0; i < urlList.length; i++) {
		fetch('http://' + urlList[i] + '/DisplayOnOff', 'GET');
	}
	closeNav();
}

function AdvanceSetup(id, s = 'none') {
	looping2 = false;
	$("AdvSetup").style.display = "";
	$("myForm").style.display = "none";
	$("myFormSetup").style.display = "none";
	$("myFormLEDs").style.display = "none";

	if (id == InfoFrame) {
		id.src = 'http://' + curURL + '/info';
	}
	if (id == FWFrame) {
		id.src = 'http://' + curURL + '/firmware';
		for (var i = 1; i < urlList.length; i++) {
			fetch('http://' + urlList[i] + '/firmware', 'GET');
		}
	}
	if (id == ResetDefaultFrame) {
		if (s == 'ReeFi_SPS') {
			id.src = 'http://' + curURL + '/reset_defaultReeFiSPS';
		}
		if (s == 'SPS') {
			id.src = 'http://' + curURL + '/reset_default';
		}
		if (s == 'LPS') {
			id.src = 'http://' + curURL + '/reset_defaultLPS';
		}
		if (s == 'User') {
			id.src = 'http://' + curURL + '/reset_defaultUser';
		}
	}

	if ((id == Demo) && (SFX.src == 'http://' + curURL + '/')) {
		SFX.src = "thunder_sound_FX.mp3";
	}

	// hide all
	var iframes = document.querySelectorAll("iframe");
	for (var i = 0; i < iframes.length; i++) {
		iframes[i].style.display = "none";
	}
	$("PreFW").style.display = "none";
	$("PreDefault").style.display = "none";
	$("DateTime").style.display = "none";
	$("Demo").style.display = "none";
	$("InfoHeader").style.display = "none";
	$("logo").style.display = "none";
	$("Admin").style.display = "none";


	// show active
	id.style.display = "";
	if (id == PreFW) {
		$("FirmwareFrame").src = 'http://www.reefi-lab.com/reefilab/LED/gen2/firmware/ver.html';
		$("FirmwareFrame").contentWindow.location.href = $("FirmwareFrame").src + "?n=" + fwCnt;
		fwCnt++;
		$("FirmwareFrame").style.display = "";
		$("FirmwareFrame").style.height = '600px';
		$("FirmwareFrame").style.width = '600px';
		$("FirmwareStatus").style.display = "";
		$("FirmwareStatusText").innerText = "Current Version: " + $("Ver").value;
	} else {
		$("FirmwareFrame").style.display = "none";
		$("FirmwareStatus").style.display = "none";
	}


	if ((id == DateTime) || (id == Demo) || (id == PreFW) || (id == Admin)) {
		$("InfoHeader").style.display = "";
		$("logo").style.display = "";
		DLS_fieldupdate();
	}

	if (id == PreDefault) {
		$("logo").style.display = "";
	}

	if ((id != PreFW) && (id != PreDefault) && (id != DateTime) && (id != Demo)) {
		resizeIframe(id);
	}

	closeNav();
}
function resizeIframe(id) {
	//document.getElementById(id).style.height = document.getElementById(id).contentWindow.document.body.scrollHeight + 'px';
	//document.getElementById(id).style.width = document.getElementById(id).contentWindow.document.body.scrollWidth + 'px';
	if ((id == FWFrame) || (id == InfoFrame)) {
		id.style.height = '1000px';
		id.style.width = '500px';
	} else {
		id.style.height = id.contentWindow.document.body.scrollHeight + 'px';
		id.style.width = id.contentWindow.document.body.scrollWidth + 'px';
		if (id.contentWindow.document.body.scrollHeight < 900) {
			id.style.height = '900px';
		}
	}
}
function new_LEDs(strlist) {
	if (strlist) {
		var list = strlist.split(",");
		GenLEDs(list);
	}
}
function get_LEDs() {
	$("statusSetup").innerHTML = "Status: Scanning for all ReeFi LEDs...";
	fetch('http://' + curURL + '/reefileds.txt', 'GET', new_LEDs);

}
function GenLEDs(list) {
	var container = $("LEDS");
	var container2 = $("AQNUM");
	_reeFi.htmlHelper.emptyCtn(container);
	_reeFi.htmlHelper.emptyCtn(container2);
	AddFields("HostName", list.sort(), container, true, "180px", false);
	AddFields("AqurNum", GenNum(list.length), container2, true, "80px");
	//set blink
	setBlink(container);
	$("statusSetup").innerHTML = "Status: Scan Completed.";
}
function setBlink(container) {
	for (var i = 0; i < container.childElementCount; i++) {
		container.childNodes[i].onclick = (function () {
			var url = container.childNodes[i].value.split(" ");
			return function () {
				sendLED(url[1], "NoUpdate=Save&BLINK1=2");
			}
		})();
	}
}

function GenNum(s) {
	var assign = [];
	var strlist = "";
	for (var i = 0; i < s; i++) {
		assign[i] = i + 1;
	}
	return assign;
}
function GroupLEDsave() {
	$("statusSetup").innerHTML = "Status: Saving Group LED info...";
	GroupLED();
	sendGLED(curURL, "NoUpdate=Save" + getFormArgs($("myFormLEDs")));
	$("statusSetup").innerHTML = "Status: Saved Group LED info.";
	//GLED_init();
	setTimeout(GLED_init, 1500);
}
function GroupLED() {
	var aquaNums = [];
	var ledLists = [];
	var AQNUM = $("AQNUM");
	var LEDS = $("LEDS");
	var newAq = true;
	for (var i = 0; i < AQNUM.childElementCount; i++) {
		newAq = true;
		for (var j = 0; j < aquaNums.length; j++) {
			if (aquaNums[j] == AQNUM.childNodes[i].value) {
				newAq = false;
				break;
			}
		}
		if (newAq) {
			aquaNums.push(AQNUM.childNodes[i].value);
		}
	}
	for (var i = 0; i < aquaNums.length; i++) {
		ledLists[i] = [];
		ledLists[i].push(aquaNums[i]);
		for (var j = 0; j < AQNUM.childElementCount; j++) {
			if (aquaNums[i] == AQNUM.childNodes[j].value) {
				ledLists[i].push(LEDS.childNodes[j].value);
			}
		}
	}
	var container = $("GroupLEDCtn");
	_reeFi.htmlHelper.emptyCtn(container);

	var ledstr = [];
	for (var i = 0; i < ledLists.length; i++) {
		ledstr[i] = ledLists[i][0];
		for (var j = 1; j < ledLists[i].length; j++) {
			ledstr[i] = ledstr[i] + "," + ledLists[i][j];
		}
	}
	AddFields("GLEDS", ledstr.sort(), container, false);
	addMenu();
	$("statusSetup").innerHTML = "Status: Done";
}


function GetHostIP() {
	var ip = $("ReeFiAddIp").value;
	fetch('http://' + ip + '/GetHostIP', 'GET', ManualLoadGLED);
	$("statusSetup").innerHTML = "Status: Searching....";
}

function ManualLoadGLED(strlist) {
	var list = [];

	if (strlist != null) {
		list[0] = strlist;

		var container = $("LEDS");
		var container2 = $("AQNUM");

		AddFields("HostName", list.sort(), container, true, "180px", false);
		AddFields("AqurNum", GenNum(list.length), container2, true, "80px");
		setBlink(container);
		$("statusSetup").innerHTML = "Status: Completed.";
	} else {
		$("statusSetup").innerHTML = "Status: Network error, timed out.";
	}

}

function new_GLEDs(strlist) {
	if (strlist) {
		var list = strlist.split(/[,\n]/);
		if (list[0] != "<html>") {
			LoadGLED(list);
		}
	}
}

function LoadGLED(list) {
	var tank;
	var tanks = [];
	var leds = [];
	var ctn1 = $("AQNUM");
	var ctn2 = $("LEDS");
	_reeFi.htmlHelper.emptyCtn(ctn1);
	_reeFi.htmlHelper.emptyCtn(ctn2);

	for (var i = 0; i < list.length; i++) {
		if (list[i].length < 5) {
			tank = list[i];
		} else {
			tanks.push(tank);
			leds.push(list[i]);
		}
	}
	AddFields("HostName", leds, ctn2, true, "180px", false);
	AddFields("AqurNum", tanks, ctn1, true, "80px");
	setBlink(ctn2);
	GroupLED();
}
function appendNode(ctn, name, link, size, pad) {
	var node = document.createElement("a");
	var textnode = document.createTextNode(name);
	node.style.fontSize = size;
	node.style.padding = pad;
	node.appendChild(textnode);
	if (link == "#") {
		node.addEventListener("click", function () {
			if (lastMyMenu != null) {
				lastMyMenu.style.color = "";
			}
			this.style.color = "#FF0000";
			lastMyMenu = this;
			//GrpLedEvent(name.slice(-1));
			GrpLedEvent(name.split(" ")[1]);
			$("InfoHeader").innerHTML = name;
			aquariumNav();
		});
	} else {
		node.addEventListener("click", function () {
			if (lastMyMenu != null) {
				lastMyMenu.style.color = "";
			}
			this.style.color = "#FF0000";
			lastMyMenu = this;
			$("header").innerHTML = name;
			$("InfoHeader").innerHTML = name;
			urlList = [];
			curURL = link.match(/[0-9.]+/);
			urlList.push(curURL);
			aquariumNav();
		});
	}
	ctn.appendChild(node);
}
function addMenu() {
	var ctn = $("myMenu");
	var aqnum = $("GroupLEDCtn");
	_reeFi.htmlHelper.emptyCtn(ctn);

	for (var i = 0; i < aqnum.childElementCount; i++) {
		var data = aqnum.childNodes[i].value.split(/[ ,\n]/);
		appendNode(ctn, "Aquarium " + data[0], "#", "16pt", "%");
		for (var j = 1; j < data.length; j += 2) {
			appendNode(ctn, data[j], "http://" + data[j + 1], "12pt", "0px 0px 0px 50px");
		}
	}
}
function GrpLedEvent(tank) {
	var ipaddr = [];
	var aqnum = $("GroupLEDCtn");
	closeNav();
	for (var i = 0; i < aqnum.childElementCount; i++) {
		var data = aqnum.childNodes[i].value.split(/[ ,\n]/);
		if (tank == data[0]) {
			$("header").innerHTML = "Aquarium" + tank;
			urlList = [];
			curURL = data[2];
			urlList.push(curURL);
			for (var j = 4; j < data.length; j += 2) {
				ipaddr.push(data[j]);
				//$("header").innerHTML = $("header").innerHTML + "," +data[j-1];
				urlList.push(data[j]);
			}
			break;
		}
	}

}


function sendLED(addr, str) {
	fetch('http://' + addr + '/Lrequests?' + str, 'GET');
}
function sendGLED(addr, str) {
	fetch('http://' + addr + '/Grequests?' + str, 'GET');
}

function getFormArgs(form) {
	var data = "";
	for (var i = 0; i < form.length; i++) {
		data = data + "&" + form[i].name + "=" + form[i].value;
	}
	return data;
}

function ProfileWatts(P) {
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

function CustomBtnClear() {
	for (var i = 0; i < 6; i++) {
		$("cbtn" + i).style.backgroundColor = "";
	}
}

function CustomBtn(select) {
	//CustomBtnClear();
	//$("cbtn"+select).style.backgroundColor="yellow";
	Profile2Now($("m" + select + "_cindex").value);
	$("mode_name").innerText = "Manual 30:00";
	sendNow_refresh();

}




function Selection_init() {
	for (var j = 0; j < (NumModes - 1); j++) {
		for (var i = 0; i < ProfilesMax; i++) {
			$("Settings" + j).options[i].textContent = $("p" + i + "_name").value + "(" + ProfileWatts(i) + "W)";
			$("Settings" + j).options[i].value = $("p" + i + "_name").value;
		}
		$("Settings" + j).selectedIndex = $("m" + j + "_pindex").value;
		$("Settings_name" + j).value = $("Settings" + j).value;
		$("P_name" + (j + 1)).textContent = $("Settings_name" + j).value;

	}
	ProfilesHideEmpty();
}

function ProfilesHideEmpty() {
	var isFull = true;
	for (var j = 0; j < (NumModes - 1); j++) {
		for (var i = 0; i < ProfilesMax; i++) {
			if ((ProfileWatts(i) == 0) && ($("Settings" + j).options[i].value == ("Profile_" + (i + 1)))) {
				$("Settings" + j).options[i].style.display = "none";
				isFull = false;
			} else {
				$("Settings" + j).options[i].style.display = "";
			}
		}
		if (!isFull) {
			$("Settings" + j).options[ProfilesMax].style.display = "";
		} else {
			$("Settings" + j).options[ProfilesMax].style.display = "none";
		}
	}
}

function ProfileAdd() {
	var index;
	for (var i = 0; i < ProfilesMax; i++) {
		if ((ProfileWatts(i) == 0) && ($("Settings0").options[i].value == ("Profile_" + (i + 1)))) {
			index = i;
			break;
		}
	}

	for (var j = 0; j < (NumModes - 1); j++) {
		$("Settings" + j).options[index].style.display = "";
	}

	return index;
}

function SelectDelete() {
	var mInt = modes.indexOf(Mode) - 1;
	var sInt = $("Settings" + mInt).selectedIndex;

	if (sInt > 5) {

		for (var i = 0; i < LEDCH; i++) {
			$("N" + (i + 1)).value = 0;
		}
		Update_Fields(Mode);
		$("Settings" + mInt).options[sInt].value = "Profile_" + (sInt + 1);
		UpdateSelectName(mInt);

		for (var j = 0; j < (NumModes - 1); j++) {
			if ($("Settings" + j).selectedIndex == sInt) {
				$("Settings" + j).selectedIndex = 5;
				UpdateSelectName(j);
			}
		}
	}
}

function SelectCancel() {
	if ($("cancelBtn").style.display == "inline-block") {
		$("selectBtn").value = "Copy";
		$("cancelBtn").style.display = "none";
	}
}

function SelectCopyPaste() {
	if ($("selectBtn").value == "Copy") {
		$("selectBtn").value = "Paste"
		$("cancelBtn").style.display = "inline-block";

		for (var i = 0; i < LEDCH; i++) {
			LEDS[i] = $("N" + (i + 1)).value;
		}

	} else {
		$("selectBtn").value = "Copy";
		$("cancelBtn").style.display = "none";
		for (var i = 0; i < LEDCH; i++) {
			$("N" + (i + 1)).value = LEDS[i];
		}
		Update_Fields(Mode);
	}
}

function UpdateSelectName(i) {
	// i is modes
	// check if select +Add
	if ($("Settings" + i).selectedIndex == ProfilesMax) {
		$("Settings" + i).selectedIndex = ProfileAdd();
		$("Settings" + i).options[$("Settings" + i).selectedIndex].value = "new";
	}
	$("Settings_name" + i).value = $("Settings" + i).value;
	$("SliderM").value = 100;
	$("SliderM").max = 200;
	$("SliderM").min = 0;
	$("PerM").value = 100;
	$("m" + i + "_master").value = 100;
	UpdatePname(i);
	ProfilesHideEmpty();

}

function UpdatePname(i) {
	// i is modes
	if ($("Settings_name" + i).value != "") {
		$("P_name" + (i + 1)).textContent = $("Settings_name" + i).value;

	}
	$("m" + i + "_pindex").value = $("Settings" + i).selectedIndex;
	//$("p"+$("m"+i+"_pindex").value+"_name").value=$("Settings_name"+i).value;

	var P = $("Settings" + i).selectedIndex;

	for (var j = 0; j < (NumModes - 1); j++) {
		// update profile name in selection options
		$("Settings" + j).options[P].textContent = $("Settings_name" + i).value + "(" + ProfileWatts(P) + "W)";
		$("Settings" + j).options[P].value = $("Settings_name" + i).value;

		// update
		if ($("Settings" + j).selectedIndex == P) {
			$("Settings_name" + j).value = $("Settings" + j).options[P].value;
			$("P_name" + (j + 1)).textContent = $("Settings_name" + j).value;
			$("p" + P + "_name").value = $("Settings_name" + j).value;
		}
	}

	$("graphDiv" + (i + 2)).style.backgroundColor = "#FFFF00";
	Update_Mode(i + 1);
}



function EditTime(mInt, Edit) {
	if (Edit) {
		Update_Mode(mInt);
		$("TimeEdit" + mInt).value = addZero($("m" + (mInt - 1) + "_hr").value) + ":" + addZero($("m" + (mInt - 1) + "_min").value);
		$("Time" + mInt).style.display = "none";
		$("TimeEdit" + mInt).style.display = "inline-block";
		// device detection
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
			isMobile = true;
		}
		if (isMobile) {
			$("TimeEdit" + mInt).style.width = "50px";
		} else {
			$("TimeEdit" + mInt).style.width = "100px";
		}
		$("TimeEdit" + mInt).focus();
		$("TimeEdit" + mInt).click();
	} else {
		if ($("TimeEdit" + mInt).value != "") {
			var list = $("TimeEdit" + mInt).value.split(":");
			if (($("m" + (mInt - 1) + "_hr").value != parseInt(list[0])) || ($("m" + (mInt - 1) + "_min").value != parseInt(list[1]))) {
				$("m" + (mInt - 1) + "_hr").value = parseInt(list[0]);
				$("m" + (mInt - 1) + "_min").value = parseInt(list[1]);
				$("Time" + (mInt)).innerHTML = formatTime($("m" + (mInt - 1) + "_hr").value, $("m" + (mInt - 1) + "_min").value);
				$("graphDiv" + (mInt + 1)).style.backgroundColor = "#FFFF00";
				//$("Time"+(mInt)).style.backgroundColor="#FFFF00";
				//graph[mInt].backgroundColor = "#FFFF00";
				//UpdateGraph_9();
			}
		}
		$("Time" + mInt).style.display = "inline-block";
		$("TimeEdit" + mInt).style.display = "none";
	}
}





function AddingMode() {
	$("NumOfModes").value = parseInt($("NumOfModes").value) + 1;
	$("VM").value = parseInt($("NumOfModes").value);
	ModGraph2();
	Update_Mode($("NumOfModes").value);
	$("graphDiv" + (parseInt($("NumOfModes").value) + 1)).style.backgroundColor = "#FFFF00";
}

function ModGraph2() {
	looping2 = false;
	ModGraph();
}

function ModGraph() {
	if (($("NumOfModes").value > -1) && ($("NumOfModes").value < 11)) {
		ValidModes = $("NumOfModes").value;
		ValidModes++;
		HidGraph();
	}
	if (ValidModes > 10) {
		$("myMenuBar").style.width = "20px";
	} else if (ValidModes > 9) {
		$("myMenuBar").style.width = "40px";
	} else if (ValidModes > 8) {
		$("myMenuBar").style.width = "60px";
	} else {
		$("myMenuBar").style.width = "80px";
	}

	if ($("NumOfModes").value > 9) {
		$("AddMode").style.display = "none";
	} else {
		$("AddMode").style.display = "";
	}
}


function BarGraph(ctx) {

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

	// Draw method updates the canvas with the current display
	var draw = function (arr) {

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
		if ($("ModelType").value == "Uno") {
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

			if ($("ModelType").value == "Uno") {
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

	};

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
