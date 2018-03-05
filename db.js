
const mongoose   = require('mongoose'),
      timestamps = require('mongoose-timestamp')
var config = require('./config/config.js');
TwitData = require('./models/TwitData');

mongoose.Promise = global.Promise;
mongoose.connect(config.dburl)

const db = mongoose.connection

db.on('error', (err) => {
    if (err.message.code === 'ETIMEDOUT') {
        console.log(err)
        mongoose.connect(config.db.uri, opts)
    }
});


function addData(myobj) {
    console.log(myobj);
    TwitData.create(myobj).then(task => {
        console.log("1 document inserted");
    })
    .catch(err => {
            console.log("Error creating ");
    });
}

function close() {
    db.close();
}

db.once('open', () => {
    myobj = { user: 'josiah_test', imgurl: 'https://notestore.co.in/wp-content/uploads/2017/12/APJ-Abdul-Kalam-e1506347132487.jpg', prediction: "Abdul" };
    TwitData.create(myobj).then(task => { console.log("1 document inserted");
        })
        .catch(err => {
                console.log("Error creating ");
        });

    myobj = { user: 'samuel_test', imgurl: 'https://smedia2.intoday.in/btmt/images/stories/abdul-kalam-1_660_072915091144.jpg', prediction: "Abdul" };
    setTimeout(addData, 1000, myobj);
    myobj = { user: 'sjs_test', imgurl: 'https://www.thefamouspeople.com/profiles/thumbs/a-p-j-abdul-kalam-2.jpg', prediction: "Abdul" };
    setTimeout(addData, 2000, myobj);
    myobj = { user: 'js_test', imgurl: 'https://notestore.co.in/wp-content/uploads/2017/12/APJ-Abdul-Kalam-e1506347132487.jpg', prediction: "Abdul" };
    setTimeout(addData, 3000, myobj);
    myobj = { user: 'sam_test', imgurl: 'https://smedia2.intoday.in/btmt/images/stories/abdul-kalam-1_660_072915091144.jpg', prediction: "Abdul" };
    setTimeout(addData, 4000, myobj);
    myobj = { user: 'joe_test', imgurl: 'https://www.thefamouspeople.com/profiles/thumbs/a-p-j-abdul-kalam-2.jpg', prediction: "Abdul" };
    setTimeout(addData, 5000, myobj);

    setTimeout(close, 6000);

});
