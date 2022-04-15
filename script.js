'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const transferForm = document.querySelector('.form--transfer');
const closeForm = document.querySelector('.form--close');
const loanForm = document.querySelector('.form--loan');

let currentAcc, countdown;

/////////////////////////////////////////////////
// days ago function

/////////////////////////////////////////////////
const daysAgo = (date, locale) => {
  const calcDateDiff = (date1, date2) =>
    Math.round((date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDateDiff(date, new Date());

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'yesterday';
  if (daysPassed === 2) return '2 days ago';

  return new Intl.DateTimeFormat(locale).format(date);
};

/////////////////////////////////////////////////
//timer function

/////////////////////////////////////////////////

const setTimer = timer => {
  const tick = () => {
    const min = String(Math.floor(timer / 60)).padStart(2, 0);
    const sec = String(Math.floor(timer % 60)).padStart(2, 0);

    if (timer > 0) {
      timer--;
      labelTimer.textContent = `${min}:${sec}`;
    } else {
      labelWelcome.textContent = `Wrong Username/Passowrd`;
      containerApp.style.opacity = 0;
      clearInterval(countdown);
    }
  };
  tick();
  countdown = setInterval(tick, 1000);
};

/////////////////////////////////////////////////
//NEWTOPIC MOVEMENTS DISPLAY FUNCTION   1

const display = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, key) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(account.movementsDates[key]);

    const displayDate = daysAgo(date, account.locale);

    const formattedMov = new Intl.NumberFormat(account.locale, {
      style: 'currency',
      currency: 'USD',
    }).format(mov);

    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      key + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMov}</div>
  </div>
 
`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
//NEWTOPIC Display balance FUNCTION   2

const balnce = function (account) {
  account.balance = account.movements.reduce((total, mov) => {
    return total + mov;
  }, 0);

  labelBalance.textContent = `${account.balance.toFixed(2)}$`;
}; // labelBalance.textContent = bal.join('');

/////////////////////////////////////////////////
//NEWTOPIC SUMMERY FUNCTION   3()

const summery = function (account) {
  const income = account.movements
    .filter(amount => amount > 0)
    .reduce((total, amount) => {
      return total + amount;
    }, 0);
  labelSumIn.textContent = `${income.toFixed(2)}$`;

  const out = account.movements
    .filter(amount => amount < 0)
    .reduce((total, amount) => {
      return total + amount;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}$`;

  const interestAmount = account.movements
    .filter(amount => amount > 0)
    .map(amount => (amount * 1.2) / 100)
    .filter(instamt => instamt >= 1)
    .reduce((interest, amount) => {
      return interest + amount;
    }, 0);

  labelSumInterest.textContent = `${interestAmount.toFixed(2)}$`;
};

/////////////////////////////////////////////////
//NEWTOPIC CREATING USERNAME FUNCTION   4()

const createUsername = function (account) {
  account.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUsername(accounts);

const updateUI = function (account) {
  //display movement
  display(account);

  //display balance
  balnce(account);

  //display summery

  summery(account);
};

/////////////////////////////////////////////////
//NEWTOPIC LOGIN FUNCTION   5

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAcc = accounts.find(
    account => account.username === inputLoginUsername.value
  );

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    //1Update the UI
    labelWelcome.textContent = `Welcome ${currentAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;

    updateUI(currentAcc);

    if (countdown) {
      clearInterval(countdown);
    }
    setTimer(300);
  } else {
    labelWelcome.textContent = `Wrong Username/Passowrd`;
    containerApp.style.opacity = 0;
    //Update Ui with a erroe msg
  }
});

/////////////////////////////////////////////////
//NEWTOPIC MONEY TRANSFER FUNCTION   6

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const transferAmount = Number(inputTransferAmount.value);

  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );

  if (
    receiverAccount &&
    transferAmount > 0 &&
    currentAcc.balance >= transferAmount &&
    receiverAccount.username !== currentAcc.username
  ) {
    //doing the transfer
    currentAcc.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);

    currentAcc.movementsDates.push(new Date().toISOString());

    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAcc);
    clearInterval(countdown);
    setTimer(300);
  }

  transferForm.reset();
});

/////////////////////////////////////////////////
//NEWTOPIC ACCOUNT CLOSE FUNCTION   6

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    Number(inputClosePin.value) === currentAcc.pin &&
    inputCloseUsername.value === currentAcc.username
  ) {
    const deleteIndex = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );
    accounts.splice(deleteIndex, 1);
    containerApp.style.opacity = 0;
  }

  closeForm.reset();
});

/////////////////////////////////////////////////
//NEWTOPIC LOAN  FUNCTION   7

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAcc.movements.some(amount => amount >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      currentAcc.movements.push(loanAmount);
      currentAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAcc);
    }, 2000); //this timeout is an delay so that the laon amount is reflected after a dealy and not immdeitaelty

    clearInterval(countdown);
    setTimer(300);
  }
  loanForm.reset();
});

/////////////////////////////////////////////////
// FAKE LOGIN
currentAcc = account1;
updateUI(currentAcc);
containerApp.style.opacity = 1;
/////////////////////////////////////////////////
//NEWTOPIC SORTING FUNCTION   8
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  display(currentAcc, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
// label date

/////////////////////////////////////////////////

const now = new Date();

setInterval(() => {
  labelDate.textContent = new Intl.DateTimeFormat(navigator.language, {
    day: 'numeric',
    month: 'long',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
  }).format(new Date());
}, 1000);

/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////
