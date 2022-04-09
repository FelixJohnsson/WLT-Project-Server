export interface ResSendObject {
	message: string,
	status: number,
	data?: any,
}

export interface NewUserDataFromRequest {
	username: string,
	password: string,
	id: string
}