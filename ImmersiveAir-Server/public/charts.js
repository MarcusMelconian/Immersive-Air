/* HOME GRAPHS */

const xlabels = [];
const ylabels1 = [];
const ylabels2 = [];
const ylabels3 = [];
const ylabels4 = [];
const ylabels5 = [];
const ylabels6 = [];

var timescale = 1;
var counter = 0;

const ctx = document.getElementById('chart1').getContext('2d');
const myChart = new Chart(ctx, {
type: 'line',
data: {
    labels: xlabels,
    datasets: [
        {
        label: '> 0.3um',
        data: ylabels1,
        fill: false,
        backgroundColor: 'rgb(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    },
    {
        label: '> 0.5um',
        data: ylabels2,
        fill: false,
        backgroundColor: 'rgba(0, 64, 255, 0.2)',
        borderColor: 'rgba(0, 64, 255, 1)',
        borderWidth: 1
    },
    {
        label: '> 1.0um',
        data: ylabels3,
        fill: false,
        backgroundColor: 'rgba(255, 153, 51, 0.2)',
        borderColor: 'rgba(255, 153, 51, 1)',
        borderWidth: 1
    },
    {
        label: '> 2.5um',
        data: ylabels4,
        fill: false,
        backgroundColor: 'rgba(71, 209, 71, 0.2)',
        borderColor: 'rgba(71, 209, 71, 1)',
        borderWidth: 1
    },
    {
        label: '> 5.0um',
        data: ylabels5,
        fill: false,
        backgroundColor: 'rgba(255, 77, 77, 0.2)',
        borderColor: 'rgba(255, 77, 77, 1)',
        borderWidth: 1
    },
    {
        label: '> 10um',
        data: ylabels6,
        fill: false,
        backgroundColor: 'rgba(0, 255, 191, 0.2)',
        borderColor: 'rgba(0, 255, 191, 1)',
        borderWidth: 1
    }
]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Particles per 0.1L air',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }],
        xAxes: [{
            ticks: {
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }]
    },
    title: {
        display: true,
        text: 'Particulate matter in the air by particle size',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});


function loadGraph(dataPoints = 20) {
    var difference = (fullData.length)-(dataPoints*timescale);
    if (difference < 0 ) { difference = 0;}

    for (let i=difference; i<fullData.length; i+=timescale) {
        xlabels.push(fullData[i]['time']);
        ylabels1.push(fullData[i]['particle1']);
        ylabels2.push(fullData[i]['particle2']);
        ylabels3.push(fullData[i]['particle3']);
        ylabels4.push(fullData[i]['particle4']);
        ylabels5.push(fullData[i]['particle5']);
        ylabels6.push(fullData[i]['particle6']);
    }
    myChart.update();
}


function updateGraph() {
    counter++;

    if (counter >= timescale) {
        xlabels.push(fullData[fullData.length - 1]['time']);
        ylabels1.push(fullData[fullData.length - 1]['particle1']);
        ylabels2.push(fullData[fullData.length - 1]['particle2']);
        ylabels3.push(fullData[fullData.length - 1]['particle3']);
        ylabels4.push(fullData[fullData.length - 1]['particle4']);
        ylabels5.push(fullData[fullData.length - 1]['particle5']);
        ylabels6.push(fullData[fullData.length - 1]['particle6']);
    
        xlabels.splice(0, 1);
        ylabels1.splice(0, 1);
        ylabels2.splice(0, 1);
        ylabels3.splice(0, 1);
        ylabels4.splice(0, 1);
        ylabels5.splice(0, 1);
        ylabels6.splice(0, 1);
    
        myChart.update();

        counter = 0;
    }
}


function dataChange(){
    var dataPoints = document.getElementById("points_val").value;
    console.log(timescale);

    xlabels.length = 0;
    ylabels1.length = 0;
    ylabels2.length = 0;
    ylabels3.length = 0;
    ylabels4.length = 0;
    ylabels5.length = 0;
    ylabels6.length = 0;

    //loadGraph(dataPoints);
    requestData(dataPoints, timescale, 1);
}


function timescaleChange() {
    timescale = parseInt(event.srcElement.id);
    counter = fullData.length%timescale;
    dataChange();
}


/* HOME GRAPH 2 */

const xlabels2 = [];
const ylabels7 = [];

var timescale2 = 1;
var counter2 = 0;

const ctx2 = document.getElementById('chart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
type: 'line',
data: {
    labels: xlabels2,
    datasets: [
        {
        label: 'eCO2',
        data: ylabels7,
        fill: false,
        backgroundColor: 'rgba(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    }
]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Parts per million (ppm)',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }],
        xAxes: [{
            ticks: {
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }]
    },
    title: {
        display: true,
        text: 'Equivalent calculated carbon-dioxide (eCO2) concentration',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});


function loadGraph2(dataPoints = 20) {
    var difference = (fullData.length)-(dataPoints*timescale2);
    if (difference < 0 ) { difference = 0;}

    for (let i=difference; i<fullData.length; i+=timescale2) {
        xlabels2.push(fullData[i]['time']);
        ylabels7.push(fullData[i]['co2']);
    }
    myChart2.update();
}


function updateGraph2() {
    counter2++;

    if (counter2 >= timescale2) {
        xlabels2.push(fullData[fullData.length - 1]['time']);
        ylabels7.push(fullData[fullData.length - 1]['co2']);
    
        xlabels2.splice(0, 1);
        ylabels7.splice(0, 1);
    
        myChart2.update();

        counter2 = 0;
    }
}


function dataChange2(){
    var dataPoints = document.getElementById("points_val2").value;
    console.log(timescale2);

    xlabels2.length = 0;
    ylabels7.length = 0;

    requestData(dataPoints, timescale2, 2);
}


function timescaleChange2() {
    timescale2 = parseInt(event.srcElement.id);
    counter2 = fullData.length%timescale2;
    dataChange2();
}


/* HOME GRAPH 3 */

const xlabels3 = [];
const ylabels8 = [];

var timescale3 = 1;
var counter3 = 0;

const ctx3 = document.getElementById('chart3').getContext('2d');
const myChart3 = new Chart(ctx3, {
type: 'line',
data: {
    labels: xlabels3,
    datasets: [
        {
        label: 'TVOC',
        data: ylabels8,
        fill: false,
        backgroundColor: 'rgba(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    }
]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Parts per billion (ppb)',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }],
        xAxes: [{
            ticks: {
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }]
    },
    title: {
        display: true,
        text: 'Total volatile organic compound (TVOC) concentration',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});


function loadGraph3(dataPoints = 20) {
    var difference = (fullData.length)-(dataPoints*timescale3);
    if (difference < 0 ) { difference = 0;}

    for (let i=difference; i<fullData.length; i+=timescale3) {
        xlabels3.push(fullData[i]['time']);
        ylabels8.push(fullData[i]['tvoc']);
    }
    myChart3.update();
}


function updateGraph3() {
    counter3++;

    if (counter3 >= timescale3) {
        xlabels3.push(fullData[fullData.length - 1]['time']);
        ylabels8.push(fullData[fullData.length - 1]['tvoc']);
    
        xlabels3.splice(0, 1);
        ylabels8.splice(0, 1);
    
        myChart3.update();

        counter3 = 0;
    }
}


function dataChange3(){
    var dataPoints = document.getElementById("points_val3").value;
    console.log(timescale3);

    xlabels3.length = 0;
    ylabels8.length = 0;

    requestData(dataPoints, timescale3, 3);
}


function timescaleChange3() {
    timescale3 = parseInt(event.srcElement.id);
    counter3 = fullData.length%timescale3;
    dataChange3();
}


/* HOME GRAPH 4 */

const xlabels4 = [];
const ylabels9 = [];
const ylabels10 = [];

var timescale4 = 1;
var counter4 = 0;

const ctx4 = document.getElementById('chart4').getContext('2d');
const myChart4 = new Chart(ctx4, {
type: 'line',
data: {
    labels: xlabels4,
    datasets: [
        {
        label: 'Room Temp',
        data: ylabels9,
        fill: false,
        backgroundColor: 'rgba(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    },
    {
        label: 'Local Temp',
        data: ylabels10,
        fill: false,
        backgroundColor: 'rgba(0, 64, 255, 0.2)',
        borderColor: 'rgba(0, 64, 255, 1)',
        borderWidth: 1
    }
]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Temperature (°C)',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }],
        xAxes: [{
            ticks: {
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }]
    },
    title: {
        display: true,
        text: 'Room and Local Temperature',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});


function loadGraph4(dataPoints = 20) {
    var difference = (fullData.length)-(dataPoints*timescale4);
    if (difference < 0 ) { difference = 0;}

    for (let i=difference; i<fullData.length; i+=timescale4) {
        xlabels4.push(fullData[i]['time']);
        if (fullData[i]['temp']['$numberDecimal']) {
            ylabels9.push(fullData[i]['temp']['$numberDecimal']);
            ylabels10.push(fullData[i]['templocal']['$numberDecimal']);
        }
        else {
            ylabels9.push(fullData[i]['temp']);
            ylabels10.push(fullData[i]['templocal']);
        }
    }
    myChart4.update();
}


function updateGraph4() {
    counter4++;

    if (counter4 >= timescale4) {
        xlabels4.push(fullData[fullData.length - 1]['time']);
        ylabels9.push(fullData[fullData.length - 1]['temp']);
        ylabels10.push(fullData[fullData.length - 1]['templocal']);
    
        xlabels4.splice(0, 1);
        ylabels9.splice(0, 1);
        ylabels10.splice(0,1);
    
        myChart4.update();

        counter4 = 0;
    }
}


function dataChange4(){
    var dataPoints = document.getElementById("points_val4").value;
    console.log(timescale4);

    xlabels4.length = 0;
    ylabels9.length = 0;
    ylabels10.length = 0;

    requestData(dataPoints, timescale4, 4);
}


function timescaleChange4() {
    timescale4 = parseInt(event.srcElement.id);
    counter4 = fullData.length%timescale4;
    dataChange4();
}


/* HOME GRAPH 5 */

const xlabels5 = [];
const ylabels11 = [];
const ylabels12 = [];

var timescale5 = 1;
var counter5 = 0;

const ctx5 = document.getElementById('chart5').getContext('2d');
const myChart5 = new Chart(ctx5, {
type: 'line',
data: {
    labels: xlabels5,
    datasets: [
        {
        label: 'Room Humidity',
        data: ylabels11,
        fill: false,
        backgroundColor: 'rgba(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    },
    {
        label: 'Local Humidity',
        data: ylabels12,
        fill: false,
        backgroundColor: 'rgba(0, 64, 255, 0.2)',
        borderColor: 'rgba(0, 64, 255, 1)',
        borderWidth: 1
    }
]
},
options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Humidity (%)',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }],
        xAxes: [{
            ticks: {
                fontFamily: "'Jura', sans-serif",
                fontStyle: '400',
                padding: 5
            },
            scaleLabel: {
                display: true,
                labelString: 'Time',
                fontSize: 20,
                fontFamily: "'Jura', sans-serif",
                fontStyle: '600'
            }
        }]
    },
    title: {
        display: true,
        text: 'Room and Local Humidity',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});


function loadGraph5(dataPoints = 20) {
    var difference = (fullData.length)-(dataPoints*timescale5);
    if (difference < 0 ) { difference = 0;}

    for (let i=difference; i<fullData.length; i+=timescale5) {
        xlabels5.push(fullData[i]['time']);
        if (fullData[i]['humid']['$numberDecimal']) {
            ylabels11.push(fullData[i]['humid']['$numberDecimal']);
            ylabels12.push(fullData[i]['humidlocal']['$numberDecimal']);
        }
        else {
            ylabels11.push(fullData[i]['humid']);
            ylabels12.push(fullData[i]['humidlocal']);
        }
    }
    myChart5.update();
}


function updateGraph5() {
    counter5++;

    if (counter5 >= timescale5) {
        xlabels5.push(fullData[fullData.length - 1]['time']);
        ylabels11.push(fullData[fullData.length - 1]['humid']);
        ylabels12.push(fullData[fullData.length - 1]['humidlocal']);
    
        xlabels5.splice(0, 1);
        ylabels11.splice(0, 1);
        ylabels12.splice(0,1);
    
        myChart5.update();

        counter5 = 0;
    }
}


function dataChange5(){
    var dataPoints = document.getElementById("points_val5").value;
    console.log(timescale5);

    xlabels5.length = 0;
    ylabels11.length = 0;
    ylabels12.length = 0;

    requestData(dataPoints, timescale5, 5);
}


function timescaleChange5() {
    timescale5 = parseInt(event.srcElement.id);
    counter5 = fullData.length%timescale5;
    dataChange5();
}