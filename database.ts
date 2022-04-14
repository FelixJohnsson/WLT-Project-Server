import mongoose from 'mongoose'
import { NewUserDataFromRequest } from './serverTypes'

export const workoutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: String,
	category: {
		type: ['Chest', 'Back', 'Legs', 'Shoulders', 'Tricep', 'Biceps', 'Abs', 'Cardio', 'Other'],
		required: true,
	},
	id: {
		type: String,
		required: true,
		unique: true,
	},
	sets: Array,
	reps: Array,
	weight: Array,
	notes: String,
	username: {
		type: String,
		required: true,
	}
})

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
    internal_id: String,
    socket: String,
    latest_connection: String,
    first_connection: String,
	workouts: [workoutSchema],
})

const userModel = mongoose.model('Users', userSchema)

const initUser = async (data:NewUserDataFromRequest):Promise<Record<string, any>> => { //@TODO TYPE THIS
	return new Promise((resolve, reject) => {
		userModel.findOne({internal_id: data.internal_id}, (err: any, user: any) => {
			if (err) {
				reject(err)
			} else if (user) {
				resolve(user)
			} else {
				const user = new userModel({
					internal_id: data.internal_id,
					username: data.username,
					password: data.password,
					socket: 'null',
					latest_connection: new Date().toISOString(),
					first_connection: new Date().toISOString()
				})
				user.save((err: any, user: any) => {
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

const getUser = async (username:string):Promise<Record<string, any>> => { //@TODO TYPE THIS
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: any) => {
			if (err) {
				reject(err)
			} else if (user) {
				console.log(user)
				resolve(user)
			} else {
				reject(err)
			}
		})
	})
}

const saveWorkoutToUser = async (username:string, workout):Promise<Record<string, any>> => { //@TODO TYPE THIS
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: any) => {
			if (err) {
				reject(err)
			} else if (user) {
				user.workouts.push(workout)
				user.save((err: any, user: any) => {
					if (err) {
						reject(err)
					} else {
						resolve(user)
					}
				})
			} else {
				reject('User not found')
			}
		})
	})
}

const getUserWorkouts = async (username:string):Promise<Record<string, any>> => { //@TODO TYPE THIS
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: any) => {
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
	getUser, initUser, saveWorkoutToUser, getUserWorkouts
}