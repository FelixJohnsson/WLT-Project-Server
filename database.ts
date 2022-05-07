import mongoose from 'mongoose'
import { NewUserDataFromRequest, SaveWorkoutDataFromRequest, UserFromDatabase, WorkoutFromDatabase } from './serverTypes'

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
	internal_id: {
		type: String,
		unique: true,
	},
	repsAndWeight: Array,
	username: {
		type: String,
	},
	status: String, //@TODO TYPE THIS
	notes: String,
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
	schedule: [] // @TODO TYPE THIS
})

const userModel = mongoose.model('Users', userSchema)

const initUser = async (data:NewUserDataFromRequest):Promise<UserFromDatabase> => { //@TODO TYPE THIS
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

const getUser = async (username:string):Promise<UserFromDatabase> => { 
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: any) => {
			if (err) {
				reject(err)
			} else if (user) {
				resolve(user)
			} else {
				reject(err)
			}
		})
	})
}

const saveWorkoutToUser = async (username:string, workout: WorkoutFromDatabase):Promise<UserFromDatabase> => {
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

const saveScheduleToUser = async (username: string, workout: [WorkoutFromDatabase], dateString: string):Promise<UserFromDatabase> => {
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, (err: any, user: any) => {
			if (err) {
				reject(err)
			} else if (user) {
				user.schedule.push({
					date: dateString,
					workouts: [...workout]
				})
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
	getUser, initUser, saveWorkoutToUser, getUserWorkouts, saveScheduleToUser
}