import { HtmlHelper } from "./htmlHelper.js";
import { MobileHelper } from "./mobileHelper.js";

export class GraphHelper {
    constructor(model, debugEnabled) {
        this.ctx = [];
        this.graph = [];
        this.model = model;
        this.debugEnabled = debugEnabled;
        this.htmlHelper = new HtmlHelper();
        this.mobileHelper = new MobileHelper(debugEnabled);
    }

    createCanvas(elementId) {
        var div = $(elementId);
        var canvas = document.createElement('canvas');
        var ctx;

        div.append(canvas);

        console.log("appended canvas");

        if (typeof G_vmlCanvasManager !== 'undefined') {
            canvas = G_vmlCanvasManager.initElement(canvas);
        }
        else {
            console.log("canvas manager was undefined.");
        }

        ctx = canvas.getContext("2d");
        return ctx;
    }

    initGraph() {
        for (var i = 0; i < this.htmlHelper.numModes; i++) {
            var value = `graphDiv${(i + 1)}`;
            this.ctx[i] = this.createCanvas(value);
            console.log("canvas created");
            this.graph[i] = new BarGraph(ctx[i]);
            this.graph[i].width = 45;
            this.graph[i].height = 50;
            this.graph[i].margin = 0;
            this.graph[i].backgroundColor = "LightGray";
        }
        $("status").innerHTML = "Status: Retrieving settings...";
    }

