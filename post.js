
var fs = require('fs');
var twit = require('twit');
var config = require('./config/config.js');

var Twitter = new twit(config);

var PostTweet = function(){
    var b64content = fs.readFileSync('/Users/josiahsams/Desktop/DSC09964.JPG', { encoding: 'base64' })

    // first we must post the media to Twitter
    Twitter.post('media/upload', { media_data: b64content }, function (err, data, response) {
      // now we can assign alt text to the media, for use by screen readers and
      // other text-based presentations and interpreters
      var mediaIdStr = data.media_id_string
      var altText = "Small flowers in a planter on a sunny balcony, blossoming."
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      Twitter.post('media/metadata/create', meta_params, function (err, data, response) {
        if (!err) {
          // now we can reference the media and post a tweet (media will attach to the tweet)
          var params = { status: 'loving life #DemoPowerAI', media_ids: [mediaIdStr] }

          Twitter.post('statuses/update', params, function (err, data, response) {
            console.log(data)
          })
        }
      })
  })
}

PostTweet();
