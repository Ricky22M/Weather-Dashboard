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