    graphInit() {
        this.initGraph();
        $("status").innerHTML = "Status: Retrieving menu...";

        // init
        new_values_p("p0_name=Maintenance,p0_ch0=0,p0_cf0=0,p0_ch1=0,p0_cf1=0,p0_ch2=0,p0_cf2=0,p0_ch3=200,p0_cf3=0,p0_ch4=200,p0_cf4=0,p0_ch5=50,p0_cf5=0,p0_ch6=50,p0_cf6=0,p0_ch7=150,p0_cf7=0,p0_ch8=200,p0_cf8=0,p1_name=Photo SPS,p1_ch0=800,p1_cf0=0,p1_ch1=1023,p1_cf1=0,p1_ch2=1023,p1_cf2=0,p1_ch3=1023,p1_cf3=0,p1_ch4=1023,p1_cf4=0,p1_ch5=100,p1_cf5=0,p1_ch6=100,p1_cf6=0,p1_ch7=200,p1_cf7=0,p1_ch8=300,p1_cf8=0,p2_name=Photo LPS,p2_ch0=537,p2_cf0=0,p2_ch1=691,p2_cf1=0,p2_ch2=745,p2_cf2=0,p2_ch3=900,p2_cf3=0,p2_ch4=745,p2_cf4=0,p2_ch5=25,p2_cf5=0,p2_ch6=25,p2_cf6=0,p2_ch7=25,p2_cf7=0,p2_ch8=50,p2_cf8=0,p3_name=Blue+,p3_ch0=650,p3_cf0=0,p3_ch1=800,p3_cf1=0,p3_ch2=800,p3_cf2=0,p3_ch3=1023,p3_cf3=0,p3_ch4=650,p3_cf4=0,p3_ch5=30,p3_cf5=0,p3_ch6=30,p3_cf6=0,p3_ch7=30,p3_cf7=0,p3_ch8=30,p3_cf8=0,p4_name=RB+,p4_ch0=100,p4_cf0=0,p4_ch1=250,p4_cf1=0,p4_ch2=250,p4_cf2=0,p4_ch3=450,p4_cf3=0,p4_ch4=100,p4_cf4=0,p4_ch5=0,p4_cf5=0,p4_ch6=0,p4_cf6=0,p4_ch7=0,p4_cf7=0,p4_ch8=0,p4_cf8=0,p5_name=UV+,p5_ch0=700,p5_cf0=0,p5_ch1=900,p5_cf1=0,p5_ch2=0,p5_cf2=0,p5_ch3=0,p5_cf3=0,p5_ch4=0,p5_cf4=0,p5_ch5=0,p5_cf5=0,p5_ch6=0,p5_cf6=0,p5_ch7=0,p5_cf7=0,p5_ch8=0,p5_cf8=0,p6_name=Sunrise_v2,p6_ch0=0,p6_cf0=0,p6_ch1=0,p6_cf1=0,p6_ch2=0,p6_cf2=0,p6_ch3=100,p6_cf3=0,p6_ch4=0,p6_cf4=0,p6_ch5=0,p6_cf5=0,p6_ch6=15,p6_cf6=0,p6_ch7=20,p6_cf7=0,p6_ch8=0,p6_cf8=0,p7_name=Early_v2,p7_ch0=0,p7_cf0=0,p7_ch1=100,p7_cf1=0,p7_ch2=100,p7_cf2=0,p7_ch3=450,p7_cf3=0,p7_ch4=0,p7_cf4=0,p7_ch5=0,p7_cf5=0,p7_ch6=0,p7_cf6=0,p7_ch7=0,p7_cf7=0,p7_ch8=0,p7_cf8=0,p8_name=Morning_v2,p8_ch0=650,p8_cf0=0,p8_ch1=800,p8_cf1=0,p8_ch2=800,p8_cf2=0,p8_ch3=1023,p8_cf3=0,p8_ch4=650,p8_cf4=0,p8_ch5=30,p8_cf5=0,p8_ch6=30,p8_cf6=0,p8_ch7=30,p8_cf7=0,p8_ch8=30,p8_cf8=0,p9_name=Day+,p9_ch0=725,p9_cf0=0,p9_ch1=1023,p9_cf1=0,p9_ch2=1023,p9_cf2=0,p9_ch3=1023,p9_cf3=0,p9_ch4=1023,p9_cf4=0,p9_ch5=70,p9_cf5=0,p9_ch6=70,p9_cf6=0,p9_ch7=70,p9_cf7=0,p9_ch8=150,p9_cf8=0,p10_name=Peak,p10_ch0=800,p10_cf0=1,p10_ch1=1023,p10_cf1=1,p10_ch2=1023,p10_cf2=1,p10_ch3=1023,p10_cf3=1,p10_ch4=1023,p10_cf4=1,p10_ch5=100,p10_cf5=5,p10_ch6=100,p10_cf6=5,p10_ch7=200,p10_cf7=5,p10_ch8=300,p10_cf8=5,p11_name=After_v2,p11_ch0=775,p11_cf0=0,p11_ch1=1023,p11_cf1=0,p11_ch2=1023,p11_cf2=0,p11_ch3=1023,p11_cf3=0,p11_ch4=1023,p11_cf4=0,p11_ch5=70,p11_cf5=0,p11_ch6=70,p11_cf6=0,p11_ch7=70,p11_cf7=0,p11_ch8=150,p11_cf8=0,p12_name=Evening_v2,p12_ch0=650,p12_cf0=0,p12_ch1=800,p12_cf1=0,p12_ch2=800,p12_cf2=0,p12_ch3=1023,p12_cf3=0,p12_ch4=650,p12_cf4=0,p12_ch5=30,p12_cf5=0,p12_ch6=30,p12_cf6=0,p12_ch7=30,p12_cf7=0,p12_ch8=30,p12_cf8=0,p13_name=Night_v2,p13_ch0=100,p13_cf0=0,p13_ch1=350,p13_cf1=0,p13_ch2=350,p13_cf2=0,p13_ch3=600,p13_cf3=0,p13_ch4=150,p13_cf4=0,p13_ch5=0,p13_cf5=0,p13_ch6=0,p13_cf6=0,p13_ch7=0,p13_cf7=0,p13_ch8=0,p13_cf8=0,p14_name=Moon,p14_ch0=0,p14_cf0=0,p14_ch1=0,p14_cf1=0,p14_ch2=0,p14_cf2=0,p14_ch3=30,p14_cf3=0,p14_ch4=15,p14_cf4=0,p14_ch5=0,p14_cf5=0,p14_ch6=0,p14_cf6=0,p14_ch7=0,p14_cf7=0,p14_ch8=0,p14_cf8=0,p15_name=Day LPS,p15_ch0=500,p15_cf0=0,p15_ch1=500,p15_cf1=0,p15_ch2=500,p15_cf2=0,p15_ch3=700,p15_cf3=1,p15_ch4=400,p15_cf4=0,p15_ch5=25,p15_cf5=0,p15_ch6=25,p15_cf6=0,p15_ch7=25,p15_cf7=0,p15_ch8=50,p15_cf8=0,p16_name=Blue LPS,p16_ch0=350,p16_cf0=0,p16_ch1=350,p16_cf1=0,p16_ch2=350,p16_cf2=0,p16_ch3=600,p16_cf3=0,p16_ch4=350,p16_cf4=0,p16_ch5=20,p16_cf5=0,p16_ch6=20,p16_cf6=0,p16_ch7=20,p16_cf7=0,p16_ch8=20,p16_cf8=0,p17_name=Peak LPS,p17_ch0=600,p17_cf0=0,p17_ch1=600,p17_cf1=0,p17_ch2=600,p17_cf2=0,p17_ch3=850,p17_cf3=0,p17_ch4=500,p17_cf4=0,p17_ch5=50,p17_cf5=0,p17_ch6=50,p17_cf6=0,p17_ch7=70,p17_cf7=0,p17_ch8=100,p17_cf8=0,p18_name=Profile_19,p18_ch0=0,p18_cf0=0,p18_ch1=0,p18_cf1=0,p18_ch2=0,p18_cf2=0,p18_ch3=0,p18_cf3=0,p18_ch4=0,p18_cf4=0,p18_ch5=0,p18_cf5=0,p18_ch6=0,p18_cf6=0,p18_ch7=0,p18_cf7=0,p18_ch8=0,p18_cf8=0,p19_name=Profile_20,p19_ch0=0,p19_cf0=0,p19_ch1=0,p19_cf1=0,p19_ch2=0,p19_cf2=0,p19_ch3=0,p19_cf3=0,p19_ch4=0,p19_cf4=0,p19_ch5=0,p19_cf5=0,p19_ch6=0,p19_cf6=0,p19_ch7=0,p19_cf7=0,p19_ch8=0,p19_cf8=0,");
        new_values_now("nowch0=588,nowch1=588,nowch2=588,nowch3=588,nowch4=588,nowch5=89,nowch6=89,nowch7=152,nowch8=245,cMoon=13,chr=16,cmin=11,cCloud=0,cMode=After - 0% Cloud,Ver=3.00");
        new_values_9("m0_pindex=6,m0_hr=7,m0_min=30,m0_rate=15,m0_name=Sunrise,m0_master=100,m1_pindex=4,m1_hr=7,m1_min=45,m1_rate=5,m1_name=Early,m1_master=100,m2_pindex=3,m2_hr=8,m2_min=0,m2_rate=120,m2_name=Morning,m2_master=100,m3_pindex=9,m3_hr=12,m3_min=0,m3_rate=30,m3_name=Day,m3_master=100,m4_pindex=10,m4_hr=14,m4_min=0,m4_rate=30,m4_name=Peak,m4_master=100,m5_pindex=9,m5_hr=16,m5_min=0,m5_rate=30,m5_name=After,m5_master=100,m6_pindex=3,m6_hr=18,m6_min=0,m6_rate=60,m6_name=Evening,m6_master=100,m7_pindex=4,m7_hr=20,m7_min=0,m7_rate=30,m7_name=Night,m7_master=100,m8_pindex=14,m8_hr=22,m8_min=30,m8_rate=2,m8_name=Moon,m8_master=100,m9_pindex=15,m9_hr=22,m9_min=30,m9_rate=2,m9_name=Moon,m9_master=100,shr=2,smin=15,TZ=-8,ADLS=0,SelectedDLS=USA,MaxCloud=0,AccPercent=94.45,AccDays=7.00,VM=9,FanMode=0,m0_cindex=0,m1_cindex=1,m2_cindex=2,m3_cindex=3,m4_cindex=4,m5_cindex=5,ModelType=Uno,");

        if (this.debugEnabled === false) {
            fetch('http://' + curURL + '/profiles.cfg', 'GET', new_values_p);
            fetch('http://' + curURL + '/now.cfg', 'GET', new_values_now);
            fetch('http://' + curURL + '/settings3.cfg', 'GET', new_values_9);
        }

        //setTimeout(SetHeader, 650);
    }

