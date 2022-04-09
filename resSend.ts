const send = {
	  success: (res:any, data: Record<any, string>) => {
			res.status(200).send(data)
	  },
	  error: (res:any, data: Record<any, string>) => {
			res.status(400).send(data)
	  },
	  warning: (res:any, data: Record<any, string>) => {
			res.status(400).send(data)
	  },
	  info: (res:any, data: Record<any, string>) => {
			res.status(400).send(data)
	  },
	  notFound: (res:any, data: Record<any, string>) => {
			res.status(404).send(data)
	  },
}

export default send