var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('build'));
app.get('/', function (req, res) { 
  res.send((fs.readFileSync(__dirname + '/build/index.html')).toString());
});

app.listen(3000, function() {
  console.log('Time to play.');
});