    genGraph() {
        var graphTimeNode;
        var graphPeriodNode;
        var ctn = $("graphAll");
        this.htmlHelper.emptyCtn(ctn);

        var graphnode = document.createElement("div");
        graphnode.style.display = "inline-block";
        graphnode.setAttribute("onClick", "Update_Mode(0)");

        var graphsubnode = document.createElement("div");
        graphsubnode.id = "graphDiv1";
        graphnode.append(graphsubnode);
        graphPeriodNode = document.createElement("div");
        graphPeriodNode.id = "P_name0";
        graphPeriodNode.className = "auto-style5";
        graphPeriodNode.textContent = "test0";
        graphPeriodNode.style.visibility = "hidden	";
        graphnode.append(graphPeriodNode);
        graphsubnode = document.createElement("div");
        graphsubnode.id = "Time0";
        graphsubnode.className = "auto-style5";
        graphsubnode.textContent = "10:20p";
        graphnode.append(graphsubnode);

        ctn.append(graphnode);

        var textnode = document.createElement("text");
        textnode.textContent = "  ";

        ctn.append(textnode);


        for (var i = 1; i < this.htmlHelper.numModes; i++) {
            graphnode = document.createElement("div");
            graphnode.style.display = "inline-block";
            //graphnode.style.display="none";
            //graphnode.setAttribute( "onClick", "Update_Mode("+i+")" );
            //graphnode.setAttribute( "onClick", "dbltap("+i+")" );
            //graphnode.setAttribute( "ondblClick", "Update2Now("+i+")" );
            graphsubnode = document.createElement("div");
            graphsubnode.id = "graphDiv" + (i + 1);
            graphsubnode.setAttribute("onClick", "dbltap(" + i + ")");
            graphnode.append(graphsubnode);

            graphPeriodNode = document.createElement("div");
            graphPeriodNode.id = "P_name" + (i);
            graphPeriodNode.className = "auto-style5";
            graphPeriodNode.textContent = "test" + (i);
            graphPeriodNode.style.width = "50px";
            graphnode.append(graphPeriodNode);

            graphsubnode = document.createElement("div");
            graphsubnode.id = "Time" + (i);
            graphsubnode.className = "auto-style5";
            graphsubnode.textContent = "11:59p";
            graphsubnode.setAttribute("onClick", "EditTime(" + i + ",1)");
            graphnode.append(graphsubnode);

            if (i != 0) {
                graphTimeNode = document.createElement("input");
                graphTimeNode.id = "TimeEdit" + (i);
                graphTimeNode.type = "time";
                graphsubnode.className = "auto-style5";
                graphTimeNode.setAttribute("onfocusout", "EditTime(" + i + ",0)");
                if (this.mobileHelper.isMobile) {
                    graphTimeNode.setAttribute("onchange", "EditTime(" + i + ",0)");
                }
                graphTimeNode.style.display = "none";
                graphnode.append(graphTimeNode);

            }

            ctn.append(graphnode);
        }

        graphnode = document.createElement("img");
        graphnode.style.display = "inline-block";
        graphnode.id = "AddMode";
        graphnode.className = "addBar";
        graphnode.src = "add-column.png";
        graphnode.setAttribute("onClick", "AddingMode()");
        ctn.append(graphnode);

        this.hideGraph();
    }

