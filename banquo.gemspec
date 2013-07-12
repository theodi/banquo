lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

Gem::Specification.new do |s|
  s.name        = "banquo"
  s.version     = "0.0.1"
  s.authors     = ["Stuart Harrison"]
  s.email       = ["tech@theodi.org"]
  s.homepage    = "http://github.com/banquo"
  s.summary     = "A set of scripts that, combined with the power of phantom.js, casper.js and a little bit of data-kitten, automagically creates ODI Open Data Certificates to Raw level for datasets that are hosted in CKAN repositories."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["LICENSE.md", "README.md"]

  s.add_dependency "mongo_mapper"
  s.add_dependency "bson_ext"
  s.add_dependency "casperjs"
  s.add_dependency "sinatra"
end