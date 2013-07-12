module Banquo
  def self.create_user(options)
    cmd = `casperjs --web-security=no #{File.dirname(__FILE__)}/script/create-user.js #{BASE_URL} #{options[:email]} #{options[:password]}`
    cmd =~ /User created/ or false
  end
  
  def self.create_certificate(options)
    pid = fork do
      exec "ruby #{File.dirname(__FILE__)}/app/app.rb"
    end
    cmd = `casperjs --web-security=no #{File.dirname(__FILE__)}/script/create-certificate.js #{BASE_URL} #{options[:user].email} #{options[:user].password} #{options[:uri]}`
    Process.kill 'TERM', pid
    Process.wait pid
    if cmd =~ /#{BASE_URL}\/certificate/ 
      cmd.strip
    else
      false
    end
  end
end