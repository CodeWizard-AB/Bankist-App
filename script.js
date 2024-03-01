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
const timerLabel = document.getElementById("time");
const dateLabel = document.getElementById("date");

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

// * EVENT FUNCTIONS -

const curFormat = (value, locale, currency) =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency,
	}).format(value);

const timeFormat = (locale, date) => {
	const calcDayPassed = (date1, date2 = new Date()) =>
		Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

	const dayPassed = calcDayPassed(date);

	if (dayPassed === 0) return "Today";
	if (dayPassed === 1) return "Yesterday";
	if (dayPassed >= 7) {
		return new Intl.DateTimeFormat(locale, {
			day: "numeric",
			year: "numeric",
			month: "numeric",
		}).format(date);
	} else {
		return `${dayPassed} days ago`;
	}
};

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
	const { balance, locale, currency } = acc;
	balanceAmount.textContent = curFormat(balance, locale, currency);
};

const updateMovements = (acc, sort) => {
	movementContainer.innerHTML = "";
	const { locale, currency } = acc;

	const movs = sort
		? acc.movements.slice().sort((a, b) => a - b)
		: acc.movements;

	movs.forEach((mov, i) => {
		const movType = mov > 0 ? "deposit" : "withdrawal";

		const date = new Date(acc.movementsDates[i]);
		const displayDate = timeFormat(locale, date);

		const movHtml = `
		<div>
			<p class="${movType}">${i + 1} ${movType}</p>
			<p class="flex-1">${displayDate}</p>
			<p class="cash">${curFormat(mov, locale, currency)}</p>
		</div>`;
		movementContainer.insertAdjacentHTML("afterbegin", movHtml);
	});
};

const updateSummary = (acc) => {
	const { locale, currency } = acc;

	const totalCredit = acc.movements
		.filter((mov) => mov > 0)
		.reduce((total, mov) => total + mov);
	creditAmount.textContent = curFormat(totalCredit, locale, currency);

	const totalDebit = Math.abs(
		acc.movements.filter((mov) => mov < 0).reduce((total, mov) => total + mov)
	);
	debitAmount.textContent = curFormat(totalDebit, locale, currency);

	const totalInterest = acc.movements
		.filter((mov) => mov > 0)
		.map((dep) => (dep * acc.interestRate) / 100)
		.filter((int) => int >= 0)
		.reduce((total, int) => total + int);
	interestAmount.textContent = curFormat(totalInterest, locale, currency);
};

const updateUI = (acc) => {
	updateMovements(acc);
	updateSummary(acc);
	updateBalance(acc);
};

const logTimer = (time) => {
	const timerFun = () => {
		const min = String(parseInt(startTime / 60)).padStart(2, 0);
		const sec = String(startTime % 60).padStart(2, 0);
		timerLabel.textContent = `${min}:${sec}`;
		if (startTime === 0) {
			clearInterval(funTimer);
			containerApp.classList.add("hide");
			welcomeLabel.textContent = "Log in to get started";
		}
		startTime--;
	};

	let startTime = time * 60;
	timerFun();
	const funTimer = setInterval(timerFun, 1000);
	return funTimer;
};

const resetTimer = () => {
	if (appTimer) clearInterval(appTimer);
	appTimer = logTimer(1);
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
		(acc) => acc.username === userName.value && acc.pin === +userPin.value
	);

	if (currentAccount) {
		containerApp.classList.remove("hide");
		welcomeLabel.textContent = `Welcome, ${
			currentAccount?.owner.split(" ")[0]
		}!`;

		const now = new Date();
		const displayDate = new Intl.DateTimeFormat(currentAccount.locale, {
			hour: "numeric",
			minute: "numeric",
			day: "numeric",
			year: "numeric",
			month: "numeric",
		}).format(now);

		dateLabel.textContent = displayDate;

		resetTimer();
	}

	updateUI(currentAccount);
	userName.value = userPin.value = "";
});

transferBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const transferValue = +transferAmount.value;
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

		currentAccount.movementsDates.push(new Date().toISOString());
		recipent.movementsDates.push(new Date().toISOString());

		resetTimer();
	}

	updateUI(currentAccount);
	transferToInput.value = transferAmount.value = "";
});

loanBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const requestAmount = +loanAmount.value;
	if (
		currentAccount.movements.some((mov) => mov >= requestAmount * 0.1) &&
		requestAmount > 0
	) {
		setTimeout(() => {
			currentAccount.movements.push(requestAmount);
			updateUI(currentAccount);
			resetTimer();
		}, 2500);
	}

	loanAmount.value = "";
});

closeBtn.addEventListener("click", (e) => {
	e.preventDefault();
	if (
		confirmUser.value === currentAccount.username &&
		+confirmPin.value === currentAccount.pin
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
