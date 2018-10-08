const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');
 
app.use(basicAuth({
    users: { 'admin': 'secret' }
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hi There.. how are you ?')
});
 


app.post('/getMovieList',function (request,response)  {

  console.log(request.body);

  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({
    "speech" : "Error. Can you try it again ? ",
    "displayText" : "Error. Can you try it again ? "
  }));
});


console.log('Application listening on port 8080...');
app.listen(8080);