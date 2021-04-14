export class LedPowerConsumptionChart {
    constructor(title, modes, targetElementId) {
        this.modes = ["Now", "Sunrise", "MidDay", "Sunset", "Night", "Moon", "Mode6", "Mode7", "Mode8", "Mode9", "Mode10"];
        this.ledChannelNames = ["Cool White", "Warm White", "Amber", "Lime", "Blue", "Royal Blue", "Violet", "IR 420nm", "IR 400nm"];
        this.title = title;
        this.targetElementId = targetElementId;
        this.masterDataset = {};

        this.maintProfile = {
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
        };

        nowProfile = {
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
        };

        this.maintenanceProfile = {
            name: 'Maintenance',
            chArray: [0,0,0,200,200,50,50,150,200],
            cfArray: [0,0,0,0,0,0,0,0,0]
        }

        this.photoSpsProfile = {
            name: 'Photo SPS',
            chArray: [800,1023,1023,1023,1023,100,100,200,300],
            cfArray: [0,0,0,0,0,0,0,0,0]
        }

        //this.profiles = [
        //    { name = 'Maintenance', p0_ch0 = 0, p0_cf0 = 0, p0_ch1 = 0, p0_cf1 = 0, p0_ch2 = 0, p0_cf2 = 0, p0_ch3 = 200, p0_cf3 = 0, p0_ch4 = 200, p0_cf4 = 0, p0_ch5 = 50, p0_cf5 = 0, p0_ch6 = 50, p0_cf6 = 0, p0_ch7 = 150, p0_cf7 = 0, p0_ch8 = 200, p0_cf8 = 0 },
        //    [name = 'Photo SPS', p1_ch0 = 800, p1_cf0 = 0, p1_ch1 = 1023, p1_cf1 = 0, p1_ch2 = 1023, p1_cf2 = 0, p1_ch3 = 1023, p1_cf3 = 0, p1_ch4 = 1023, p1_cf4 = 0, p1_ch5 = 100, p1_cf5 = 0, p1_ch6 = 100, p1_cf6 = 0, p1_ch7 = 200, p1_cf7 = 0, p1_ch8 = 300, p1_cf8 = 0],
        //    [name = 'Photo LPS', p2_ch0 = 537, p2_cf0 = 0, p2_ch1 = 691, p2_cf1 = 0, p2_ch2 = 745, p2_cf2 = 0, p2_ch3 = 900, p2_cf3 = 0, p2_ch4 = 745, p2_cf4 = 0, p2_ch5 = 25, p2_cf5 = 0, p2_ch6 = 25, p2_cf6 = 0, p2_ch7 = 25, p2_cf7 = 0, p2_ch8 = 50, p2_cf8 = 0],
        //    [name = 'Blue +', p3_ch0 = 650, p3_cf0 = 0, p3_ch1 = 800, p3_cf1 = 0, p3_ch2 = 800, p3_cf2 = 0, p3_ch3 = 1023, p3_cf3 = 0, p3_ch4 = 650, p3_cf4 = 0, p3_ch5 = 30, p3_cf5 = 0, p3_ch6 = 30, p3_cf6 = 0, p3_ch7 = 30, p3_cf7 = 0, p3_ch8 = 30, p3_cf8 = 0],
        //    [name = 'RB +', p4_ch0 = 100, p4_cf0 = 0, p4_ch1 = 250, p4_cf1 = 0, p4_ch2 = 250, p4_cf2 = 0, p4_ch3 = 450, p4_cf3 = 0, p4_ch4 = 100, p4_cf4 = 0, p4_ch5 = 0, p4_cf5 = 0, p4_ch6 = 0, p4_cf6 = 0, p4_ch7 = 0, p4_cf7 = 0, p4_ch8 = 0, p4_cf8 = 0],
        //    [name = 'UV +', p5_ch0 = 700, p5_cf0 = 0, p5_ch1 = 900, p5_cf1 = 0, p5_ch2 = 0, p5_cf2 = 0, p5_ch3 = 0, p5_cf3 = 0, p5_ch4 = 0, p5_cf4 = 0, p5_ch5 = 0, p5_cf5 = 0, p5_ch6 = 0, p5_cf6 = 0, p5_ch7 = 0, p5_cf7 = 0, p5_ch8 = 0, p5_cf8 = 0],
        //    [name = 'Sunrise_v2', p6_ch0 = 0, p6_cf0 = 0, p6_ch1 = 0, p6_cf1 = 0, p6_ch2 = 0, p6_cf2 = 0, p6_ch3 = 100, p6_cf3 = 0, p6_ch4 = 0, p6_cf4 = 0, p6_ch5 = 0, p6_cf5 = 0, p6_ch6 = 15, p6_cf6 = 0, p6_ch7 = 20, p6_cf7 = 0, p6_ch8 = 0, p6_cf8 = 0],
        //    [name = 'Early_v2', p7_ch0 = 0, p7_cf0 = 0, p7_ch1 = 100, p7_cf1 = 0, p7_ch2 = 100, p7_cf2 = 0, p7_ch3 = 450, p7_cf3 = 0, p7_ch4 = 0, p7_cf4 = 0, p7_ch5 = 0, p7_cf5 = 0, p7_ch6 = 0, p7_cf6 = 0, p7_ch7 = 0, p7_cf7 = 0, p7_ch8 = 0, p7_cf8 = 0],
        //    [name = 'Morning_v2', p8_ch0 = 650, p8_cf0 = 0, p8_ch1 = 800, p8_cf1 = 0, p8_ch2 = 800, p8_cf2 = 0, p8_ch3 = 1023, p8_cf3 = 0, p8_ch4 = 650, p8_cf4 = 0, p8_ch5 = 30, p8_cf5 = 0, p8_ch6 = 30, p8_cf6 = 0, p8_ch7 = 30, p8_cf7 = 0, p8_ch8 = 30, p8_cf8 = 0],
        //    [name = 'Day +', p9_ch0 = 725, p9_cf0 = 0, p9_ch1 = 1023, p9_cf1 = 0, p9_ch2 = 1023, p9_cf2 = 0, p9_ch3 = 1023, p9_cf3 = 0, p9_ch4 = 1023, p9_cf4 = 0, p9_ch5 = 70, p9_cf5 = 0, p9_ch6 = 70, p9_cf6 = 0, p9_ch7 = 70, p9_cf7 = 0, p9_ch8 = 150, p9_cf8 = 0],
        //    [name = 'Peak', p10_ch0 = 800, p10_cf0 = 1, p10_ch1 = 1023, p10_cf1 = 1, p10_ch2 = 1023, p10_cf2 = 1, p10_ch3 = 1023, p10_cf3 = 1, p10_ch4 = 1023, p10_cf4 = 1, p10_ch5 = 100, p10_cf5 = 5, p10_ch6 = 100, p10_cf6 = 5, p10_ch7 = 200, p10_cf7 = 5, p10_ch8 = 300, p10_cf8 = 5],
        //    [name = 'After_v2', p11_ch0 = 775, p11_cf0 = 0, p11_ch1 = 1023, p11_cf1 = 0, p11_ch2 = 1023, p11_cf2 = 0, p11_ch3 = 1023, p11_cf3 = 0, p11_ch4 = 1023, p11_cf4 = 0, p11_ch5 = 70, p11_cf5 = 0, p11_ch6 = 70, p11_cf6 = 0, p11_ch7 = 70, p11_cf7 = 0, p11_ch8 = 150, p11_cf8 = 0],
        //    [name = 'Evening_v2', p12_ch0 = 650, p12_cf0 = 0, p12_ch1 = 800, p12_cf1 = 0, p12_ch2 = 800, p12_cf2 = 0, p12_ch3 = 1023, p12_cf3 = 0, p12_ch4 = 650, p12_cf4 = 0, p12_ch5 = 30, p12_cf5 = 0, p12_ch6 = 30, p12_cf6 = 0, p12_ch7 = 30, p12_cf7 = 0, p12_ch8 = 30, p12_cf8 = 0],
        //    [name = 'Night_v2', p13_ch0 = 100, p13_cf0 = 0, p13_ch1 = 350, p13_cf1 = 0, p13_ch2 = 350, p13_cf2 = 0, p13_ch3 = 600, p13_cf3 = 0, p13_ch4 = 150, p13_cf4 = 0, p13_ch5 = 0, p13_cf5 = 0, p13_ch6 = 0, p13_cf6 = 0, p13_ch7 = 0, p13_cf7 = 0, p13_ch8 = 0, p13_cf8 = 0],
        //    [name = 'Moon', p14_ch0 = 0, p14_cf0 = 0, p14_ch1 = 0, p14_cf1 = 0, p14_ch2 = 0, p14_cf2 = 0, p14_ch3 = 30, p14_cf3 = 0, p14_ch4 = 15, p14_cf4 = 0, p14_ch5 = 0, p14_cf5 = 0, p14_ch6 = 0, p14_cf6 = 0, p14_ch7 = 0, p14_cf7 = 0, p14_ch8 = 0, p14_cf8 = 0],
        //    [name = 'Day LPS', p15_ch0 = 500, p15_cf0 = 0, p15_ch1 = 500, p15_cf1 = 0, p15_ch2 = 500, p15_cf2 = 0, p15_ch3 = 700, p15_cf3 = 1, p15_ch4 = 400, p15_cf4 = 0, p15_ch5 = 25, p15_cf5 = 0, p15_ch6 = 25, p15_cf6 = 0, p15_ch7 = 25, p15_cf7 = 0, p15_ch8 = 50, p15_cf8 = 0],
        //    [name = 'Blue LPS', p16_ch0 = 350, p16_cf0 = 0, p16_ch1 = 350, p16_cf1 = 0, p16_ch2 = 350, p16_cf2 = 0, p16_ch3 = 600, p16_cf3 = 0, p16_ch4 = 350, p16_cf4 = 0, p16_ch5 = 20, p16_cf5 = 0, p16_ch6 = 20, p16_cf6 = 0, p16_ch7 = 20, p16_cf7 = 0, p16_ch8 = 20, p16_cf8 = 0],
        //    [name = 'Peak LPS', p17_ch0 = 600, p17_cf0 = 0, p17_ch1 = 600, p17_cf1 = 0, p17_ch2 = 600, p17_cf2 = 0, p17_ch3 = 850, p17_cf3 = 0, p17_ch4 = 500, p17_cf4 = 0, p17_ch5 = 50, p17_cf5 = 0, p17_ch6 = 50, p17_cf6 = 0, p17_ch7 = 70, p17_cf7 = 0, p17_ch8 = 100, p17_cf8 = 0],
        //    [name = 'Profile_19', p18_ch0 = 0, p18_cf0 = 0, p18_ch1 = 0, p18_cf1 = 0, p18_ch2 = 0, p18_cf2 = 0, p18_ch3 = 0, p18_cf3 = 0, p18_ch4 = 0, p18_cf4 = 0, p18_ch5 = 0, p18_cf5 = 0, p18_ch6 = 0, p18_cf6 = 0, p18_ch7 = 0, p18_cf7 = 0, p18_ch8 = 0, p18_cf8 = 0],
        //    [name = 'Profile_20', p19_ch0 = 0, p19_cf0 = 0, p19_ch1 = 0, p19_cf1 = 0, p19_ch2 = 0, p19_cf2 = 0, p19_ch3 = 0, p19_cf3 = 0, p19_ch4 = 0, p19_cf4 = 0, p19_ch5 = 0, p19_cf5 = 0, p19_ch6 = 0, p19_cf6 = 0, p19_ch7 = 0, p19_cf7 = 0, p19_ch8 = 0, p19_cf8 = 0
        //]
    }

    getValueAsPercentage(powerValue) {
        var percentage = 1023 / powerValue;

        return Math.round(percentage);
    }



    makeFakeDataset() {
        var ledNowData = 
    }

    generateSampleSliderValues() {
        // "Cool White", "Warm White", "Amber", "Lime", "Blue", "Royal Blue", "Violet", "IR 420nm", "IR 400nm"
        return [9.8, 6.8, 4.9, 4.9, 48.9, 83.1, 58.7, 58.7, 58.7];
    }

    generateNowChart() {
        this.clearDataset();
        this.appendDatasetToResults(this.generateSampleSliderValues());
        console.log(this.masterDataset);

        this.createStackedBarChart()
    }

    clearDataset() {
        // generate object structure of master.ch_1 -> .ch_9
        this.masterDataset = [];
        var i = 0;
        while (i <= this.ledChannelNames.length - 1) {
            this.masterDataset[modes[i]] = [];
            i++;
        }
    }

    appendDatasetToResults(currentDataset) {

        var i = 0;
        while (i <= this.ledChannelNames.length - 1) {
            // the current dataset order should match the LedChannelNames order above.
            // push off each value to its appropriate dataset on the masterDataset
            console.log(`${this.ledChannelNames[i]}: ${currentDataset[i]} %`);
            this.masterDataset[`Ch_${i + 1}`].push(currentDataset[i]);
            i++;
        }
    }

    generateDataColumns(rawData) {
        var data = [];
        for (var i = 0; i <= this.modes.length; i++) {
            data[this.modes[i]].type = "stackedColumn";
            data[this.modes[i]].legendText = this.modes[i];
            data[this.modes[i]].showInLegend = true;
            data[this.modes[i]].dataPoints = [];

            for (var x = 0; x <= rawData.length; x++) {
                var datapoint = {
                    y: rawData[x],
                    label: this.modes[i];
                }
                data[this.modes[i]].datapoints.push(datapoint);
            }
        }

        return data;
    }

    // https://canvasjs.com/docs/charts/chart-types/html5-stacked-column-chart/
    createStackedBarChart() {
        console.log(this.targetElementId);
        var chart = new CanvasJS.Chart(this.targetElementId, {
            title: {
                text: this.title
            },
            axisY: {
                title: "Now",
                valueFormatString: "W"
            },
            data: [
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[0],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[0]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[1],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[1]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[2],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[2]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[3],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[3]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[4],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[4]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[5],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[5]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[6],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[6]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[7],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[7]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[8],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[8]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[8],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[9]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[8],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[10]]
                },
                {
                    type: "stackedColumn",
                    legendText: this.ledChannelNames[8],
                    showInLegend: true,
                    dataPoints: this.masterDataset[this.modes[11]]
                }
            ]
        });

        return chart;
    }
}