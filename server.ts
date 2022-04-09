import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import axios from 'axios'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import print from './print'
import send from './resSend'
import { handleLogin } from './loginHandler'
import {
	NewUserDataFromRequest,
	ResSendObject
} from './serverTypes'
import {
	getUser
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

const port = process.env.PORT

// ### MONGO CREDENTIALS ###
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const clusterName = process.env.DB_CLUSTER
const collectionName = process.env.DB_COLLECTION

mongoose.connect(`mongodb+srv://${username}:${password}@${clusterName}.vl6zz.mongodb.net/${collectionName}?retryWrites=true&w=majority`)
	.then(() => {
		print.success('Connected to MongoDB.');
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
			.then(db => {
				const info: ResSendObject = {
					message: `Found user: ${userData}`,
					status: 200,
					data: {
						username: db.username,
						socket: db.socket,
						first_connection: db.first_connection,
						latest_connection: db.latest_connection,
						internal_id: db.id
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

// ### 404 - FALLBACK ###
app.get('*', function (req, res) {
	const info: ResSendObject = {
		message: 'Not found - Fallback',
		status: 404,
	}
	print.warning(info.message)
	send.notFound(res, info.status, info)
})


app.listen(port, () => print.success(`Example app listening on port ${port}`))