/**
 * Creates a temp code file and runs it

example question record
{
  functionName: 'foo($a, $b, $c)',
  testInputs: [
    {"$a": 123, "$b": 456, "$c": 567, "result": false, "msg": "Testing 123"}
  ]
}

testing with:
POST /answers/run HTTP/1.1
Host: localhost:3000
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

questionId=1&userId=2&input=function+main(%24a%2C+%24b)+%7B+return+%24a+-+%24b%3B+%7D&testInputs=%5B+++++%7B%22%24a%22%3A+123%2C+%22%24b%22%3A+456%2C+%22%24c%22%3A+567%2C+%22results%22%3A+false%2C+%22msg%22%3A+%22Testing+123%22%7D+++%5D


*/
var temp = require('temp-write'),
  fs = require('fs'),
  util = require('util'),
  exec = require('child_process').exec,
  binpath = process.env.PHP_PATH || '/usr/bin/php';

module.exports = function (input, func, tests, cb) {

  var content = buildContent(input, func, tests);

  temp(content, function (err, path) {
    if (err) {
      return cb(err);
    }
    else {
      exec(binpath + ' -f ' + path, function (err, stdout,
        stderr) {

        // Remove the temp file path from any errors
        var output = stdout.trim();
        var errors = stderr.trim().replace(path, 'your code').replace(
          '/private', '');
        cb(null, interpretResults(output, errors));
      });
    }
  });

}

function buildContent(input, func, tests) {
  var content = "<?php\n\n" + input; + "\n\n\n";
  for (var i = 0, j = tests.length; i < j; i++) {
    var test = tests[i];

    // Prep func template
    for (var param in test) {
      if (param === 'results' || param === 'msg') continue;
      func = func.replace(param, test[param]);
    }

    // Add our assertions to the file
    content += '\nassert(' + func + '===' + test.result + ', "' + test.msg +
      '");';
  }
  return content;
}

function interpretResults(output, error) {
  var decision = {
    isSuccessful: true,
    output: output,
    error: error
  };

  // We will only get php errors from stderr
  // (as opposed to printing the word 'Error')
  if (error.length > 0) {
    decision.isSuccessful = false;
  }

  return decision;
}