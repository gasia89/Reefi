
function addMenu() {
	var ctn = $("myMenu");
	var aqnum = $("GroupLEDCtn");
	emptyCtn(ctn);

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


function GenCustomBtn() {
	var ctn = $("cBtnsList");
	var divnode;
	var subnode;

	for (var i = 0; i < 6; i++) {
		divnode = document.createElement("div");
		divnode.id = "divcbtn" + i;
		subnode = document.createElement("input");
		subnode.type = "button";
		subnode.value = "Manual" + (i + 1);
		subnode.style.height = "30px";
		subnode.id = "cbtn" + i;
		subnode.setAttribute("onclick", "CustomBtn(" + i + ")");
		divnode.appendChild(subnode);
		subnode = document.createElement("p");
		divnode.appendChild(subnode);
		ctn.appendChild(divnode);
	}
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


function GenSelection() {
	var options;
	var subnode;
	var node;
	var ctn = $("SettingsAll");
	emptyCtn(ctn);

	node = document.createElement("label");
	node.id = "setting_label";
	node.innerText = "Selected Profile:";
	ctn.appendChild(node);


	for (var j = 0; j < NumModes; j++) {
		node = document.createElement("div");
		node.id = "divselect" + j;
		node.className = "select-editable";

		subnode = document.createElement("select");
		subnode.id = "Settings" + j;
		subnode.setAttribute("onchange", "UpdateSelectName(" + j + ")");
		subnode.style.display = "none";

		for (var i = 0; i < ProfilesMax; i++) {
			options = document.createElement("option");
			options.text = "Profile " + (i + 1);
			subnode.add(options);
		}

		options = document.createElement("option");
		options.text = "+Add";
		options.style.display = "none";
		subnode.add(options);

		node.appendChild(subnode);

		subnode = document.createElement("input");
		subnode.id = "Settings_name" + j;
		subnode.setAttribute("oninput", "UpdatePname(" + j + ")");
		subnode.type = "text";
		node.appendChild(subnode);
		ctn.appendChild(node);
	}

	node = document.createElement("input");
	node.id = "selectBtn";
	node.type = "button";
	node.value = "Copy";
	node.style.display = "inline-block";
	node.setAttribute("onclick", "SelectCopyPaste()");
	ctn.appendChild(node);

	node = document.createElement("text");
	node.innerText = " ";
	ctn.appendChild(node);

	node = document.createElement("input");
	node.id = "cancelBtn";
	node.type = "button";
	node.value = "Cancel";
	node.style.display = "none";
	node.setAttribute("onclick", "SelectCancel()");
	ctn.appendChild(node);

	node = document.createElement("text");
	node.innerText = " ";
	ctn.appendChild(node);

	node = document.createElement("input");
	node.id = "deleteBtn";
	node.type = "button";
	node.value = "Del";
	node.style.display = "inline-block";
	node.setAttribute("onclick", "SelectDelete()");
	ctn.appendChild(node);

	Selection(modes.indexOf(Mode));
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

function Selection(mInt) {
	$("SettingsAll").style.display = "none";
	for (var i = 0; i < NumModes; i++) {
		$("Settings" + i).style.display = "none";
		$("Settings_name" + i).style.display = "none";
		$("divselect" + i).style.display = "none";
	}
	if (mInt > 0) {
		$("SettingsAll").style.display = "";
		$("Settings" + (mInt - 1)).style.display = "";
		$("Settings_name" + (mInt - 1)).style.display = "";
		$("divselect" + (mInt - 1)).style.display = "inline-block";

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

function GenGraph() {
	var graphTimeNode;
	var graphPeriodNode;
	var ctn = $("graphAll");
	emptyCtn(ctn);

	var graphnode = document.createElement("div");
	graphnode.style.display = "inline-block";
	graphnode.setAttribute("onClick", "Update_Mode(0)");

	var graphsubnode = document.createElement("div");
	graphsubnode.id = "graphDiv1";
	graphnode.appendChild(graphsubnode);
	graphPeriodNode = document.createElement("div");
	graphPeriodNode.id = "P_name0";
	graphPeriodNode.className = "auto-style5";
	graphPeriodNode.textContent = "test0";
	graphPeriodNode.style.visibility = "hidden	";
	graphnode.appendChild(graphPeriodNode);
	graphsubnode = document.createElement("div");
	graphsubnode.id = "Time0";
	graphsubnode.className = "auto-style5";
	graphsubnode.textContent = "10:20p";
	graphnode.appendChild(graphsubnode);

	ctn.appendChild(graphnode);

	var textnode = document.createElement("text");
	textnode.textContent = "  ";

	ctn.appendChild(textnode);


	for (var i = 1; i < NumModes; i++) {
		graphnode = document.createElement("div");
		graphnode.style.display = "inline-block";
		//graphnode.style.display="none";
		//graphnode.setAttribute( "onClick", "Update_Mode("+i+")" );
		//graphnode.setAttribute( "onClick", "dbltap("+i+")" );
		//graphnode.setAttribute( "ondblClick", "Update2Now("+i+")" );
		graphsubnode = document.createElement("div");
		graphsubnode.id = "graphDiv" + (i + 1);
		graphsubnode.setAttribute("onClick", "dbltap(" + i + ")");
		graphnode.appendChild(graphsubnode);

		graphPeriodNode = document.createElement("div");
		graphPeriodNode.id = "P_name" + (i);
		graphPeriodNode.className = "auto-style5";
		graphPeriodNode.textContent = "test" + (i);
		graphPeriodNode.style.width = "50px";
		graphnode.appendChild(graphPeriodNode);

		graphsubnode = document.createElement("div");
		graphsubnode.id = "Time" + (i);
		graphsubnode.className = "auto-style5";
		graphsubnode.textContent = "11:59p";
		graphsubnode.setAttribute("onClick", "EditTime(" + i + ",1)");
		graphnode.appendChild(graphsubnode);

		if (i != 0) {
			graphTimeNode = document.createElement("input");
			graphTimeNode.id = "TimeEdit" + (i);
			graphTimeNode.type = "time";
			graphsubnode.className = "auto-style5";
			graphTimeNode.setAttribute("onfocusout", "EditTime(" + i + ",0)");
			if (_isMobile) {
				graphTimeNode.setAttribute("onchange", "EditTime(" + i + ",0)");
			}
			graphTimeNode.style.display = "none";
			graphnode.appendChild(graphTimeNode);

		}

		ctn.appendChild(graphnode);
	}

	graphnode = document.createElement("img");
	graphnode.style.display = "inline-block";
	graphnode.id = "AddMode";
	graphnode.className = "addBar";
	graphnode.src = "add-column.png";
	graphnode.setAttribute("onClick", "AddingMode()");
	ctn.appendChild(graphnode);


	HidGraph();
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
			_isMobile = true;
		}
		if (_isMobile) {
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



function HidGraph() {
	var ctn = $("graphAll");

	for (var i = 1; i < ValidModes; i++) {
		ctn.childNodes[i + 1].style.display = "inline-block";
	}
	for (var i = ValidModes; i < NumModes; i++) {
		ctn.childNodes[i + 1].style.display = "none";
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