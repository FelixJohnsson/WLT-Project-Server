import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { v4 as uuid_v4 } from 'uuid'
import axios from 'axios'
import bcrypt from 'bcrypt'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import print  from './print'
import send from './resSend'
import { NewUserDataFromRequest, ResSendObject } from './serverTypes'
import { initUser, getUser } from './database'

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
		data: {

		}
	}
	print.info(info.message)
	send.info(res, info.status, info)
})

app.get('/home', (req, res) => {
	const info: ResSendObject = {
		message: 'Home page',
		status: 200,
		data: {

		}
	}
	print.info(info.message)
	send.success(res, info.status, info)
})

app.get('/login', (req, res) => {
	const info: ResSendObject = {
		message: 'Login page',
		status: 200,
		data: {

		}
	}
	print.info(info.message)
	send.success(res, info.status, info)
})

app.post('/login', (req, res) => {
	const loginData: { username: string, password: string} = req.body
	if (loginData.username && loginData.password) {
		getUser(loginData.username)
			.then((user: any) => {
				if (user) {
					bcrypt.compare(loginData.password, user.password, (err: any, result: boolean) => {
						if (result) {
							const info: ResSendObject = {
								message: 'Login successful',
								status: 200,
								data: {
									username: user.username,
									id: user.id
								}
							}
							print.info(info.message)
							send.success(res, info.status, info)
						} else {
							const info: ResSendObject = {
								message: 'Wrong password or username',
								status: 401,
								data: {
									err
								}
							}
							print.info(info.message)
							send.info(res, info.status, info)
						}
					})
				} else {
					const info: ResSendObject = {
						message: 'User not found',
						status: 404,
						data: {

						}
					}
					print.info(info.message)
					send.info(res, info.status, info)
				}
			})
			.catch((err: any) => {
				const info: ResSendObject = {
					message: 'Failed to login',
					status: 500,
					data: {
						err
					}
				}
				print.error(info.message)
				send.error(res, info.status, info)
			})
	} else {
		const info: ResSendObject = {
			message: 'Missing username or password',
			status: 400,
			data: {

			}
		}
		print.info(info.message)
		send.info(res, info.status, info)
	}
})


app.get('/get_user/:username', (req, res) => {
	if (req.params.username) {
	const info: ResSendObject = {
		message: `Found user: ${req.params.username}`,
		status: 200,
		data: {
			username: req.params.username,
		}
	}
	getUser(info.data.username)
	.then((db)=> {
		info.data = db
		info.data.password = undefined
		print.info(info.message)
		send.success(res, 200, info)
	})
	.catch(err => {
		print.error(err)
		send.success(res, 404, {message: 'Failed to find user.', status: 404, data: {}})
	})
	} else {
		const info: ResSendObject = {
			message: 'No username provided',
			status: 400,
			data: {

			}
		}
		print.error(info.message)
		send.error(res, info.status, info)
	}
})

app.post('/add_user', async (req, res) => {
	const newUserData: NewUserDataFromRequest = req.body

	if(newUserData.username && newUserData.password) {
		const info: ResSendObject = {
			message: 'Added user',
			status: 200,
			data: {
				username: newUserData.username,
				password: newUserData.password,
				id: uuid_v4()
			}
		}
		const salt = await bcrypt.genSalt(10)
		info.data.password = await bcrypt.hash(newUserData.password, salt)

		initUser(info.data)
		.then((db)=> {
			info.data = db
			print.info(info.message)
			send.success(res, 200, info)
		})
		.catch(err => {
			print.error(err)
			send.success(res, 500, {message: 'Failed to add user.', status: 500, data: 'Maybe already exists?'})
		})
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
app.get('*', function(req, res){
	const info: ResSendObject = {
		message: 'Not found - Fallback',
		status: 404,
		data: {

		}
	}
	print.warning(info.message)
	send.notFound(res, info.status, info)
})


  

app.listen(port, () => print.success(`Example app listening on port ${port}`))