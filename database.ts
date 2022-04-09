import mongoose from 'mongoose'
import { NewUserDataFromRequest } from './serverTypes'

export const userSchema = new mongoose.Schema({
    username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 20
	},
	password: String,
    id: String,
    socket: String,
    latest_connection: String,
    first_connection: String,
})

const userModel = mongoose.model('Users', userSchema)

const initUser = async (data:NewUserDataFromRequest):Promise<typeof userSchema> => {
	return new Promise((resolve, reject) => {
		userModel.findOne({id: data.id}, (err: any, user: mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}> | PromiseLike<mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}>>) => {
			if (err) {
				reject(err)
			} else if (user) {
				resolve(user)
			} else {
				const user = new userModel({
					id: data.id,
					username: data.username,
					password: data.password,
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

const getUser = async (username:string):Promise<typeof userSchema> => {
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}> | PromiseLike<mongoose.Schema<any, mongoose.Model<any, any, any, any>, {}, {}>>) => {
			if (err) {
				reject(err)
			} else if (user) {
				resolve(user)
			} else {
				reject('User not found')
			}
		})
	})
}

export {
	getUser, initUser
}