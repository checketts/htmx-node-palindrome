var express = require('express');
var bodyParser = require("body-parser");

var palindromes = [{
  text: 'Mom',
  normalized: 'mom',
  votes: 0
}, {
  text: 'Dad',
  normalized: 'dad',
  votes: 0
}, {
  text: 'Step on no pets',
  normalized: 'steponnopets',
  votes: 0
}, {
  text: 'racecar',
  normalized: 'racecar',
  votes: 0
}]

Array.prototype.random = function() {
  return this[Math.floor((Math.random() * this.length))];
}

var app = express();
app.use(bodyParser.urlencoded({extended: true
}));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  var p = palindromes.random()

  res.render('index', {p: p,topPalindromes: [], 
    form: {palindromeText: '', submitter: ''}, errors: {palindromeText: [], submitter: []}});
});

app.post('/votes/:palindrome', (req, res) => {
  var p;
  for (var i = 0; i < palindromes.length; i++) {
    if (palindromes[i].normalized === req.params.palindrome) {
      p = palindromes[i]
      p.votes = p.votes + 1
    }
  }
  res.setHeader("HX-Trigger", "voteAdded")

  res.render('randomPalindrome', {p: p});
});

app.get('/random', function(req, res) {
  res.render('randomPalindrome', {p: palindromes.random()});
});

app.get('/top', function(req, res) {
  const top = [...palindromes].sort((a, b) => {
    return b.votes - a.votes
  });
  res.render('topPalindromes', {topPalindromes: top});
});

app.post("/palindromes", function(req, res) {
  var form = req.body;
  var errors = {palindromeText: [], submitter: []}
  if(!form.palindromeText || form.palindromeText === '') {
    errors.palindromeText.push("Text is required")
  } else {

  }
  if(!form.submitter || form.submitter === '') {
    errors.submitter.push("Submitter is required")
  }

  var triggerName = req.headers['hx-trigger']
  if (triggerName === 'palindromeText') {
    res.render('palindromeText', {form: form, errors: errors});
  } else if (triggerName === 'submitter') { 
    res.render('submitter', {form: form, errors: errors});
  } else {
    if(errors.palindromeText.length === 0 && errors.submitter.length === 0) {
      palindromes.push({text: form.palindromeText, normalized: form.palindromeText, votes: 0})    
      form.addMessage = 'Add \''+form.palindromeText+'\' as a new palindrome ';
    }
    
    res.render('addForm', {form: {palindromeText: '', submitter: ''}, errors: errors});
  }
});


app.listen(3000, function() {
  console.log('App listening on port http://localhost:3000!')
});