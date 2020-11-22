// variable
    var appid = "c01575bf6666da387f443737d85bf582";
    var recentSearches = [];
    var previousCities = localStorage.getItem("citys");

// functions
    // get weather info and post to dom
    function writeWeather(city) {
        var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + appid;

        $.ajax({
            url: weatherQueryURL,
            method: "GET"
        }).then(function(response) {
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var cityName = response.name;
            var date = moment(response.coord.dt).format("M/D/YYYY");
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + appid;

            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            }).then(function(response) {
                var currentTemp = Math.floor(((response.current.temp) - 273.15) * 9 / 5 + 32);
                var weatherIcon = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";

                $("#cityName").text(cityName + " " + date);
                $("#weatherIcon").attr("src", weatherIcon);
                $("#currentTemp").text("Temperature: " + currentTemp + " F");
                $("#currentHumidity").text("Humidity: " + response.current.humidity + " %");
                $("#currentWind").text("Wind speed: " + response.current.wind_speed + " MPH");
                $("#currentUV").text("UV Index: " + response.current.uvi);

                // for loop to create 5 day forecast cards
                for (let i = 0; i < 5; i ++) {
                    var dayTemp = Math.floor(((response.daily[i].temp.day)  - 273.15) * 9 / 5 + 32);
                    var dayIcon = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + ".png"

                    $(`#day${i}`).text(moment.unix(response.daily[i].dt).format("M/D/YYYY"));
                    $(`#icon${i}`).attr("src", dayIcon);
                    $(`#temp${i}`).text("Temp: " + dayTemp + "F");
                    $(`#humid${i}`).text("Humidity: " + response.daily[i].humidity + "%");
                };
            });
        });
    };

    // store city input in localStorage
    function storeCity(city) {
        recentSearches.push(city);
        (localStorage.setItem("citys", recentSearches));
    };

    // write previous searches to recent bar
    function previousSearches(city) {
        var recentCity = $("<button>").attr("class", "recentCity col-12").text(city);
        $("#recentSearches").append(recentCity);
    };

    // rewrites weather when previous search is clicked
    function rewriteWeather() {
        var recentCity = $(this).text();
        writeWeather(recentCity);
    };

    // writes cities form localStorage
    function loadStoarge () {
    if (Array.isArray(previousCities)) {
        previousCities.forEach(function(city) {
            console.log(previousCities);
            var recentCity = $("<button>").attr("class", "recentCity col-12").text(city);
            $("#recentSearches").append(recentCity);
        });
    }
    else {
        var recentCity = $("<button>").attr("class", "recentCity col-12").text(previousCities);
        $("#recentSearches").append(recentCity);
    };
}   

// function calls, and listeners

    // writes weather when city is submitted
    $("#submitButton").on("click", function() {
        var city = $("#cityInput").val();
        $("#cityInput").val(""); 
        writeWeather(city);
        storeCity(city);
        previousSearches(city);
    });

    //event listener to rewrite weather when a button is clicked
    $(document).on("click", ".recentCity", rewriteWeather);