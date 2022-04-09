import chalk from 'chalk'

const print = {
	success: (message: string): void => {
		console.log(chalk.white.bgGreen(message))
	},
	error: (message: string): void => {
		console.log(chalk.white.bgRed(message))
	},
	warning: (message: string): void => {
		console.log(chalk.white.bgYellow(message))
	},
	info: (message: string): void => {
		console.log(chalk.white.bgBlue(message))
	},
	debug: (message: string): void => {
		console.log(chalk.white.bgMagenta(message))
	},
	log: (message: string): void => {
		console.log(chalk.white.bgBlack(message))
	},
}

export default print