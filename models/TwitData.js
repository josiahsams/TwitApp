
const mongoose   = require('mongoose'),
      timestamps = require('mongoose-timestamp')

const TwitDataSchema = new mongoose.Schema({
	user: {
		type: String,
		trim: true,
		lowercase: true,
		required: true
	},
	imgurl: {
		type: String,
		trim: true,
		required: true
	},
    prediction: {
        type: String,
		trim: true
    }
}, { collection: 'twitData' })

TwitDataSchema.plugin(timestamps)

TwitData = mongoose.model('TwitData', TwitDataSchema)

module.exports = TwitData
