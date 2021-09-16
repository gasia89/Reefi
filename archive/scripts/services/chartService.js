export class ChartService {
    constructor(modelType) {
        this.myCharts = [];
    }

    setup(modelType) {
        if (modelType === "Uno") {
            this.coolWhiteChannelMaxWattage = 22;
            this.warmWhiteChannelMaxWattage = 22;
            this.amberChannelMaxWattage = 22;
            this.limeChannelMaxWattage = 22;
            this.blueChannelMaxWattage = 22;
            this.royalBlueChannelMaxWattage = 22;
            this.violetChannelMaxWattage = 22;
            this.ir420ChannelMaxWattage = 22;
            this.ir400ChannelMaxWattage = 22;
        }
        else if (modelType === "DE") {
            this.coolWhiteChannelMaxWattage = 44;
            this.warmWhiteChannelMaxWattage = 44;
            this.amberChannelMaxWattage = 44;
            this.limeChannelMaxWattage = 44;
            this.blueChannelMaxWattage = 44;
            this.royalBlueChannelMaxWattage = 44;
            this.violetChannelMaxWattage = 44;
            this.ir420ChannelMaxWattage = 44;
            this.ir400ChannelMaxWattage = 44;
        }

        this.coolWhiteChannelCurrentWattage = 0;
        this.warmWhiteChannelCurrentWattage = 0;
        this.amberChannelCurrentWattage = 0;
        this.limeChannelCurrentWattage = 0;
        this.blueChannelCurrentWattage = 0;
        this.royalBlueChannelCurrentWattage = 0;
        this.violetChannelCurrentWattage = 0;
        this.ir420ChannelCurrentWattage = 0;
        this.ir400ChannelCurrentWattage = 0;
    }

    generateSampleLedData() {
        var coolWhiteChannelPowerPercent = 2;
        var warmWhiteChannelPowerPercent = 2;
        var amberChannelPowerPercent = 2;
        var limeChannelPowerPercent = 2;
        var blueChannelPowerPercent = 34.2;
        var royalBlueChannelPowerPercent = 58.7;
        var violetChannelPowerPercent = 34.2;
        var ir420ChannelPowerPercent = 34.2;
        var ir400ChannelPowerPercent = 34.2;

        return [ir400ChannelPowerPercent, ir420ChannelPowerPercent, violetChannelPowerPercent, royalBlueChannelPowerPercent, blueChannelPowerPercent, limeChannelPowerPercent, amberChannelPowerPercent, warmWhiteChannelPowerPercent, coolWhiteChannelPowerPercent];
    }

    updateLedCurrentWattage(ledDataArray) {
        this.coolWhiteChannelCurrentWattage = ledDataArray[0];
        this.warmWhiteChannelCurrentWattage = ledDataArray[1];
        this.amberChannelCurrentWattage = ledDataArray[2];
        this.limeChannelCurrentWattage = ledDataArray[3];
        this.blueChannelCurrentWattage = ledDataArray[4];
        this.royalBlueChannelCurrentWattage = ledDataArray[5];
        this.violetChannelCurrentWattage = ledDataArray[6];
        this.ir420ChannelCurrentWattage = ledDataArray[7];
        this.ir400ChannelCurrentWattage = ledDataArray[8];
    }

    getCurrentConsumption() {
        return [Math.round(this.coolWhiteChannelCurrentWattage / this.coolWhiteChannelMaxWattage)]
    }



    createDatasetForLed(ledName, )

    // https://canvasjs.com/docs/charts/chart-types/html5-stacked-column-chart/
    createStackedBarChart(chartTargetId, labelObj, dataObj, legendObj) {
        var chart = new CanvasJS.Chart(chartTargetId, {
            title: {
                text: labelObj.titleText
            },
            axisY: {
                title: labelObj.axisYTitle,
                valueFormatString: labelObj.axisYFormat
            },
            data: [
                {
                    type: "stackedColumn",
                    legendText: legendObj.axisYLegendText,
                    showInLegend: legendObj.axisYShowLegend,
                    dataPoints: dataObj.dataPoints
                },
                {
                    type: "stackedColumn",
                    legendText: legendObj.axisYLegendText,
                    showInLegend: legendObj.axisYShowLegend,
                    dataPoints: dataObj.dataPoints
                }
            ]
        });

        return chart;
    }

    generateWattageChart() {

    }

    calculateWattageFromSliderValue(slider) {
        switch (slider) {

        }
    }

    generateChartColumn(columnData) {

    }



    generateChart(chartTargetId, data, options) {
        /*
        This is worth an explanation, 'data', is expected to have a particular format.
        [
            {
                'datasetLabel': 'DataLabel_1',
                'dataset': [ 30, 200, 100, 400, 150, 250 ]
            },
            {
                'datasetLabel': 'DataLabel_2',
                'dataset': [ 130, 100, 140, 200, 150, 50 ]
            },
        ]

        options is a dynamic object. Use it for what you need.
        {
            'showLegend': true,
            'type': 'bar'
        }
        */
        console.log(options.type);

        var columns = [];

        for (var i = 0; i < data.length; i++) {
            var column = [];
            column.push(data[i].datasetLabel);
            for (var a = 0; a < data[i].dataset.length; a++) {
                column.push(data[i].dataset[a]);
            }
            
            columns.push(column);
        }

        console.log(columns)
        var chartInstance = c3.generate({
            data: {
                columns: columns,
                type: options.type
            },
            legend: {
                show: options.showLegend
            },
            bar: {
                width: {
                    ratio: 0.8 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            }
        });

        this.myCharts.push({ chartTargetId, chartInstance });

        return chartInstance;
    }
}