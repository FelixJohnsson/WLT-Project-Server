import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 20
	},
    id: String,
    socket: String,
    latest_connection: String,
    first_connection: String,
})

const userModel = mongoose.model('users', userSchema)

const initUser = async (id: string, username: string):Promise<typeof userSchema> => {

	return new Promise((resolve, reject) => {
		userModel.findOne({id: id}, (err: any, user: mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}> | PromiseLike<mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}>>) => {
			if (err) {
				reject(err)
			} else if (user) {
				resolve(user)
			} else {
				const user = new userModel({
					id: id,
					username: username,
					socket: 'null',
					latest_connection: new Date().toISOString(),
					first_connection: new Date().toISOString()
				})
				user.save((err: any, user: mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}> | PromiseLike<mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}>>) => {
					if (err) {
						reject(err)
					} else {
						resolve(user)
					}
				})
			}
		})
	})
}

export default {
	initUser
}