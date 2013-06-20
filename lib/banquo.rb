require 'dotenv'
require 'mongo_mapper'
Dotenv.load

require_relative 'banquo/db'
require_relative 'banquo/schema'
require_relative 'banquo/create-user'
require_relative 'banquo/create-certificate'