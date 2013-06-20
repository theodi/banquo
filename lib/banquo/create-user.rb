module CreateUser
  
  def self.perform(email, password)
    cmd = `casperjs #{File.dirname(__FILE__)}/script/create-user.js #{ENV['BASE_URL']} #{email} #{password}`
    cmd =~ /User created/ or false
  end
  
end
