var express = require('express');
var app = express();
 
app.get('/', function (req, res) {
  res.send('Hi There.. how are you ?')
});
 
console.log('Application listening on port 8080...');
app.listen(8080);