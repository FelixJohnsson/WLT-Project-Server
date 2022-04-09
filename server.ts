import express from 'express'
import 'dotenv/config'
import print  from './print'
import send from './resSend'
const app = express()
const port = process.env.PORT
// .env files are not included in .gitignore, so you need to uncomment it.

app.get('/', (req, res) => {
	send.notFound(res, { message: 'Not found' })
})

app.listen(port, () => print.success(`Example app listening on port ${port}`))