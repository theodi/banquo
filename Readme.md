# Banquo

A set of scripts that, combined with the power of [phantom.js](http://phantomjs.org/),  [casper.js](http://casperjs.org/)
and a little bit of [data-kitten](https://github.com/theodi/data-kitten), automagically creates [ODI Open Data Certificates](https://github.com/theodi/open-data-certificate) to Raw level for datasets that are hosted in [CKAN](http://ckan.org/) repositories. Currently only tested for [data.gov.uk](http://data.gov.uk).

## Usage

You will need [MongoDB](http://www.mongodb.org/) and [PhantomJS](http://phantomjs.org/) installed. Then run `bundle` to install all the other relevant dependencies.

Add the base URI of your certificates installation to a `.env.` file like so:

  	BASE_URL='http://certificates.theodi.org' 
  
To create a user:

  	u = User.create(:email => "email@example.com", :password => "secr3tpa55wo0rd")
  
To create a certificate for a dataset (attached to a user):

	d = Dataset.create(:user => u, :uri => "http://data.gov.uk/dataset/coins")
	
Or:

	d = u.datasets.build(:uri => "http://data.gov.uk/dataset/commercial-victimisation-survey")
	d.save
	
You can then access the uri of the certificate like so:

	d.certificate #=> "http://localhost:3000/certificates/23"
	
You can add as many datasets to a user as you like, and access them like so:

	u = User.find_by_email(:email => "email@example.com")
	u.datasets
	
This application is built on top of [MongoMapper](http://mongomapper.com/). For more information, see the [MongoMapper Docs](http://mongomapper.com/documentation/).
  
  