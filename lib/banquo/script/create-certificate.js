base = phantom.casperArgs.args[0]
email = phantom.casperArgs.args[1]
password = phantom.casperArgs.args[2]
url = phantom.casperArgs.args[3]

// Initialise casper.js
var casper = require('casper').create({
	"waitTimeout": 120000
})

// Load homepage
casper.start(base)

// Click login button
casper.then(function() {
	this.click('a[data-target="#login"]')
})

// Log in
casper.then(function() {   	 
    this.fill('form#sign_in_user_form', {
    	'user[email]': email,
    	'user[password]': password,
    }, false);  
    this.click('#sign_in_user_form input[name="commit"]')
})

// Wait until login happens
casper.then(function() {
  this.waitForText("My certificates", function() {
    // Start new certificate
    this.click('.navbar-inner button')
  })
})

casper.then(function() { 
	// Click the first header
	this.click('header[data-target=".survey-section[data-reference-identifier=general] ul"]')
    // Fill out Documentation URL
    this.click('[data-reference-identifier="documentationUrl"] input.string')
    this.sendKeys('[data-reference-identifier="documentationUrl"] input.string', url);
})

// Wait until the field get populated
casper.waitFor(function check() {
    return this.evaluate(function() {
      return document.querySelector('[data-reference-identifier="dataTitle"]').getAttribute('class').match(/ok/).length > 0;
    });
  }, function then() {
	this.wait(3000, function() {
	    // Submit certificate
	    this.click('input[name="finish"]')
	});
  }, function timeout() {
    this.echo("Timed out :(", "ERROR").exit("1");
  }, 120000
);

casper.then(function() {
  this.waitForText("Completed questionnaire", function() {
    // Get URL of certificate
    url = this.getElementAttribute('#main dl:last-of-type a.btn[href^="/datasets"]', 'href')
    this.echo(base + url);
  }, 120000)
})

casper.run();