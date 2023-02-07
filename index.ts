#! /usr/bin/env node

import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

interface IbankAccount {
    Debit: string
    Credit: string
}


class BankAccount<IbankAccount> {
    AccountBalance: number

    constructor() {
        this.AccountBalance = 100;
    }

    Debit(amount: number) {
        let statement = "Sorry, you have insuifficient Balance";

        if (amount > 0) {

            statement = "The amount you entered is wrong";

            if (this.AccountBalance > amount) {
                this.AccountBalance = this.AccountBalance - amount;
                statement = "The transaction is successfully! Your account balance is " + this.AccountBalance
            }
            else {
                statement = "You don't have enough money to do this transaction"
            }
        }
        return statement;
    }

    Credit(amount: number) {
        let statement = "Transaction Failed!"

        if (amount > 0) {
            this.AccountBalance = this.AccountBalance + amount
        }

        statement = "Your account has been credit successfully"
        return statement;
    }


}


class Customer {
    FirstName!: string;
    LastName!: string;
    Gender!: string;
    Age!: number;
    MobileNumber!: string;
    bankAccount!: BankAccount<IbankAccount>

    constructor(FirstName: string, LastName: string, Gender: string, Age: number, MobileNumber: string) {
        this.FirstName = FirstName;
        this.LastName = LastName;
        this.Gender = Gender;
        this.Age = Age;
        this.MobileNumber = MobileNumber;
        this.bankAccount = new BankAccount();
    }

    CustomerInfo(): string {
        return `Name: ${this.FirstName} ${this.LastName}
                Age: ${this.Age}
                Gender: ${this.Gender}
                Mobile: ${this.MobileNumber}
                Account Balance: ${this.bankAccount.AccountBalance}
        `
    }

}

const sleep = (v: number) => new Promise(r => { setTimeout(r, v) });
const spinnerfunc = async (spiningText: string, sleepingTime: number) => {
    const spinner = createSpinner(spiningText).start()
    await sleep(sleepingTime)
    spinner.success()
}

console.log(`
==========================================
            BANK APPLICATION
==========================================

`);


const gettingValueFromUser = async () => {
    let values = await inquirer.prompt([{
        name: 'firstname',
        type: "input",
        message: 'What is your firstname? '
    },
    {
        name: 'lastname',
        type: "input",
        message: 'What is your lastname? '
    },
    {
        name: 'Gender',
        type: "list",
        message: 'What is your Gender? ',
        choices: ["Male", 'Female']
    },
    {
        name: 'age',
        type: "input",
        message: 'What is your Age? '
    },
    {
        name: 'mobilenumber',
        type: "input",
        message: 'Enter your Mobile number: '
    },
    ])
    let customer = new Customer(values.firstname, values.lastname, values.Gender, values.age, values.mobilenumber);
    await spinnerfunc("Displaying Information... ", 2000)
    console.log(customer)

}
await gettingValueFromUser()

await sleep(3000)
await spinnerfunc("Loading please wait... ", 2000)


const banking = async () => {
    let bankAccount = new BankAccount()
    let bankingTask = await inquirer.prompt([{
        name: 'task',
        type: 'list',
        message: "What you want to do with your account?  ",
        choices: ["Account Balance Check", "Credit", "Debit"]
    }])


    switch (bankingTask.task) {

        case "Account Balance Check":
            await spinnerfunc("Checking Account Balance... ", 1000)
            console.log(`Your Account balance is $${bankAccount.AccountBalance}`)
            break;
        case "Credit":
            let crediting = await inquirer.prompt([{
                name: 'credit',
                type: 'number',
                message: "Enter amount: ",
            }])

            console.log(bankAccount.Credit(crediting.credit))
            await spinnerfunc("Amount is credited in your account... ", 1000)
            console.log(`Your current balance is $${bankAccount.AccountBalance}`)
            break;

        case "Debit":
            let debiting = await inquirer.prompt([{
                name: 'debit',
                type: 'number',
                message: "Enter amount: ",
            }])
            console.log(bankAccount.Debit(debiting.debit))
            await spinnerfunc("Amount is debited from your account... ", 1000)
            break;
    }


}



const repeater = async () => {
    do {
        await banking()
        var restart = await inquirer.prompt([{
            name: 'restartingvalue',
            type: 'list',
            message: "What would you like to do?  ",
            choices: ["Back", 'Exit']
        }])
    }
    while (restart.restartingvalue === "Back")
}

await repeater()