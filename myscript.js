var degrees = "°";
var strtUrl = "http://api.openweathermap.org/data/2.5/";
var cityCN = "Toronto,ca";
var appid = "ca248c61dd15fcb0397533eecaf9fd5f";
var units = "metric";

function fillPage(){
  getCurrentWeather();
  getForecasts();
}

function onDegClick()
{
  if (document.getElementById("degcheckbox").checked)
  {
    units = "imperial";
  }
  else
  {
    units = "metric";
  }
  fillPage();
}

function openPrompt()
{
  cityCN = prompt("Enter the City and Country code:", cityCN);
  if (cityCN != null && cityCN != "")
  {
    fillPage();
  }
}

function getCurrentWeather() {
  // current weather
  var xmlhttp1 = new XMLHttpRequest();
  var url1 = strtUrl + "weather?q=" + cityCN + "&APPID=" + appid + "&units=" + units;
  var jsonResObj1;

  xmlhttp1.onreadystatechange=function(){
    if (this.readyState == 4 && this.status == 200)
    {
      jsonResObj1 = JSON.parse(this.responseText);
      currentWeather(jsonResObj1);
    }
  }
  xmlhttp1.open("GET",url1,true);
  xmlhttp1.send();

  function currentWeather(jsonResObj) {
      document.getElementById("weather").innerHTML = "<figure> <img class=\"icon\" src=\"" + findIcon(jsonResObj["weather"][0]["description"]) + "\"></figure>";
      document.getElementById("temp").innerHTML = jsonResObj["main"]["temp"] + degrees;
      document.getElementById("humidity").innerHTML = "Humidity: " + jsonResObj["main"]["humidity"] + "%";
      document.getElementById("wind").innerHTML = "Wind Speed: " + jsonResObj["wind"]["speed"] + "m/s";
  }
}

function getForecasts() {
  // hourly and more days
  var xmlhttp2 = new XMLHttpRequest();
  var url2 = strtUrl + "forecast?q=" + cityCN + "&APPID=" + appid + "&units=" + units;
  var jsonResObj2;

  xmlhttp2.onreadystatechange=function(){
    if (this.readyState == 4 && this.status == 200)
    {
      jsonResObj2 = JSON.parse(this.responseText);
      document.getElementById("place").innerHTML = jsonResObj2["city"]["name"] + ", " + jsonResObj2["city"]["country"];
      hourlyForecast(jsonResObj2);
      dailyForecast(jsonResObj2);
    }
  }
  xmlhttp2.open("GET",url2,true);
  xmlhttp2.send();

  function hourlyForecast(jsonResObj) {
      var utcDiff = -5;
      var hourScn;
      hourScn = "<header><h3>Hourly Forecast:</h3></header><section>"

      var date;

      var i;
      for (i = 0; i <= 8; i++)
      {
        date = new Date(jsonResObj["list"][i]["dt_txt"]);
        date.setHours(date.getHours() + utcDiff);
        hourScn += "<article><section class=\"hour\">" + hourToText(date.getHours());
        hourScn += "</section>";
        hourScn += "<section class=\"hWDes\">" + jsonResObj["list"][i]["weather"][0]["description"];
        hourScn += "</section>";
        hourScn += "<section><figure><img class=\"hourIcn\" src=\"" + findIcon(jsonResObj["list"][i]["weather"][0]["description"]) + "\"></figure></section>";
        hourScn += "<section class=\"hTemp\">" + jsonResObj["list"][i]["main"]["temp"] + degrees;
        hourScn += "</section>";
        hourScn += "</article>";
      }

      hourScn += "</section>";
      document.getElementById("hourlyforecast").innerHTML = hourScn;
  }

  function hourToText(hours)
  {
    var hourText = "";
    if (hours == 24)
    {
      hourText += (hours - 12) + " AM";
    }
    else if (hours == 12)
    {
      hourText += hours + " PM";
    }
    else if (hours < 12)
    {
      hourText += hours + " AM";
    }
    else {
      hourText += (hours - 12) + " PM";
    }
    return hourText;
  }

  function dailyForecast(jsonResObj)
  {
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var utcDiff = -5;
    var dayScn;
    dayScn = "<header><h3>Daily Forecast:</h3></header><section>"

    var date, currDate;
    currDate = new Date();

    var days = 0, i = 11;
    date = new Date(jsonResObj["list"][i]["dt_txt"]);
    date.setHours(date.getHours() + utcDiff);
    while (date.getDate() == currDate.getDate())
    {
      i++;
    }
    for(days = 0; days < 4; days++)
    {
      date = new Date(jsonResObj["list"][i]["dt_txt"]);
      date.setHours(date.getHours() + utcDiff);
      dayScn += "<article><section class=\"day\">" + weekdays[date.getDay()];
      dayScn += "</section>";
      dayScn += "<section class=\"dWDes\">" + jsonResObj["list"][i]["weather"][0]["description"];
      dayScn += "</section>";
      dayScn += "<section><figure><img class=\"dayIcn\" src=\"" + findIcon(jsonResObj["list"][i]["weather"][0]["description"]) + "\"></figure></section>";
      dayScn += "<section class=\"dTemp\">" + jsonResObj["list"][i]["main"]["temp"] + degrees;
      dayScn += "</section>";
      dayScn += "</article>";
      i += 8;
    }

    dayScn += "</section>";
    document.getElementById("dailyforecast").innerHTML = dayScn;
  }
}

function findIcon(descr) {
  var strtPth = "./img/android__weather_icons_by_bharathp666-d2zlfrd/Weather/";
  var pth;

  if (descr.includes("clear"))
  {
    pth = "Sunny";
  }
  else if (descr.includes("cloud")) {
    pth = "Mostly Cloudy";
  }
  else if (descr.includes("rain")) {
    pth = "Drizzle";
  }
  else if (descr.includes("snow")) {
    pth = "Snow";
  }
  else if (descr.includes("storm")) {
    pth = "Thunderstorms";
  }
  else if (descr.includes("mist")) {
    pth = "Haze";
  }
  else {
    pth = "Cloudy";
  }

  strtPth += pth + ".png";
  return strtPth;
}
