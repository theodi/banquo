module CreateCertificate
  
  def self.perform(user, uri)
    cmd = `casperjs #{File.dirname(__FILE__)}/script/create-certificate.js #{ENV['BASE_URL']} #{user.email} #{user.password} #{uri}`
    binding.pry
    if cmd =~ /#{ENV['BASE_URL']}\/certificate/ 
      cmd.strip
    else
      false
    end
  end
  
end
