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
	workout: {
		name: string,
		description?: string,
		category: WorkoutCategory,
	}
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
	'incomplete' = 'incomplete',
	'invalid' = 'invalid',
	'retired' = 'retired'
}

export interface WorkoutFromDatabase {
	name: string,
	description: string,
	category: WorkoutCategory,
	id: {
		required: true,
		unique: true,
		type: string
	},
	sets: Array<number>,
	reps: Array<number>,
	weight: Array<number>,
	notes: string,
	status: Status,
	user_id: string
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
	workouts: []
}