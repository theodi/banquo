module Banquo
  def self.create_user(options)
    cmd = `casperjs #{File.dirname(__FILE__)}/script/create-user.js #{BASE_URL} #{options[:email]} #{options[:password]}`
    cmd =~ /User created/ or false
  end
  
  def self.create_certificate(options)
    binding.pry
    cmd = `casperjs #{File.dirname(__FILE__)}/script/create-certificate.js #{BASE_URL} #{options[:user].email} #{options[:user].password} #{options[:uri]}`
    if cmd =~ /#{BASE_URL}\/certificate/ 
      cmd.strip
    else
      false
    end
  end
end