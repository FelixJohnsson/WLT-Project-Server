import { getUser } from "./database"
import { ErrorLoginData, ResSendObject, SuccessfulLoginData } from "./serverTypes"
import bcrypt from 'bcrypt'
import print from './print'
import send from './resSend'

export const handleLogin = (res:any, loginData: { username: string, password: string}) => {
	getUser(loginData.username)
	.then((user: any) => {
		if (user) {
			bcrypt.compare(loginData.password, user.password, (err: any, result: boolean) => {
				if (result) {
					const info: SuccessfulLoginData = {
						message: 'Login successful',
						status: 200,
						data: {
							username: user.username,
							internal_id: user.internal_id,
							socket: user.socket,
							latest_connect: user.latest_connect,
							first_connection: user.first_connection
						}
					}
					print.info(info.message)
					send.success(res, info.status, info)
				} else {
					const info: ErrorLoginData = {
						message: 'Wrong password or username',
						status: 401,
					}
					print.warning(info.message)
					send.info(res, info.status, info)
				}
			})
		} else {
			const info: ErrorLoginData = {
				message: 'Wrong password or username',
				status: 401,
			}
			print.info(info.message)
			send.info(res, info.status, info)
		}
	})
	.catch((err: any) => {
		const info: ErrorLoginData = {
			message: 'Wrong password or username',
			status: 401,
		}
		print.warning(info.message)
		send.error(res, info.status, info)
	})
}