import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { v4 as uuid_v4 } from 'uuid'
import axios from 'axios'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'

import print  from './print'
import send from './resSend'
import { ResSendObject } from './serverTypes'

const app = express()
express.Router()

app.use(express.static("public"))
	.use(cors())
	.use(cookieParser())
	.use(bodyParser.urlencoded({
		extended: false
	}))
	.use(bodyParser.json())

const port = process.env.PORT
// .env files are not included in .gitignore, so you need to uncomment it.

mongoose.connect(process.env.MONGO, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
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
	send.info(res, 200, info)
})

app.get('/home', (req, res) => {
	const info: ResSendObject = {
		message: 'Home page',
		status: 200,
		data: {

		}
	}
	print.info(info.message)
	send.success(res, 200, info)
})

app.get('/login', (req, res) => {
	const info: ResSendObject = {
		message: 'Login page',
		status: 200,
		data: {

		}
	}
	print.info(info.message)
	send.success(res, 200, info)
})

app.get('/user/:username', (req, res) => {
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
	send.success(res, 200, info)
})

app.get('*', function(req, res){
	const info: ResSendObject = {
		message: 'Not found - Fallback',
		status: 404,
		data: {

		}
	}
	print.warning(info.message)
	send.notFound(res, 404, info)
})


  

app.listen(port, () => print.success(`Example app listening on port ${port}`))