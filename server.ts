import express from 'express'
import print  from './print'
import send from './resSend'
const app = express()
const port = 3000

app.get('/', (req, res) => {
	send.notFound(res, { message: 'Not found' })
})

app.listen(port, () => print.success(`Example app listening on port ${port}`))