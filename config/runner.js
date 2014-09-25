/*

  Creates a temp code file and runs it

  example question record
  {
    functionName: 'main($a, $b)',
    testInputs: [
      {"$a": 10, "$b": 4, "result": 14, "msg": "10 + 4 = 14"}
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
  binpath = process.env.PHP_PATH || '/usr/local/bin/php';

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
        var output = stdout.trim().replace(path, 'your code').replace(
          '/private', '');
        var errors = stderr.trim().replace(path, 'your code').replace(
          '/private', '');
        cb(null, interpretResults(output, errors));
      });
    }
  });

}

function buildContent(input, func, tests) {
  // Strip php tags and re-add our own
  var content = "<?php\n\n" + input.replace('<?php', '').replace('?>', '') +
    "\n\n\n";
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

  // @TODO better error detection and smarter response messages
  if (error.length > 0 || output.match(/Warning|Error/i) || output.match(
    /assert\(\)\: .* failed in your code/i)) {
    decision.isSuccessful = false;
  }

  return decision;
}