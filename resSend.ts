import { ResSendObject } from "./serverTypes"

const send = {
	  success: (res:any, status: number, data: ResSendObject) => {
			res.status(status).send(data)
	  },
	  error: (res:any, status: number,  data: ResSendObject) => {
			res.status(status).send(data)
	  },
	  warning: (res:any, status: number,  data: ResSendObject) => {
			res.status(status).send(data)
	  },
	  info: (res:any, status: number,  data: ResSendObject) => {
			res.status(status).send(data)
	  },
	  notFound: (res:any, status: number,  data: ResSendObject) => {
			res.status(status).send(data)
	  },
}

export default send