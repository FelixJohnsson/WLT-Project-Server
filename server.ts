import express from 'express'
import 'dotenv/config'
import print  from './print'
import send from './resSend'
const app = express()
const port = process.env.PORT
// .env files are not included in .gitignore, so you need to uncomment it.

import { ResSendObject } from './serverTypes'

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

app.get('*', function(req, res){
	const info: ResSendObject = {
		message: 'Not found',
		status: 404,
		data: {

		}
	}
	print.warning(info.message)
	send.notFound(res, 404, info)
});
  

app.listen(port, () => print.success(`Example app listening on port ${port}`))