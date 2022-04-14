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
	id: string,
	sets?: number[],
	reps?: number[],
	weight?: number[],
	notes?: string,
	status: Status,
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