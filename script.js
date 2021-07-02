"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Sagar Mahi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2021-06-29T10:51:36.790Z",
    "2021-06-25T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Satya Shewale",
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
  owner: "Muga Man",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
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

const account4 = {
  owner: "Yuvi Gawade",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//movements date functions
const movementsDate = function (date, locale) {
  const calDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calDaysPassed(new Date(), date);

  console.log(daysPassed);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth()}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return Intl.DateTimeFormat(locale).format(date);
};

//movements array functions

const displayMovements = function (acc, sort = false) {
  console.log(movements);
  containerMovements.innerHTML = "";
  let movs = sort
    ? acc.movements?.slice().sort((a, b) => a - b)
    : acc.movements;
  movs?.forEach(function (mov, i) {
    let type = mov > 0 ? "deposit" : "withdrawal";

    //date logic
    const now = new Date(acc.movementsDates[i]);
    const displayDate = movementsDate(now, acc.locale);
    //console.log(acc.currency, acc.locale, mov);
    //format currency
    const formatCurrency = formatGenCurrencies(mov, acc.locale, acc.currency);
    //new Intl.NumberFormat(acc.locale, {
    //   style: "currency",
    //   currency: acc.currency,
    // }).format(mov);

    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCurrency}</div>
      </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//main balance
let balance;
const displayTotalMovementBalance = function (acc) {
  balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatGenCurrencies(
    balance,
    acc.locale,
    acc.currency
  );
};
//format currency generic
const formatGenCurrencies = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};
const displaySummaryCalBalanace = function (acc) {
  let income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = formatGenCurrencies(
    income,
    acc.locale,
    acc.currency
  );

  let outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  // labelSumOut.textContent = `${Math.abs(outcome)}`;
  labelSumOut.textContent = formatGenCurrencies(
    outcome,
    acc.locale,
    acc.currency
  );
  let interestDisplay = acc.movements
    .filter((mov) => mov > 0)
    .map((desp) => (desp * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  // labelSumInterest.textContent = `${interestDisplay}`;
  labelSumInterest.textContent = formatGenCurrencies(
    interestDisplay,
    acc.locale,
    acc.currency
  );
};

const createUserNameIntials = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((ac) => ac[0])
      .join("");
  });
};
createUserNameIntials(accounts);

const updateUI = function (acc) {
  //debit credit of cuurent user account
  displayMovements(acc);

  //summary balance income outcome interest
  displaySummaryCalBalanace(acc);

  //total balance
  displayTotalMovementBalance(acc);
};
///////////////////////////////////////

//events login user
let userName, currentUserLogin;

// FAKE ALWAYS LOGGED IN
currentUserLogin = account1;
updateUI(currentUserLogin);
containerApp.style.opacity = 100;

//login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("clkick", accounts);

  currentUserLogin = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log("clkick", currentUserLogin);
  if (currentUserLogin?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    // current date--day/month/year

    const now = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentUserLogin.locale,
      options
    ).format(now);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = now.getHours();
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year} ,${hours}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    labelWelcome.textContent = ` Weclome back, ${
      currentUserLogin.owner.split(" ")[0]
    }`;
    updateUI(currentUserLogin);
  }
});

//transfer loan
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("transfer");
  let amount = Number(inputTransferAmount.value);
  let transferTo = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    balance >= amount &&
    transferTo &&
    transferTo?.username !== currentUserLogin.username
  ) {
    //doin tranfer
    currentUserLogin.movements.push(-amount);
    transferTo.movements.push(amount);
    //date field
    currentUserLogin.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    //UPDATE UI
    updateUI(currentUserLogin);
  }
  inputTransferAmount.value = inputTransferTo.value = "";
});

//delete user

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(" delete currentUserLogin", currentUserLogin);
  if (
    currentUserLogin.username === inputCloseUsername.value &&
    currentUserLogin.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(
      (acc) => acc.username == inputCloseUsername.value
    );
    console.log("index", index);
    accounts.splice(index, 0);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
//sort movements
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentUserLogin, !sorted);
  sorted = !sorted;
});

//requewst loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentUserLogin.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentUserLogin.movements.push(amount);
    //date
    currentUserLogin.movementsDates.push(new Date().toISOString());
    inputLoanAmount.value = "";
    //update ui
    updateUI(currentUserLogin);
  }
});
