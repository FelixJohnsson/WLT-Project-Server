export interface ResSendObject {
	message: string,
	status: number,
	data?: any,
}

export interface NewUserDataFromRequest {
	username: string,
	password: string,
	internal_id?: string
}

export interface SaveWorkoutDataFromRequest {
	username: string,
	workout: WorkoutFromDatabase
}

export type RepsAndWeight = {
	weight: number,
	rep: number,
}

export enum WorkoutCategory {
	'Chest' = 'Chest',
	'Back' = 'Back',
	'Legs' = 'Legs',
	'Shoulders' = 'Shoulders',
	'Tricep' = 'Tricep',
	'Biceps' = 'Biceps',
	'Abs' = 'Abs',
	'Cardio' = 'Cardio',
	'Other' = 'Other'
}

export enum Status {
	'complete' = 'complete',
	'done' = 'done',
	'invalid' = 'invalid',
	'retired' = 'retired'
}

export interface WorkoutFromDatabase {
	name: string,
	description: string,
	category: WorkoutCategory,
	internal_id: string,
	repsAndWeight: RepsAndWeight[],
	notes?: string,
	status: Status,
	username: string
}

export interface UserFromDatabase {
	_id: any,
	username: string,
	password: string,
	internal_id: '70237492-a421-4633-82a8-c34033f5dca5', // UUID
	socket: null, // Socket ID
	latest_connection: string, // ISO Date
	first_connection: string, // ISO Date
	__v: number,
	workouts: WorkoutFromDatabase[]
	schedule: []
}

export interface SuccessfulLoginData {
	message: 'Login successful',
	status: 200,
	data: {
		username: string,
		internal_id: string,
		socket: string | null,
		latest_connect: string,
		first_connection: string
	}
}

export interface ErrorLoginData {
	message: 'Wrong password or username',
	status: 401,
}