/* DECLARED VARIABLES */

// Current Date
var currentDate = moment().format('l')

// Cities lasted searched
var previouslySearched = [];

// Buttons for the previous user searches
var lastSearchedBtn = $('#lastSearched');

// API key being used 
var apiKey = '4d63ba9d93efddcbcaf8047f7d2ec8b0';

// Main card attributes
var cityName = $('#cityCard');
var tempOfCity = $('#temp');
var windOfCity = $('#wind');
var humidityOfCity = $('#humidity');
var uvIndexOfCity = $('#uvIndex');

// User can search for all current city name terms
var allSearches;

/* FUNCTIONS */

// Used to show the current date
$('#currentDay').text(currentDate);

// If saved local storage data already exists, then display in the "previouslySeached" array
if (JSON.parse(localStorage.getItem("previousCities")) !== null) {
    previouslySearched = JSON.parse(localStorage.getItem("previousCities"));
}

// Uses API key and helps to create weather cards
async function citySearch(city) {
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
            }
            return response.json();
        })
        // revise inital card
        .then(function (data) {
            // calls the "reviseCard" function, the "uvIndex" fucntion, and the "fiveDay" function
            revisedCard(data.name, data.main.temp, data.wind.speed, data.main.humidity, data.weather[0].description);
            uvInfo(data.coord.lat, data.coord.lon);
            fiveDayCityWeather(data.name);
        });
}

// The five day API call
async function fiveDayCityWeather(city) {
    requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city.split(' ').join('+')},US&appid=${apiKey}&units=imperial`;
    await fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                console.log("Invalid city name");
            }
            return response.json();
        })
        .then(function (data) {
            // Used to find the next five days' weather
            for (let i = 0; i < 6; i++) {
                if (i === 0) {
                    fiveCards(i, data.list[4].dt_txt.split(' ')[0], data.list[4].main.temp, data.list[4].wind.speed, data.list[4].main.humidity);
                } else if (i === 1) {
                    fiveCards(i, data.list[12].dt_txt.split(' ')[0], data.list[12].main.temp, data.list[12].wind.speed, data.list[12].main.humidity);
                } else if (i === 2) {
                    fiveCards(i, data.list[20].dt_txt.split(' ')[0], data.list[20].main.temp, data.list[20].wind.speed, data.list[20].main.humidity);
                } else if (i === 3) {
                    fiveCards(i, data.list[28].dt_txt.split(' ')[0], data.list[28].main.temp, data.list[28].wind.speed, data.list[28].main.humidity);
                } else if (i === 4) {
                    fiveCards(i, data.list[36].dt_txt.split(' ')[0], data.list[36].main.temp, data.list[36].wind.speed, data.list[36].main.humidity);
                }
            }
        });
}

// UV Index API call
async function uvInfo(lat, lon) {
    var requestUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`
    await fetch (requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                console.log("Invalid city name");
            }
            return response.json();
        })
        .then(function (data) {
            uvIndexOfCity.text(`UV Index: ${data.value}`);
        });
}

// Gives results
$('#searchForCity').on("keyup", function (e) {
    if (e.keyCode == 13) {
        getAPIRequest();
    }
});

// Used to call api weather key, add all updates to last searched cities, and calls function to show previous searches
function getAPIRequest() {
    allSearches = $('#searchForCity').val();
    citySearch(allSearches);
    previouslySearchedHistory();
    createButton();
}

// Shows the user their search weather history and saves it to their local storage
function previouslySearchedHistory() {
    var saveCity = true;
    previouslySearched.forEach(search => {
        if (search === allSearches) {
            saveCity = false;
        }
    });
    if (saveCity === true) {
        previouslySearched.unshift(allSearches);
    }
    localStorage.setItem("previosCities", JSON.stringify(previouslySearched));
}

// This will help to clear saved search history
function endButton() {
    lastSearchedBtn.empty();
}

// Creates a button for each city searched
function createButton() {
    endButton();
    for (let i = 0; i < previouslySearched.length; i++) {
        var cityButton = $('<button>');
        cityButton.attr('class', 'btn btn-outline-secondary text-white bg-dark m-1');
        cityButton.attr('type', 'button');
        cityButton.text(previouslySearched[i]);
        cityButton.attr('onclick', `citySearch("${previouslySearched[i]}")`);
        lastSearchedBtn.append(cityButton);
    }
}

// Updates and changes made to the main card
function revisedCard(city, temp, wind, humidity) {
    cityName.text(`${city}`);
    tempOfCity.text(`Temp: ${temp}°F`);
    windOfCity.text(`Wind: ${wind} MPH`);
    humidityOfCity.text(`Humidity: ${humidity}%`);
}

// Update and changes made to the last five cards
function fiveCards(index, date, temp, wind, humidity) {
    var fiveCardDate = $(`#cardDate${index}`);
    var fiveCardTemp = $(`#cardTemp${index}`);
    var fiveCardWind = $(`#cardWind${index}`);
    var fiveCardHumidity = $(`#cardHumidity${index}`);
    fiveCardDate.text(`${date}`);
    fiveCardTemp.text(`Temp: ${temp}°F`);
    fiveCardWind.text(`Wind: ${wind}MPH`);
    fiveCardHumidity.text(`Humidity: ${humidity}%`);
}

//Loads local storage buttons
createButton();