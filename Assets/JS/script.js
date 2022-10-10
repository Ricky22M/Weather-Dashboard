/* DECLARED VARIABLES */

// Cities lasted searched
var previouslySearched = [];

// Buttons for the previous user searches
var lastSearchedBtn = $('lastedSearched');

// API key being used 
var apiKey = '4d63ba9d93efddcbcaf8047f7d2ec8b0';

// Main card attributes
var city = $('#cityCard');
var temperature = $('#temperature');
var wind = $('#wind');
var humidity = $('#humidity');
var uv = $('#uvIndex');

// User can search for all current city name terms
var allSearches;

/* FUNCTIONS */

// If saved local storage data already exists, then display in the "previouslySeached" array
if (JSON.parse(localStorage.getItem("previousCities")) !== null) {
    previouslySearched = JSON.parse(localStorage.getItem("previousCities"));
}

// Uses API key and 
async function citySearch(city) {
    //
    requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;
    
    await fetch(requestUrl)
        .then(function (response) {
            // Used if a city is invalid
            if (response.status === 404) {
                console.log("Unable to find selected city");
                var asideEl = $('#leftContent');
                var aside = $('<div>');
                aside.attr("class", "alert alert-danger");
                aside.attr("role", "alert");
                aside.attr("id", "test");
                aside.attr("Invalid city name");
                asideEl.append(alert);
            } else (response === 202) {
                setInterval(function () {
                    if (alert.css('opacity') < 0.1) {
                        alert.remove();
                        clearInterval();
                    } else {
                        alert.css('opacity', `${alert.css('opacity') - 0.1}`);
                    }
                }, 150);
            }
            return response.json();
        })
        // revise inital card
        .then(function (data) {
            // calls the "reviseCard" function, the "uvIndex" fucntion, and the "fiveDay" function
            reviseCard(data.name, data.main.temp, data.main.humidity, data.weather[0].description);
            uvIndex(data.coord.lat, data.coord.lon);
            fiveDayCitySearch(data.name);
        });
}

