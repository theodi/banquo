class User
  include MongoMapper::Document

  key :email, String
  key :password, String
  
  timestamps!
  
  before_validation :create_user, :on => :create
  validates_uniqueness_of :email
  validate :casper_success
  
  private
  
  def create_user
    @success = CreateUser.perform(email, password)
  end
  
  def casper_success
    errors.add( :email, "Fail!") if @success === false
  end
end

class Dataset
  include MongoMapper::Document

  key :uri, String
  key :certificate, String
  
  timestamps!
  
  belongs_to :user
  
  before_validation :create_certificate, :on => :create
  validates_uniqueness_of :certificate
  validate :casper_success

  private
  
  def create_certificate
    self.certificate = CreateCertificate.perform(user, uri)
  end
  
  def casper_success
    errors.add( :certificate, "Fail!") if self.certificate === false
  end

end