const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
	email : {type : String, required: true, unique : true},
	password : {type : String, required: true, unique : true}
})

module.exports = mongoose.model('Users', UsersSchema)