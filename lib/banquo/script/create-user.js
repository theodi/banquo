base = phantom.casperArgs.args[0]
email = phantom.casperArgs.args[1]
password = phantom.casperArgs.args[2]

var casper = require('casper').create();

casper.start(base);

casper.then(function() {
	this.click('a[data-target="#register"]');
});

casper.then(function() {   
  this.fill('form#register_user', {
  	'user[email]': email,
  	'user[password]': password,
  	'user[password_confirmation]': password
  }, true);  
});

casper.then(function() {
  this.waitForText("You don't have any certificates yet.", function() {
    this.echo("User created! :)", "INFO");
  })
})

casper.run();