const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const tmdbURL = "https://api.themoviedb.org/3/discover/movie?api_key=75f1e3f9aa6691c4fe0e4589a5c1e5cc";
 
app.use(basicAuth({
    users: { 'admin': 'secret' }
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Author: bips3421@yahoo.com')
});
 
app.post('/fulfillment',function (request,response)  {

  handleAction(request.body, response);

  
});

console.log('Application listening on port 8080...');
app.listen(8080);


//Function to handle Actions from DF
function handleAction(req, res) {

var queryParameters = "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&vote_count.gte=100";
var resultCount = 0;

  switch(req.queryResult.action) {
    case "getMovieList":

      if(req.queryResult.parameters.hasOwnProperty('rating'))
        queryParameters += "&vote_average.gte=" + req.queryResult.parameters.rating;
      
      if(req.queryResult.parameters.hasOwnProperty('movieCount')) {
        
        var movieCount = req.queryResult.parameters.movieCount;
        if(movieCount > 20)
          queryParameters += "&page=" + movieCount / 20 + 1;
      }

      var startDate = req.queryResult.parameters.period.startDate.substring(0,10);
      var endDate = req.queryResult.parameters.period.endDate.substring(0,10);

      queryParameters += "&primary_release_date.gte=" + startDate + "&primary_release_date.lte=" + endDate;

      tmdbGET(queryParameters)
      .then(result => {
        if (!result.ok) {
          
          console.log('API call failed with NOT OK');
          return;
        }

        return result.json();
      }).then(response => {

        console.log(response);

        var output = prepareMovieResults(response, movieCount);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
        return 0;
      })
      .catch(err => {
        console.log(err);
      });

      break;

    default:
      console.log('Unknown');
      break;
  }
}   

//Prepare the results from API call to OMDB
function prepareMovieResults(jsonBody, count) {

  var fulfillmentText = "Found " + jsonBody.total_results + " movies";

  if(count > 0)
    fulfillmentText += "; showing top " + count;

  var fulfillmentMessages = [], movies = [];
  fulfillmentMessages.push({"text": { "text": movies }});

  for(let index in jsonBody.results) {
     movies.push('"' + jsonBody.results[index].original_title + '"; Rating: ' + jsonBody.results[index].vote_average)
  }

  return {"fulfillmentText": fulfillmentText, "fulfillmentMessages": fulfillmentMessages};
}

//API call
function tmdbGET(queryString) {

  console.log(tmdbURL + queryString);

  return fetch(tmdbURL + queryString, {
    method: 'GET'
  }).catch(function(err) {

    console.log(err);
  });
}
