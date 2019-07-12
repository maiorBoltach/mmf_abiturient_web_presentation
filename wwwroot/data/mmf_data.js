MMF = {
    initMMF2017budgetCharts: function () {

        dataMMF2017budgetChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                // производство
                [256, 204, 266, 226, 274, 260, 321, 330],
                // педы
                [223, 182, 196, 147, 240, 214, 288, 307],
                // мобилки
                [300, 259, 317, 276, 306, 304, 334, 342],
                // механика
                [250, 186, 250, 162, 248, 248, 293, 307],
                // конструкторы
                [254, 192, 272, 190, 272, 241, 314, 313],
                // км
                [296, 257, 315, 291, 308, 309, 336, 342],
                // вебы
                [300, 259, 317, 311, 316, 328, 342, 350],
                // экономы
                [282, 190, 285, 253, 285, 285, 315, 326]
            ]
        };

        optionsMMF2017budgetChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 150,
            high: 350,
            showPoint: true,
            height: '300px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]

        };


        var colouredBarsChart = new Chartist.Line('#MMF2017budgetChart', dataMMF2017budgetChart, optionsMMF2017budgetChart);

        md.startAnimationForLineChart(colouredBarsChart);
    },

    initMMF2017paidCharts: function () {

        dataMMF2017paidChart = {
            labels: ['\'13', '\'14', '\'15', '\'16', '\'17'],
            series: [
                [287, 385, 490, 554, 586],
                [67, 152, 143, 287, 335],
                [230, 13, 167, 10, 29]
            ]
        };

        optionsMMF2017paidChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 0,
            high: 1000,
            showPoint: true,
            height: '300px'
        };


        var colouredBarsChart = new Chartist.Line('#dataMMF2017paidChart', dataMMF2017paidChart, optionsMMF2017paidChart);

        md.startAnimationForLineChart(colouredBarsChart);
    },
    initWebChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataWebChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [300, 259, 317, 311, 316, 328, 342, 350],
                [NaN, NaN, NaN, NaN, NaN, 208, 273, 285]
            ]
        };

        optionsWebChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 360,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var WebChart = new Chartist.Line('#WebChart', dataWebChart, optionsWebChart);
        md.startAnimationForLineChart(WebChart);
    },

    initMobileChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataMobileChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [300, 259, 317, 276, 306, 304, 334, 342],
                [NaN, NaN, NaN, NaN, NaN, 195, 254, 278]
            ]
        };

        optionsMobileChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 360,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var MobileChart = new Chartist.Line('#MobileChart', dataMobileChart, optionsMobileChart);
        md.startAnimationForLineChart(MobileChart);
    },

    initTeachersChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataTeachersChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [223, 182, 196, 147, 240, 214, 288, 307],
            ]
        };

        optionsTeachersChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 130,
            high: 300,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var TeachersChart = new Chartist.Line('#TeachersChart', dataTeachersChart, optionsTeachersChart);
        md.startAnimationForLineChart(TeachersChart);
    },

    initKMChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataKMChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [296, 257, 315, 291, 308, 309, 336, 342],
            ]
        };

        optionsKMChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 250,
            high: 350,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var KMChart = new Chartist.Line('#KMChart', dataKMChart, optionsKMChart);
        md.startAnimationForLineChart(KMChart);
    },

    initConstructorsChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataConstructorsChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [254, 192, 272, 190, 272, 241, 314, 313],
            ]
        };

        optionsConstructorsChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 350,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var ConstructorsChart = new Chartist.Line('#ConstructorsChart', dataConstructorsChart, optionsConstructorsChart);
        md.startAnimationForLineChart(ConstructorsChart);
    },

    initEconomyChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataEconomyChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [282, 190, 285, 253, 285, 285, 315, 326]
            ]
        };

        optionsEconomyChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 350,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var EconomyChart = new Chartist.Line('#EconomyChart', dataEconomyChart, optionsEconomyChart);
        md.startAnimationForLineChart(EconomyChart);
    },

    initMechanicsChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataMechanicsChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [250, 186, 250, 162, 248, 248, 293, 307],
            ]
        };

        optionsMechanicsChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 350,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var MechanicsChart = new Chartist.Line('#MechanicsChart', dataMechanicsChart, optionsMechanicsChart);
        md.startAnimationForLineChart(MechanicsChart);
    },

    initProductionChart: function() {

        /* ----------==========     Daily Sales Chart initialization    ==========---------- */

        dataProductionChart = {
            labels: ['\'11', '\'12', '\'13', '\'14', '\'15', '\'16', '\'17', '\'18'],
            series: [
                [256, 204, 266, 226, 274, 260, 321, 330],
            ]
        };

        optionsProductionChart = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 10
            }),
            axisY: {
                showGrid: true,
                offset: 40
            },
            axisX: {
                showGrid: false,
            },
            low: 180,
            high: 350,
            showPoint: true,
            height: '200px',
            plugins: [
                Chartist.plugins.ctPointLabels({
                    textAnchor: 'right'
                })
            ]
        };


        var ProductionChart = new Chartist.Line('#ProductionChart', dataProductionChart, optionsProductionChart);
        md.startAnimationForLineChart(ProductionChart);
    }

};