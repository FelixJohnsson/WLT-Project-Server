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
	sets?: number[],
	reps?: number[],
	weight?: number[],
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