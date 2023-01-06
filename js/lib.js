cityName = ""

function round(value, precision)    {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function index_init()   {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=Warszawa&appid=" + open_weather_id + "&lang=pl&units=metric")
        .then(response=>response.json())
        .then(data => {
            document.getElementById("temp1").innerHTML = round(data['main']['temp'], 0).toString() + "°"
            document.getElementById("pic1").src = "images/" + data["weather"][0]["icon"] + ".svg";
        })

    fetch("https://api.openweathermap.org/data/2.5/weather?q=Wrocław&appid=" + open_weather_id + "&lang=pl&units=metric")
        .then(response=>response.json())
        .then(data => {
            document.getElementById("temp2").innerHTML = round(data['main']['temp'], 0).toString() + "°"
            document.getElementById("pic2").src = "images/" + data["weather"][0]["icon"] + ".svg";
        })
        fetch("https://api.openweathermap.org/data/2.5/weather?q=Kołobrzeg&appid=" + open_weather_id + "&lang=pl&units=metric")
        .then(response=>response.json())
        .then(data => {
            document.getElementById("temp3").innerHTML = round(data['main']['temp'], 0).toString() + "°"
            document.getElementById("pic3").src = "images/" + data["weather"][0]["icon"] + ".svg";
        })
}

function weather_init() {
    cityName = getName();
    now_weather();
    forecast();
}

function getName()  {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const city = urlParams.get('city')

    return city;
}

function getDayName(dateStr)    {
    local = "pl-PL";
    var date = new Date(dateStr);
    return date.toLocaleDateString(local, { weekday: 'long' });        
}

function getLink(type)  {
    if(type == 1)
    {
        return "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + open_weather_id + "&lang=pl&units=metric";
    }
    else if(type == 2)
    {
        return "https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=" + open_weather_id + "&q=" + cityName + "&lang=pl&units=metric";
    }
}

function unix_to_time(unixTimestamp)    {
    var date = new Date(unixTimestamp * 1000);
    return date.toString().substring(15, 21)
}

function now_weather()  {
    fetch(getLink(1))
    .then(response=>response.json())
    .then(data => {
        document.getElementById("temp").innerHTML = round(data['main']['temp'], 0).toString() + "°"
        document.getElementById("temp2").innerHTML = round(data['main']['temp'], 1).toString() + " °C"
        document.getElementById("tempOdczu").innerHTML = round(data['main']['feels_like'], 1).toString() + " °C"
        document.getElementById("humidity").innerHTML = data["main"]["humidity"].toString() + "%"
        document.getElementById("description").innerHTML = data["weather"][0]['description'];
        document.getElementById("wind").innerHTML = data["wind"]["speed"].toString() + "m/s"
        document.getElementById("cityName").innerHTML = data["name"];
        document.getElementById("pressure").innerHTML = data["main"]["pressure"].toString() + " hPa";
        document.getElementById("pic").src = "images/" + data["weather"][0]["icon"] + ".svg";
        document.getElementById("map").src = "https://embed.windy.com/embed2.html?lat=" + data["coord"]["lat"] +"&lon=" + data["coord"]["lon"] + "&detailLat=" + data["coord"]["lat"] +"&detailLon=" + data["coord"]["lon"] + "&zoom=5&level=surface&overlay=radar&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
        document.getElementById("sunset").innerHTML = unix_to_time(data["sys"]["sunset"])
        document.getElementById("sunrise").innerHTML = unix_to_time(data["sys"]["sunrise"])
        air_pollution(data["coord"]["lat"], data["coord"]["lon"])
    })
}

function forecast() {
    fetch(getLink(2))
    .then(response=>response.json())
    .then(data => {
        data["list"].forEach(element => {
            var divId = document.getElementById("forecast")
            day = element["dt_txt"].substring(5, 10)
            day = day.substring(3, 5) + "." + day.substring(0, 2);
            hour = element["dt_txt"].substring(10, 16);
            tmp = '<div class="fore"><div class="box"><div class="left"><img src="images/' + element["weather"][0]["icon"] + '.svg" alt=""></div><div class="right">' + round(element["main"]["temp"], 0) + ' °C <span style="color: #afafaf;">•</span> ' + element["main"]["humidity"] + '% <span style="color: #afafaf;">•</span> ' + element["main"]["pressure"] + ' hPa<p class="date">' + hour + ', '  + getDayName(element["dt_txt"].substring(0, 10)) + ' (' + day + ')</p></div></div></div>';
            divId.innerHTML = divId.innerHTML + tmp; 
        });  
    })            
}

function air_quality(level) {
    if(level == 1) return "dobra"
    if(level == 2) return "dostateczna"
    if(level == 3) return "umiarkowana"
    if(level == 4) return "zła"
    if(level == 5) return "bardzo zła"
}

function air_pollution(lat, lon)    {
    tmp = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + open_weather_id
    fetch(tmp)
    .then(response=>response.json())
    .then(data => {
        document.getElementById("air_pollution").innerHTML = air_quality(data["list"][0]["main"]["aqi"]);
    })
}