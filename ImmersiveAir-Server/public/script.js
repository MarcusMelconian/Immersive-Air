/* JS FILE FOR CLIENT WEP APP */

const socket = io('/webpage');
var fullData = [];
var tempDataPoints;
var tempChartNumber;

var correlationfullData = [];
var correlationData = [[],[],[],[],[],[],[],[],[],[],[],[]];
var activeTimescale;
var activeDirector;

var hiddenToggle = true;

function startupData(dataPoints) {
    data = {
        dataPoints: dataPoints,
        startup: true
    }
    socket.emit('startup-data', data);
}


socket.on('startup-data', data => {
    if (data == null || typeof data == 'undefined') { 
        console.log('Registered  or undefined startup');
        return; 
    }
    if (window.location.href == 'http://immersiveair-server.herokuapp.com/correlation.html') { return; }
    else {
        console.log(data);
        fullData = data.reverse();
        loadGraph();
        loadGraph2();
        loadGraph3();
        loadGraph4();
        loadGraph5();
        $(".loader-wrapper").fadeOut(1000);
        $('body').removeClass('stop-scrolling')
    }
})


socket.on('sensor-data', data => {
    if (data == null || typeof data == 'undefined') { 
        console.log('Registered null or undefined sensor-data');
        return; 
    }
    if (window.location.href == 'http://immersiveair-server.herokuapp.com/correlation.html') { return; }
    else {
        console.log(data);
        fullData.push(data);
        updateGraph();
        updateGraph2();
        updateGraph3();
        updateGraph4();
        updateGraph5();
    }
})


function requestData(dataPoints, timescale, chartnumber) {
    if (dataPoints * timescale > fullData.length) {
        var data = {
            dataPoints: dataPoints,
            timescale: timescale
        }
        tempDataPoints = dataPoints;
        tempChartNumber = chartnumber;

        if (hiddenToggle) {
            var elems = document.getElementsByClassName("loader-wrapper2");
            for (let i=0; i<elems.length; i++) {
                elems[i].style.visibility = 'visible';
            }
            hiddenToggle = false;
        }
        
        if (chartnumber == 1) { $("#chart-wrapper1").fadeIn(0.01); }
        else if (chartnumber == 2) { $("#chart-wrapper2").fadeIn(0.01); }
        else if (chartnumber == 3) { $("#chart-wrapper3").fadeIn(0.01); }
        else if (chartnumber == 4) { $("#chart-wrapper4").fadeIn(0.01); }
        else if (chartnumber == 5) { $("#chart-wrapper5").fadeIn(0.01); }
        socket.emit('request-data', data);
    }
    else {
        if (chartnumber == 1) { loadGraph(dataPoints); }
        else if (chartnumber == 2) { loadGraph2(dataPoints); }
        else if (chartnumber == 3) { loadGraph3(dataPoints); }
        else if (chartnumber == 4) { loadGraph4(dataPoints); }
        else if (chartnumber == 5) { loadGraph5(dataPoints); }
    }
}


socket.on('request-data', data => {
    if (data == null || typeof data == 'undefined') { 
        console.log('Registered  or undefined request-data');
        return; 
    }
    console.log(data);
    fullData = data.reverse();
    if (tempChartNumber == 1) { 
        loadGraph(tempDataPoints); 
        $("#chart-wrapper1").fadeOut(250);
    }
    else if (tempChartNumber == 2) { 
        loadGraph2(tempDataPoints); 
        $("#chart-wrapper2").fadeOut(250);
    }
    else if (tempChartNumber == 3) { 
        loadGraph3(tempDataPoints);
        $("#chart-wrapper3").fadeOut(250);
    }
    else if (tempChartNumber == 4) { 
        loadGraph4(tempDataPoints); 
        $("#chart-wrapper4").fadeOut(250);
    }
    else if (tempChartNumber == 5) { 
        loadGraph5(tempDataPoints); 
        $("#chart-wrapper5").fadeOut(250);
    }
    
})


function requestCorrelationData(dataPoints, timescale, director, firstRequest = false) {
    if (dataPoints <= correlationData[0].length && timescale == activeTimescale && director == activeDirector) {
        loadGraph6(director, dataPoints);
    }
    else {
        var data = {
            dataPoints: dataPoints,
            timescale: timescale,
            director: director
        }
        tempDataPoints = dataPoints;
        activeTimescale = timescale;
        activeDirector = director;

        if (hiddenToggle) {
            document.getElementsByClassName("loader-wrapper2")[0].style.visibility = 'visible';
            hiddenToggle = false;
        }

        if (dataPoints * timescale > correlationfullData.length ) {
            if (!firstRequest) { $("#chart-wrapper6").fadeIn(0.01); }
            socket.emit('request-correlation-data', data);
        }
        else { 
            if (!firstRequest) { $("#chart-wrapper6").fadeIn(0.01); }
            socket.emit('perform-correlation-data', [data, correlationfullData]); 
        }
    }
}


socket.on('request-correlation-data', data => {
    if (data == null || typeof data == 'undefined') { 
        console.log('Registered  or undefined request-data');
        requestCorrelationData(tempDataPoints, activeTimescale, activeDirector);
        return; 
    }
    correlationfullData = data;
    socket.emit('perform-correlation-data', data);
})


socket.on('perform-correlation-data', data => {
    if (data == null || typeof data == 'undefined') { 
        console.log('Registered  or undefined perform-data');
        return; 
    }
    console.log(data);
    correlationData = data;
    loadGraph6(activeDirector, tempDataPoints);
    $('body').removeClass('stop-scrolling');
    $("#chart-wrapper6").fadeOut(250);
})
