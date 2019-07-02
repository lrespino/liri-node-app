require("dotenv").config();
var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);


var fs = require("fs");

var axios = require('axios');
var moment = require('moment');

var Spotify = require('node-spotify-api');
var inquirer = require('inquirer');

var command = process.argv[2]
var searchParameter = process.argv.slice(3).join(" ");




function start(command) {    
    switch (command) {
        case 'concert-this': 
            searchBand(searchParameter);
        break;

        case 'spotify-this-song':
            if (!searchParameter) {
                searchParameter = "The Sogn";
                searchSpotify(searchParameter);
            }
            searchSpotify(searchParameter); 
        break;

        case 'movie-this': 
            if (!searchParameter) {
                searchParameter = "The Movie"
                searchMovie(searchParameter);
            }
            searchMovie(searchParameter);
        break;
    }
}
// concert-this
function searchBand(term) {
    var API = keys.bands;

    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=" + API)
        .then(function (response) {

            var venue = response.data[0].venue.name;
            var location = response.data[0].venue.city + " , " + response.data[0].venue.region;

            var dateString = response.data[0].datetime
            var dateObj = new Date(dateString);
            var momentObj = moment(dateObj);
            var momentString = momentObj.format('L'); 

            var details = [
                "CONCERT SEARCH\n",
                "Venue : " + venue,
                "Location : " + location,
                "Date : " + momentString,
            ].join("\n")
            
            fs.appendFile("logSong.txt", divider + details + divider, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });

            console.log(divider + details + divider);

        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}


// spotify-this-song
function searchSpotify(term) {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: term }, function(err, response) {
            if (err) {
                return console.log(err);
            }
            var song = response.tracks.items[0];
            var songName = song.name;
            var artist = song.artists[0].name;
            var preview = song.external_urls.spotify;
            var album = song.album.name;

            var details = [
                "Song Search\n",
                "Song Name : " + songName, 
                "Artist : " + artist, 
                "Preview : " + preview, 
                "Album : " + album,
            ].join("\n");

        fs.appendFile("logSong.txt", divider + details + divider, (err) => {
            if (err) throw err;
            console.log('The "data to append" was appended to file!');
        });
        console.log(divider + details + divider)
    });
}


// movie-this
function searchMovie(term) {
    var API = trilogy //keys.OMDBI;
    console.log("API for OMDB: " + API)

    axios.get("https://www.omdbapi.com/?t=" + term + "&apikey=" + API)
        .then(function (response) {
            var data = response.data
            var title = data.Title;
            var year = data.Year;
            var rating = data.Ratings[0].Value;
            var tomatoes = data.Ratings[1].value;
            var country = data.Country;
            var language = data.Language;
            var plot = data.Plot;
            var actors = data.Actors;

            var details = [
                "Movie Search\n",
                "Title : " + title,
                "Year : " + year,
                "IMDB Rating : " + rating,
                "Rotten Tomatoes Rating : " + tomatoes,
                "Country : " + country,
                "Language : " + language,
                "Plot : " + plot,
                "Actors : " + actors,
            ].join("\n")
            
            fs.appendFile("logSong.txt", divider + details + divider, (err) => {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });

            console.log(divider + details + divider);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(function () {
        });
}

// do-what-it-says
