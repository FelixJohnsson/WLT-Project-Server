import { initUser } from "./database"
import { NewUserDataFromRequest, ResSendObject } from "./serverTypes"
import bcrypt from 'bcrypt'
import {
	v4 as uuid_v4
} from 'uuid'
import print from './print'
import send from './resSend'

export const handleNewUser = async (res:any, newUserData: NewUserDataFromRequest) => {
	const info: ResSendObject = {
		message: `Added user ${newUserData.username}`,
		status: 200,
		data: {
			username: newUserData.username,
			password: newUserData.password,
			internal_id: uuid_v4(),
			first_connection: ''
		}
	}
	const salt = await bcrypt.genSalt(10)
	info.data.password = await bcrypt.hash(newUserData.password, salt)

	initUser(info.data)
		.then((db) => {
			delete info.data.password
			info.data.username = db.username
			info.data.first_connection = db.first_connection
			print.info(info.message)
			send.success(res, 200, info)
		})
		.catch(err => {
			print.error(err)
			send.success(res, 500, {
				message: 'Failed to add user.',
				status: 500,
				data: 'Maybe already exists?'
			})
		})
}