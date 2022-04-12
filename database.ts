import mongoose from 'mongoose'
import { NewUserDataFromRequest } from './serverTypes'

export enum WorkoutCategory {
	'Chest' = 'Chest',
	'Back' = 'Back',
	'Legs' = 'Legs',
	'Shoulders' = 'Shoulders',
	'Tricep' = 'Tricep',
	'Biceps' = 'Biceps',
	'Abs' = 'Abs',
	'Cardio' = 'Cardio',
	'Other' = 'Other'
}

export const workoutSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: String,
	category: {
		type: WorkoutCategory,
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
	user_id: {
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

const initUser = async (data:NewUserDataFromRequest):Promise<Record<string, any>> => {
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

const getUser = async (username:string):Promise<Record<string, any>> => {
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

const saveWorkoutToUser = async (user:Record<string, any>, workout:any):Promise<Record<string, any>> => {
	return new Promise((resolve, reject) => {
		user.push(workout)
		user.save((err: any, user: any) => {
			if (err) {
				reject(err)
			} else {
				resolve(user)
			}
		})
	})
}

const getUserWorkouts = async (internal_id:string):Promise<Record<string, any>> => {
	return new Promise((resolve, reject) => {
		userModel.findOne({internal_id: internal_id}, (err: any, user: any) => {
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