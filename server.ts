import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import axios from 'axios'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import print from './print'
import send from './resSend'
import { handleLogin } from './loginHandler'
import {
	NewUserDataFromRequest,
	ResSendObject,
	SaveWorkoutDataFromRequest,
	Status,
	UserFromDatabase,
	WorkoutFromDatabase,
} from './serverTypes'
import {
	getUser, getUserWorkouts, saveWorkoutToUser, initUser, saveScheduleToUser, getScheduleByDate, saveWorkoutsOrder
} from './database'
import { handleNewUser } from './userHandler'

const app = express()
express.Router()

app.use(express.static("public"))
	.use(cors())
	.use(cookieParser())
	.use(bodyParser.urlencoded({
		extended: true
	}))
	.use(bodyParser.json())

// ### MONGO CREDENTIALS ###
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const clusterName = process.env.DB_CLUSTER
const collectionName = process.env.DB_COLLECTION
const PORT = process.env.PORT

mongoose.connect(`mongodb+srv://${username}:${password}@${clusterName}.vl6zz.mongodb.net/${collectionName}?retryWrites=true&w=majority`)
	.then(() => {
		print.success('Connected to MongoDB.')
	})
	.catch((err: any) => {
		print.error('Failed to connect to MongoDB.')
		print.error(err)
	})

app.get('/', (req, res) => {
	const info: ResSendObject = {
		message: 'Start page',
		status: 200,
	}
	print.info(info.message)
	send.info(res, info.status, info)
})

app.get('/home', (req, res) => {
	const info: ResSendObject = {
		message: 'Home page',
		status: 200,
	}
	print.info(info.message)
	send.success(res, info.status, info)
})

app.get('/login', (req, res) => {
	const info: ResSendObject = {
		message: 'Login page',
		status: 200,
	}
	print.info(info.message)
	send.success(res, info.status, info)
})

app.post('/login', (req, res) => {
	const loginData: {
		username: string,
		password: string
	} = req.body

	if (loginData.username && loginData.password) {
		handleLogin(res, loginData)
	} else {
		const info: ResSendObject = {
			message: 'Missing username or password',
			status: 400,
		}
		print.info(info.message)
		send.info(res, info.status, info)
	}
})


app.get('/get_user/:username', (req, res) => {
	const userData: string = req.params.username
	if (userData) {
		getUser(userData)
			.then((db:UserFromDatabase) => {
				const info: ResSendObject = {
					message: `Found user: ${userData}`,
					status: 200,
					data: {
						username: db.username,
						socket: db.socket,
						first_connection: db.first_connection,
						latest_connection: db.latest_connection,
						internal_id: db.internal_id,
						workouts: db.workouts,
						workouts_count: db.workouts.length,
						schedule: db.schedule
					}
				}
				print.info(info.message)
				send.success(res, 200, info)
			})
			.catch(err => {
				print.error(err)
				send.success(res, 404, {
					message: 'Failed to find user.',
					status: 404,
				})
			})
	} else {
		const info: ResSendObject = {
			message: 'No username provided',
			status: 400,
		}
		print.error(info.message)
		send.error(res, info.status, info)
	}
})

app.post('/add_user', async (req, res) => {
	const newUserData: NewUserDataFromRequest = req.body

	if (newUserData.username && newUserData.password) {
		handleNewUser(res, newUserData)
	} else {
		const info: ResSendObject = {
			message: 'Bad payload - missing username or password',
			status: 400,
			data: {
				username: newUserData.username,
				password: newUserData.password,
			}
		}
		print.warning(info.message)
		send.success(res, info.status, info)
	}
})

app.get('/get_workouts/:username', (req, res) => {
	const username: string = req.params.username
	if (username) {
		getUserWorkouts(username)
		.then((data) => {
			if(data.workouts.length > 0) {
			const info: ResSendObject = {
				message: `Found workouts for user: ${username}`,
				status: 200,
			}
			print.info(info.message)
			send.success(res, info.status, info)
		} else {
			const info: ResSendObject = {
				message: `No workouts found for user: ${username}`,
				status: 200,
			}
			print.info(info.message)
			send.success(res, info.status, info)
		}
		})
		.catch(err => {
			const info: ResSendObject = {
				message: err,
				status: 404,
			}
			print.info(info.message)
			send.error(res, info.status, info)
		})
	}
})

app.post('/save_workout', (req, res) => {
	const data:{username: string, workout: WorkoutFromDatabase} = req.body // @TODO - validate data
	console.log(data)
	const newWorkout:SaveWorkoutDataFromRequest =  {
		username: data.username,
		workout: {
			name: data.workout.name,
			description: data.workout.description,
			category: data.workout.category,
			status: Status.complete,
			internal_id: uuidv4(),
			username: data.username,
			repsAndWeight: data.workout.repsAndWeight,
			notes: ''
		}
	}
	saveWorkoutToUser(data.username, newWorkout.workout)
	.then((success) => {
		const info: ResSendObject = {
			message: `Saved ${data.workout.name} workout for user: ${success.username}`,
			status: 200,
		}
		print.info(info.message)
		send.success(res, info.status, info)
	})
	.catch((err) => {
		// @TODO - check/handle error
		const info: ResSendObject = {
			message: err,
			status: 404,
		}
		print.info(info.message)
		send.error(res, info.status, info)
	})
})

app.post('/save_workouts', (req, res) => {
	const data:{username: string, workouts: [WorkoutFromDatabase]} = req.body

	saveWorkoutsOrder(data.username, data.workouts)
	.then((success) => {
		const info: ResSendObject = {
			message: `Saved ${data.workouts.length} workouts for user: ${data.username}`,
			status: 200,
		}
		print.info(info.message)
		send.success(res, info.status, info)
	}
	)
	.catch((err) => {
		// @TODO - check/handle error
		const info: ResSendObject = {
			message: err,
			status: 404,
		}
		print.info(info.message)
		send.error(res, info.status, info)
	})	
})

app.post('/save_new_schedule_entry', (req, res) => {
	const data:{username: string, scheduleEntry: any, dateString: string} = req.body // @TODO - validate data
	console.warn('Saving schedule')
	console.log(data.username, data.scheduleEntry)

	saveScheduleToUser(data.username, data.scheduleEntry, data.dateString)
	.then((success) => {
		const info: ResSendObject = {
			message: `Saved new schedule entry for user: ${success.username}`,
			status: 200,
		}
		console.log('SUCCESS ', success)
		print.info(info.message)
		send.success(res, info.status, info)
	})
	.catch((err) => {
		const info: ResSendObject = {
			message: err,
			status: 400,
		}
		print.info(info.message)
		send.error(res, info.status, info)
	})
})

app.get('/get_schedule/:username/:dateString', (req, res) => {
	const username: string = req.params.username
	const dateString: string = req.params.dateString
	if (username && dateString) {
		getScheduleByDate(username, dateString)
		.then((data) => {
			const info: ResSendObject = {
				message: `Found schedule for user: ${username}`,
				status: 200,
				data
			}
			print.info(info.message)
			send.success(res, info.status, info)
		})
		.catch(err => {
			const info: ResSendObject = {
				message: err,
				status: 404,
			}
			print.info(info.message)
			send.error(res, info.status, info)
		})
	}
})

// ### 404 - FALLBACK ###
app.get('*', function (req, res) {
	const info: ResSendObject = {
		message: 'Not found - Fallback',
		status: 404,
	}
	print.warning(info.message)
	send.notFound(res, info.status, info)
})


app.listen(PORT, () => print.success(`Example app listening on PORT ${PORT}`))