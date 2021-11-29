export type Account = {
	name: string,
	cpf: string,
	birthDate: Date,
	balance: number,
	statement: Transaction[]
}

export type Transaction = {
	description: string,
	value: number,
	date: string
}