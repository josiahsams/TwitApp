require('dotenv').config();

module.exports = {
  consumer_key: 'q072A1A5XqRp5ZQ8wVU53GISD',
  consumer_secret: process.env.CONSUMER_SECRECT,
  access_token: '969467272430538752-zgz9ZDxQTfnQJkZbGv12OYoKaK6ZaRT',
  access_token_secret: process.env.ACCESS_TOKEN_SECRECT,
  dburl: "mongodb://mongo:27017/joetest",
  predictor: "http://predictor:5000"
}
