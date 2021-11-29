import express, { Express, Request, Response } from "express";
import cors from "cors";
import { AddressInfo } from "net";
import { accounts } from "./accounts";

const app: Express = express();
app.use(express.json());
app.use(cors());

// buscar todas as contas
app.get("/account", (req: Request, res: Response) => {
	let errorCode = 400;
	try {
		if (!accounts.length) {
			errorCode = 404;
			throw new Error("No accounts found")
		}

		res.status(200).send(accounts);
	} catch (error: any) {
		res.status(errorCode).send({ message: error.message })
	}
})

// consultar o saldo da conta
app.get("/balance", (req: Request, res: Response) => {
	let errorCode = 400;
	try {
		let cpf = req.query.cpf as string;

		if ((cpf as string).length !== 14) {
			throw new Error("CPF must have 11 digits and must be a string with the following format: 000.000.000-00")
		}

		if (cpf) {
			const account = accounts.find(account => account.cpf === cpf);
			const balance = account?.balance;

			return res.status(200).send({ "Saldo": balance });
		}

		throw new Error("Account not found")
	} catch (error: any) {
		res.status(errorCode).send({ message: error.message })
	}
})

// criar conta
app.post("/account", (req: Request, res: Response) => {
	let errorCode = 400;
	try {
		// validar as entradas da requisição >>> pulamos por enquanto

		const { name, cpf, birthDateStr } = req.body; // dd/mm/yyyy

		const [day, month, year] = birthDateStr.split("/");

		const birthDate: Date = new Date(`${year}-${month}-${day}`);

		const ageInMilisseconds: number = Date.now() - birthDate.getTime();

		const ageInYears: number = ageInMilisseconds / 1000 / 60 / 60 / 24 / 365;

		if (ageInYears < 18) {
			errorCode = 406;
			throw new Error("User must be 18 or older.")
		}

		if (!name || !cpf || !birthDateStr) {
			throw new Error("Missing data in body to create user");
		}

		if (typeof name !== "string") {
			throw new Error("Invalid format. Name must be a string");
		}

		if (typeof cpf !== "string") {
			throw new Error("Invalid format. CPF must be a string with the following format: 000.000.000-00");
		}

		if ((cpf as string).length !== 14) {
			throw new Error("CPF must have 11 digits and must be a string with the following format: 000.000.000-00")
		}

		if (typeof birthDateStr !== "string") {
			throw new Error("Invalid format. Birth date must be a string with the following format: DD/MM/YY");
		}

		const checkedCpf = accounts.filter(account => account.cpf === cpf)

		if (checkedCpf.length !== 0) {
			throw new Error("CPF already registered")
		}

		accounts.push({
			name,
			cpf,
			birthDate,
			balance: 0,
			statement: []
		})

		res.status(200).send({ message: "Account successfully created" });
	} catch (error: any) {
		res.status(errorCode).send({ message: error.message })
	}

})

// faz depósito
app.put("/deposit", (req: Request, res: Response) => {
	let errorCode = 400;
	try {
		let cpf = req.query.cpf as string;
		let name = req.query.name as string;

		if ((cpf as string).length !== 14) {
			throw new Error("CPF must have 11 digits and must be a string with the following format: 000.000.000-00")
		}

		if (cpf) {
			let account = accounts.find(account => account.cpf === cpf);

			if (account) {

			}
		}
		return res.status(200).send({ "Saldo": balance });

		throw new Error("Account not found")
	} catch (error: any) {
		res.status(errorCode).send({ message: error.message })
	}
})

const server = app.listen(process.env.PORT || 3003, () => {
	const address = server.address() as AddressInfo;
	if (server) {
		console.log(`Server is running in http://localhost: ${address.port}`)
	} else {
		console.error(`Failure upon starting server.`);
	}
})