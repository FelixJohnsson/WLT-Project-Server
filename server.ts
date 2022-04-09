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
import initUser from './database'

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
// .env files are not included in .gitignore, so you need to uncomment it.

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

app.get('/get_user/:username', (req, res) => {
	const info: ResSendObject = {
		message: `User page: ${req.params.username}`,
		status: 200,
		data: {
			username: req.params.username,
			password: 'test',
			id: uuid_v4()
		}
	}
	print.info(info.message)
	send.success(res, info.status, info)
})

app.post('/add_user', async (req, res) => {
	const newUserData: NewUserDataFromRequest = req.body
	console.log(req.body)

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