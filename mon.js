var twit = require('twit');
var config = require('./config/config.js');
var fs = require('fs')
const tempfile = require('tempfile');
const request = require('request');
const cheerio = require('cheerio')
const requestImageSize = require('request-image-size');
const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp')
TwitData = require('./models/TwitData');

mongoose.Promise = global.Promise;
mongoose.connect(config.dburl)

const db = mongoose.connection

db.on('error', (err) => {
    if (err.message.code === 'ETIMEDOUT') {
        console.log(err)
        mongoose.connect(config.dburl, opts)
    }
});


function addData(myobj) {
    // console.log(myobj);
    TwitData.create(myobj).then(task => {
            console.log("Document inserted in DB");
        })
        .catch(err => {
            console.log("Error creating ");
        });
}

var Twitter = new twit(config);
var hash = '#DemoPowerAI'

var MonitorTweet = function() {
    var stream = Twitter.stream('statuses/filter', {
        track: hash,
        language: 'en'
    })

    console.log("Looking for Tweets with hashtag #" + hash);
    stream.on('tweet', function(tweet) {
        //      console.log(tweet);
        console.log("User : " + tweet.user.name);
        ttext = tweet.text;
        console.log("Text : " + ttext);
        url = ttext.match(/(http*[^\n|^ ]*)/g);

        if (typeof(url) != 'undefined' && url != null) {
            url = url[0];
            console.log("URL : " + url);
            request(url, {
                json: false
            }, (err, res, body) => {
                if (err) {
                    return console.log(err);
                }
                const $ = cheerio.load(body);
                imgurl = $('div .AdaptiveMedia-photoContainer').attr('data-image-url');
                if (typeof(imgurl) != 'undefined' && imgurl != null) {
                    extn = imgurl.split('.').pop();
                    filename = tempfile('.' + extn);
                } else {
                    imgurl = url;
                    filename = tempfile('.jpg');
                }

                console.log("Img URL : " + imgurl);
                request.head(imgurl, function(err, res, body) {
                    contyp = res.headers['content-type']
                    console.log('content-type:', res.headers['content-type']);
                    if (contyp.match("image")) {
                        var actualImgRef = res.request.uri.href;
                        console.log(actualImgRef);
                        requestImageSize(actualImgRef)
                            .then(size => {
                                // sizeObj = JSON.parse(size);
                                console.log(size);
                                // console.log(size.width);
                                // console.log(size.height);

                                var paramList = {
                                    url: actualImgRef,
                                    width: size.width,
                                    height: size.height
                                };
                                console.log(paramList);
                                // url: "http://kinford3.aus.stglabs.ibm.com:5000/",
                                request({
                                    url: config.predictor,
                                    qs: paramList
                                }, function(err, response, body) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    prediction = JSON.parse(body);
                                    console.log(prediction);
                                    myobj = {
                                        "user": tweet.user.name,
                                        "imgurl": actualImgRef,
                                        "prediction": prediction[0].label
                                    };

                                    addData(myobj);
                                });
                            })
                            .catch(err => console.error(err));





                        // request(imgurl).pipe(fs.createWriteStream(filename)).on('close', function(){
                        //   console.log('File Downloaded to ' + filename);
                        // });
                    } else {
                        console.log("Not an image");
                    }
                });
            });
        } else {
            console.log("Unable to detect URL in the text");
        }
    })
}

MonitorTweet();

// config.js
// module.exports = {
//  consumer_key: '',
//  consumer_secret: '',
//  access_token: '',
//  access_token_secret: ''
//}