    hideGraph() {
        var ctn = $("graphAll");

        for (var i = 1; i < this.htmlHelper.validModes; i++) {
            $(ctn.children()[i + 1]).show();
        }
        for (var i = this.htmlHelper.validModes; i < this.htmlHelper.numModes; i++) {
            $(ctn.children[i + 1]).hide();
        }
    }

    label_lv() {
        var element = $('input[name="N1"]');
        if (element.is(':visible')) {
            for (var i = 0; i < 9; i++) {
                this.htmlHelper.toggleElementVisibility(`Per${(i + 1)}`, false);
                this.htmlHelper.toggleElementVisibility(`pLabel${(i + 1)}`, false);
                this.htmlHelper.toggleElementVisibility(`N${(i + 1)}`, true);
                this.htmlHelper.toggleElementVisibility(`Label${(i + 1)}`, true);
            }
        } else {
            for (var i = 0; i < 9; i++) {
                this.htmlHelper.toggleElementVisibility(`Per${(i + 1)}`, true);
                this.htmlHelper.toggleElementVisibility(`pLabel${(i + 1)}`, true);
                this.htmlHelper.toggleElementVisibility(`N${(i + 1)}`, false);
                this.htmlHelper.toggleElementVisibility(`Label${(i + 1)}`, false);
            }
        }
    }
}