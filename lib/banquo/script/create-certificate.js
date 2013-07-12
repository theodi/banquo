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
  this.waitForText("New Certificate", function() {
    // Fill out Documentation URL
    this.click('[data-reference-identifier="documentationUrl"] input.string')
    this.sendKeys('[data-reference-identifier="documentationUrl"] input.string', url);
	this.evaluate(function(url) {
		
	  // Utility function to populate input fields by identifier
	  function fillMe(identifier, val) {
	    $('[data-reference-identifier="'+ identifier +'"] input.string, [data-reference-identifier="'+ identifier +'"] select').val(val)
	  }
	
	  // Utility function to select nth option
	  function selectMe(identifier, value) {
	     $('[data-reference-identifier="'+ identifier +'"] select option:eq('+ value +')').attr('selected', 'selected');
	  }

	  // Utility function to check input fields by identifier
	  function checkMe(identifier, value) {
	   $('[data-reference-identifier="'+ identifier +'"] [type="radio"], [data-reference-identifier="'+ identifier +'"] [type="checkbox"]').eq(value).prop('checked', true) 
	   //$('[data-reference-identifier="'+ identifier +'"] [value="'+ value +'"]').prop('checked', true)
	  }
	
     $.getJSON('http://localhost:4567/data-kitten', { 
		url: url 
		})
		.done(function(json) {
									 
         // Title
         fillMe("dataTitle", json.title)

         if (json.publishers.length > 0) {
           // Publisher name
           fillMe("publisher", json.publishers[0].name)
           // Publisher URL
           fillMe("publisherUrl", json.publishers[0].homepage)
         }

         // Data type

         if (json.update_frequency.length == 0 && json.distributions.length == 1) {
           // One-off release of a single dataset
           checkMe("releaseType", 0)
         } else if (json.update_frequency.length == 0 && json.distributions.length > 1) {
           checkMe("releaseType", 1)
           // One-off release of a set of related datasets
         } else if (json.update_frequency.length > 0 && json.distributions.length > 1) {
           // Ongoing release
           checkMe("releaseType", 2)
         }

         // A service or API for accessing open data
         if (json.title.indexOf("API") >= 0 || json.description.indexOf("API") >= 0 ) {
           checkMe("releaseType", 3)
         }

         // Rights information
         if (json.rights) {
           // Yes, you have the rights to publish this data as open data
           checkMe("publisherRights", 0)
           // Rights statement
           fillMe("copyrightURL", json.rights.uri)

           // Data License
           switch(json.rights.dataLicense) {
             case "http://opendatacommons.org/licenses/by/":
               selectMe("dataLicence", 1)
               break;
             case "http://opendatacommons.org/licenses/odbl/":
               selectMe("dataLicence", 2)
               break;
             case "http://opendatacommons.org/licenses/pddl/":
               selectMe("dataLicence", 3)
               break;
             case "http://creativecommons.org/publicdomain/zero/1.0/":
               selectMe("dataLicence", 4)
               break;
             case "http://reference.data.gov.uk/id/open-government-licence":
               selectMe("dataLicence", 5)
               break;
           }

           // Content License
           switch(json.rights.contentLicense) {
             case "http://creativecommons.org/licenses/by/2.0/uk/":
               selectMe("contentLicence", 1)
               break;
             case "http://creativecommons.org/licenses/by-sa/2.0/uk/":
               selectMe("contentLicence", 2)
               break;
             case "http://creativecommons.org/publicdomain/zero/1.0/":
               selectMe("contentLicence", 3)
               break;
             case "http://reference.data.gov.uk/id/open-government-licence":
               selectMe("contentLicence", 4)
               break;
           }
         } else if (json.licenses) {
           // Yes, you have the rights to publish this data as open data
           checkMe("publisherRights", 0)

           // Data License
           switch(json.licenses[0].uri) {
             case "http://opendatacommons.org/licenses/by/":
               selectMe("dataLicence", 1)
               break;
             case "http://opendatacommons.org/licenses/odbl/":
               selectMe("dataLicence", 2)
               break;
             case "http://opendatacommons.org/licenses/pddl/":
               selectMe("dataLicence", 3)
               break;
             case "http://creativecommons.org/publicdomain/zero/1.0/":
               selectMe("dataLicence", 4)
               break;
             case "http://reference.data.gov.uk/id/open-government-licence":
               // Open Government Licence covers data and content
               selectMe("dataLicence", 5)
               selectMe("contentLicence", 4)
               break;
			 case "http://www.ordnancesurvey.co.uk/docs/licences/os-opendata-licence.pdf":
				selectMe("dataLicence", 7)
				selectMe("contentLicence", 6)
				fillMe("otherDataLicenceName", "OS OpenData Licence")
				fillMe("otherDataLicenceURL", "http://www.ordnancesurvey.co.uk/docs/licences/os-opendata-licence.pdf")
				checkMe("otherDataLicenceOpen", 1)
				fillMe("otherContentLicenceName", "OS OpenData Licence")
				fillMe("otherContentLicenceURL", "http://www.ordnancesurvey.co.uk/docs/licences/os-opendata-licence.pdf")
				checkMe("otherContentLicenceOpen", 1)
           }

         }

         // Was all this data originally created or gathered by you? 
         // Assumption for data.gov.uk
         if (url.indexOf("data.gov.uk") != -1) {
           checkMe("publisherOrigin", 1)
         }

         // Can individuals be identified from this data?
         // Assumption for data.gov.uk
         if (url.indexOf("data.gov.uk") != -1) {
           checkMe("dataPersonal", 0)
         }

         for (var i = 0; i < json.distributions.length; i++) {

           // Is this data machine-readable?
           if (json.distributions[i].structured === true) {
             checkMe("machineReadable", 1)
           }

           // Is this data in a standard open format?
           if (json.distributions[i].open === true) {
             checkMe("openStandard", 1)
           }
         }

         // Does this data change at least daily?
         // Assumption for data.gov.uk
         if (url.indexOf("data.gov.uk") != -1) {
           checkMe("frequentChanges", 0)
         }

         // Does your data documentation contain machine readable documentation for:

         // Title
         if (json.title.length > 0) {
           checkMe("documentationMetadata", 0)
         }

         // Description
         if (json.description.length > 0) {
           checkMe("documentationMetadata", 1)
         }

         // Release Date
         if (json.release_date.length > 0) {
           checkMe("documentationMetadata", 2)
         }

         // Modification Date
         if (json.modified_date.length > 0) {
           checkMe("documentationMetadata", 3)
         }

         // Frequency of releases
         if (json.update_frequency) {
           checkMe("documentationMetadata", 4)
         }

         // Publisher
         if (json.publishers.length > 0) {
           checkMe("documentationMetadata", 8)
         }

         // Temporal coverage
         if (json.temporal_coverage.start != null && json.temporal_coverage.end != null) {
           checkMe("documentationMetadata", 10)
         }

         // Keywords
         if (json.keywords.length > 0) {
           checkMe("documentationMetadata", 12)
         }

         // Distributions
         if (json.distributions.length > 0) {
           checkMe("documentationMetadata", 13)
         }

         // Do the data formats use vocabularies?
         // Assumption for data.gov.uk
         if (url.indexOf("data.gov.uk") != -1) {
           checkMe("vocabulary", 0)
         }

         // Are there any codes used in this data? 
         // Assumption for data.gov.uk
         if (url.indexOf("data.gov.uk") != -1) {
           checkMe("codelists", 0)
         }

         // Contact email address
         fillMe("contactEmail", json.publishers[0].mbox)
       	})
		.fail(function( jqxhr, textStatus, error ) {
		  var err = textStatus + ', ' + error;
	      fillMe("dataTitle", "Request Failed: " + err)
		  console.log( "Request Failed: " + err);
		});
	}, url);
  })	 
})

// Wait until the field get populated
casper.waitFor(function check() {
    return this.evaluate(function() {
      return document.querySelector('[data-reference-identifier="dataTitle"] input.string').value.length > 0;
    });
  }, function then() {
    // Submit certificate
    this.click('input[name="finish"]')
  }, function timeout() {
    this.echo("Timed out :(", "ERROR").exit("1");
  }, 600000
);

casper.then(function() {
  this.waitForText("Completed questionnaire", function() {
    // Get URL of certificate
    url = this.getElementAttribute('#main dl:last-of-type a[href^="/certificates"]', 'href')
    this.echo(base + url);
  })
})

casper.run();