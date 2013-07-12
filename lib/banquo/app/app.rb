require 'sinatra'
require 'json'
require 'data_kitten'

File.open('/tmp/datakitten.pid', 'w') {|f| f.write Process.pid }

get '/data-kitten' do
  content_type :json
  dataset = DataKitten::Dataset.new(access_url: params[:url])
  if dataset.supported?
  
    distributions = []
    dataset.distributions.each do |distribution|
      distributions << {
        :title       => distribution.title,
        :description => distribution.description,
        :access_url  => distribution.access_url,
        :extension   => distribution.format.extension,
        :open        => distribution.format.open?,
        :structured  => distribution.format.structured?
      }
    end
  
    publishers = []
    dataset.publishers.each do |publisher|
      publishers << {
        :name     => publisher.name,
        :homepage => publisher.homepage,
        :mbox     => publisher.mbox
      }
    end
  
    licenses = []
    dataset.licenses.each do |license|
      licenses << {
        :id   => license.id,
        :name => license.name,
        :uri  => license.uri,
        :type => license.type
      }
    end
  
    {
      :title             => dataset.data_title,
      :description       => dataset.description,
      :publishers        => publishers,
      :rights            => dataset.rights,
      :licenses          => licenses,
      :update_frequency  => dataset.update_frequency,
      :keywords          => dataset.keywords,
      :distributions     => distributions,
      :release_date      => dataset.issued,
      :modified_date     => dataset.modified,
      :temporal_coverage => dataset.temporal
    }.to_json
  end

end