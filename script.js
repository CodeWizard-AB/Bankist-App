"use strict";

// * USER DATA -

const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		"2019-11-18T21:31:17.178Z",
		"2019-12-23T07:42:02.383Z",
		"2020-01-28T09:15:04.904Z",
		"2020-04-01T10:17:24.185Z",
		"2020-05-08T14:11:59.604Z",
		"2020-05-27T17:01:17.194Z",
		"2020-07-11T23:36:17.929Z",
		"2020-07-12T10:51:36.790Z",
	],
	currency: "EUR",
	locale: "pt-PT", // de-DE
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2019-12-25T06:04:23.907Z",
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-06-25T18:49:59.371Z",
		"2020-07-26T12:01:20.894Z",
	],
	currency: "USD",
	locale: "en-US",
};

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// * ELEMENT SELECTIONS -

// * GENERAL ELEMENTS

const balanceAmount = document.getElementById("balance");
const movementContainer = document.getElementById("movements");
const welcomeLabel = document.getElementById("welcome");
const containerApp = document.querySelector("main");
const creditAmount = document.getElementById("credit");
const debitAmount = document.getElementById("debit");
const interestAmount = document.getElementById("interest");

// * BUTTON ELEMENTS

const loginBtn = document.getElementById("login_btn");
const transferBtn = document.getElementById("transfer_btn");
const loanBtn = document.getElementById("loan_btn");
const closeBtn = document.getElementById("close_btn");
const sortBtn = document.getElementById("sort_btn");

// * INPUT ELEMENTS

const transferToInput = document.getElementById("transfer_user");
const transferAmount = document.getElementById("transfer_amount");
const loanAmount = document.getElementById("loan_amount");
const confirmUser = document.getElementById("confirm_user");
const confirmPin = document.getElementById("confirm_pin");
const userName = document.getElementById("user_name");
const userPin = document.getElementById("user_pin");

// * FUNCTIONS -

const userCreate = () => {
	accounts.forEach((acc) => {
		acc.username = acc.owner
			.split(" ")
			.map((word) => word[0].toLowerCase())
			.join("");
	});
};

userCreate();

const updateBalance = (acc) => {
	accounts.forEach((account) => {
		account.balance = account.movements.reduce((total, mov) => total + mov);
	});
	balanceAmount.textContent = acc.balance.toFixed(2) + " $";
};

const updateMovements = (acc, sort) => {
	movementContainer.innerHTML = "";

	const movs = sort
		? acc.movements.slice().sort((a, b) => a - b)
		: acc.movements;

	movs.forEach((mov, i) => {
		const movType = mov > 0 ? "deposit" : "withdrawal";
		const movHtml = `
		<div>
			<p class="${movType}">${i + 1} ${movType}</p>
			<p class="flex-1">12/03/2020</p>
			<p class="cash">${Math.abs(mov)}$</p>
		</div>`;
		movementContainer.insertAdjacentHTML("afterbegin", movHtml);
	});
};

const updateSummary = (acc) => {
	const totalCredit = acc.movements
		.filter((mov) => mov > 0)
		.reduce((total, mov) => total + mov);

	creditAmount.textContent = totalCredit.toFixed(2) + "$";

	const totalDebit = acc.movements
		.filter((mov) => mov < 0)
		.reduce((total, mov) => total + mov);

	debitAmount.textContent = Math.abs(totalDebit).toFixed(2) + "$";

	const totalInterest = acc.movements
		.filter((mov) => mov > 0)
		.map((dep) => (dep * acc.interestRate) / 100)
		.filter((int) => int >= 0)
		.reduce((total, int) => total + int);

	interestAmount.textContent = totalInterest.toFixed(2) + "$";
};

const updateUI = (acc) => {
	updateMovements(acc);
	updateSummary(acc);
	updateBalance(acc);
};

// * EVENT HANDLERS -

let currentAccount, appTimer;

sortBtn.addEventListener("click", (e) => {
	e.preventDefault();
	updateMovements(currentAccount, true);
});

loginBtn.addEventListener("click", (e) => {
	e.preventDefault();
	currentAccount = accounts.find(
		(acc) =>
			acc.username === userName.value && acc.pin === Number(userPin.value)
	);

	if (currentAccount) {
		containerApp.classList.remove("hide");
		welcomeLabel.textContent = `Welcome, ${
			currentAccount?.owner.split(" ")[0]
		}!`;
	}

	updateUI(currentAccount);
	userName.value = userPin.value = "";
});

transferBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const transferValue = Number(transferAmount.value);
	const transferTo = transferToInput.value;
	const recipent = accounts.find((acc) => acc.username === transferTo);

	if (
		recipent &&
		transferTo !== currentAccount.username &&
		currentAccount.balance >= transferValue &&
		transferValue > 0
	) {
		recipent.movements.push(transferValue);
		currentAccount.movements.push(-transferValue);
	}

	updateUI(currentAccount);
	transferToInput.value = transferAmount.value = "";
});

loanBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const requestAmount = Number(loanAmount.value);
	if (
		currentAccount.movements.some((mov) => mov >= requestAmount * 0.1) &&
		requestAmount > 0
	) {
		currentAccount.movements.push(requestAmount);
	}

	updateUI(currentAccount);
	loanAmount.value = "";
});

closeBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (
		confirmUser.value === currentAccount.username &&
		Number(confirmPin.value) === currentAccount.pin
	) {
		containerApp.classList.add("hide");
		const userIndex = accounts.findIndex(
			(acc) => acc.username === currentAccount.username
		);
		accounts.splice(userIndex, 1);
		welcomeLabel.textContent = "Log in to get started";
	}

	confirmUser.value = confirmPin.value = "";
});
