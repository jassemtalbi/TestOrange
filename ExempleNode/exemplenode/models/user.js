const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: true},
		lastname: { type: String, required: true},
		password: { type: String},
		email: { type: String, required: true ,unique: true },
		Direction:{type:Array, required:false}
	},
	{ collection: 'SuperUser' } //specification 
)
const model = mongoose.model('AdminSchema', AdminSchema)

module.exports = model