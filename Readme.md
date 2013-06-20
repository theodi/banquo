# Banquo

A set of scripts that, combined with the power of [phantom.js](http://phantomjs.org/),  [casper.js](http://casperjs.org/)
and a little bit of [data-kitten](https://github.com/theodi/data-kitten), automagically creates [ODI Open Data Certificates](https://github.com/theodi/open-data-certificate) to Raw level for datasets that are hosted in [CKAN](http://ckan.org/) repositories. Currently only tested for [data.gov.uk](http://data.gov.uk).

## Usage

Add the base URI of your certificates installation to a `.env.` file like so:

  	BASE_URL='http://localhost:3000' 
  
To create a user:

  	u = User.create(:email => "email@example.com", :password => "secr3tpa55wo0rd")
  
To create a certificate for a dataset (attached to a user):

	d = Dataset.create(:user => u, :uri => "http://data.gov.uk/dataset/coins")
	
You can then access the uri of the certificate like so:

	d.certificate #=> "http://localhost:3000/certificates/23"
  
  