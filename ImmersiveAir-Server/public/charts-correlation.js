/* ROLLING CORRELATION GRAPH */

const xlabels6 = [];
const ylabels13 = [];
const ylabels14 = [];
const ylabels15 = [];
const ylabels16 = [];
const ylabels17 = [];
const ylabels18 = [];
const ylabels19 = [];
const ylabels20 = [];
const ylabels21 = [];
const ylabels22 = [];
const ylabels23 = [];

var timescale6 = 360;
var counter6 = 0;

var originalArray = ['> 0.3um', '> 0.5um', '> 1.0um', '> 2.5um', '> 5.0um', '> 10um', 'eCO2', 'TVOC', 'Room Temp', 'Local Temp', 'Room Humidity', 'Local Humidity'];
var namesArray = [];

const ctx6 = document.getElementById('chart6').getContext('2d');
const myChart6 = new Chart(ctx6, {
type: 'line',
data: {
    labels: xlabels6,
    datasets: [
        {
        label: namesArray[0],
        data: ylabels13,
        fill: false,
        backgroundColor: 'rgba(184, 14, 226, 0.2)',
        borderColor: 'rgba(184, 14, 226, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[1],
        data: ylabels14,
        fill: false,
        backgroundColor: 'rgba(0, 64, 255, 0.2)',
        borderColor: 'rgba(0, 64, 255, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[2],
        data: ylabels15,
        fill: false,
        backgroundColor: 'rgba(255, 153, 51, 0.2)',
        borderColor: 'rgba(255, 153, 51, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[3],
        data: ylabels16,
        fill: false,
        backgroundColor: 'rgba(71, 209, 71, 0.2)',
        borderColor: 'rgba(71, 209, 71, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[4],
        data: ylabels17,
        fill: false,
        backgroundColor: 'rgba(255, 77, 77, 0.2)',
        borderColor: 'rgba(255, 77, 77, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[5],
        data: ylabels18,
        fill: false,
        backgroundColor: 'rgba(0, 255, 191, 0.2)',
        borderColor: 'rgba(0, 255, 191, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[6],
        data: ylabels19,
        fill: false,
        backgroundColor: 'rgba(255, 102, 153, 0.2)',
        borderColor: 'rgba(255, 102, 153, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[7],
        data: ylabels20,
        fill: false,
        backgroundColor: 'rgba(255, 255, 0, 0.2)',
        borderColor: 'rgba(255, 255, 0, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[8],
        data: ylabels21,
        fill: false,
        backgroundColor: 'rgba(0, 128, 0, 0.2)',
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[9],
        data: ylabels22,
        fill: false,
        backgroundColor: 'rgba(153, 204, 255, 0.2)',
        borderColor: 'rgba(153, 204, 255, 1)',
        borderWidth: 1
    },
    {
        label: namesArray[10],
        data: ylabels23,
        fill: false,
        backgroundColor: 'rgba(89, 0, 179, 0.2)',
        borderColor: 'rgba(89, 0, 179, 1)',
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
                labelString: 'Correlation',
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
        text: 'Rolling Correlation',
        fontSize: 30,
        fontFamily: "'Jura', sans-serif",
        fontColor: '#333',
        fontStyle: '700',
        padding: 25
    }
}
});



function loadGraph6(activeDirector, dataPoints) {

    namesArray = originalArray.slice(0);
    if (activeDirector == 'particle1') { activeDirector = '> 0.3um'; }
    else if (activeDirector == 'particle2') { activeDirector = '> 0.5um'; }
    else if (activeDirector == 'particle3') { activeDirector = '> 1.0um'; }
    else if (activeDirector == 'particle4') { activeDirector = '> 2.5um'; }
    else if (activeDirector == 'particle5') { activeDirector = '> 5.0um'; }
    else if (activeDirector == 'particle6') { activeDirector = '> 10um'; }
    else if (activeDirector == 'co2') { activeDirector = 'eCO2'; }
    else if (activeDirector == 'tvoc') { activeDirector = 'TVOC'; }
    else if (activeDirector == 'temp') { activeDirector = 'Room Temp'; }
    else if (activeDirector == 'templocal') { activeDirector = 'Local Temp'; }
    else if (activeDirector == 'humid') { activeDirector = 'Room Humidity'; }
    else if (activeDirector == 'humidlocal') { activeDirector = 'Local Humidity'; }

    const index = namesArray.indexOf(activeDirector);
    namesArray.splice(index, 1);
    
    for (let i=0; i<namesArray.length; i++) { myChart6.data.datasets[i].label = namesArray[i]; }

    var difference = (correlationData[0].length)-(dataPoints);
    if (difference < 0 ) { difference = 0;}
    
    for (let j=difference; j<correlationData[0].length; j++) {
        xlabels6.push(correlationData[11][j]);
        ylabels13.push(correlationData[0][j]);
        ylabels14.push(correlationData[1][j]);
        ylabels15.push(correlationData[2][j])
        ylabels16.push(correlationData[3][j]);
        ylabels17.push(correlationData[4][j]);
        ylabels18.push(correlationData[5][j]);
        ylabels19.push(correlationData[6][j]);
        ylabels20.push(correlationData[7][j]);
        ylabels21.push(correlationData[8][j]);
        ylabels22.push(correlationData[9][j]);
        ylabels23.push(correlationData[10][j]);
    }
    
    myChart6.update();

    $(".loader-wrapper").fadeOut(1000);
}

/*
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
*/

function dataChange6(){
    var dataPoints = document.getElementById("points_val6").value;
    var director = document.getElementById("streams").value;
    console.log(timescale6);
    console.log(director);

    xlabels6.length = 0;
    ylabels13.length = 0;
    ylabels14.length = 0;
    ylabels15.length = 0;
    ylabels16.length = 0;
    ylabels17.length = 0;
    ylabels18.length = 0;
    ylabels19.length = 0;
    ylabels20.length = 0;
    ylabels21.length = 0;
    ylabels22.length = 0;
    ylabels23.length = 0;

    requestCorrelationData(dataPoints, timescale6, director);
}

function timescaleChange6() {
    timescale6 = parseInt(event.srcElement.id);
    counter6 = fullData.length%timescale6;
    dataChange6();
}

