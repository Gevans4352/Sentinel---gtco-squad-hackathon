// Sentinel — frontend simulator
// Randomised realistic transaction pools. Each call picks from pools so
// every simulated event looks different in the dashboard.

// Timestamp + counter so refs are always unique across page reloads and sessions.
const _epoch = Date.now();
let _simCount = 0;
function _ref() { return 'SIM-' + _epoch + '-' + (++_simCount); }

function _post(payload) {
  fetch('/webhook/squad', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-demo-mode': 'true' },
    body:    JSON.stringify({ event: 'charge_successful', data: payload }),
  }).catch(() => {});
}

function _pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

//Identity pools

const FIRST = [
  'chidi','ngozi','emeka','amara','bola','tunde','kemi','seun',
  'ife','uche','nkem','femi','sola','yemi','ada','obinna','chisom',
  'damilola','olumide','fatima','aisha','hauwa','musa','ibrahim',
];
const LAST = [
  'okonkwo','adeyemi','obi','nwosu','adesanya','fashola','olawale',
  'abiodun','oladipo','eze','okeke','adebayo','akinwunmi','balogun',
  'igwe','dike','aliyu','garba','usman','musa',
];
const DOMAINS = ['gmail.com','yahoo.com','outlook.com','hotmail.com','live.com'];

function _email() {
  return _pick(FIRST) + '.' + _pick(LAST) + '@' + _pick(DOMAINS);
}

// Small fixed pools for RED/AMBER so the same emails repeat across simulations.
// This builds up transaction history so velocity and spike rules fire after a few hits.
const BAD_EMAILS = [
  'emeka.obi74@gmail.com',   'chisom.eze91@yahoo.com',
  'damilola.aliyu38@live.com', 'obinna.usman55@outlook.com',
];
const AMBER_EMAILS = [
  'sola.adeyemi@gmail.com', 'yemi.dike@yahoo.com',
  'ife.garba@hotmail.com',  'ada.nwosu@live.com',
];

let _badIdx   = 0;
let _amberIdx = 0;
function _badEmail()   { return BAD_EMAILS[_badIdx++   % BAD_EMAILS.length];   }
function _amberEmail() { return AMBER_EMAILS[_amberIdx++ % AMBER_EMAILS.length]; }

// Card BINs (Visa / Mastercard / Verve)
// GREEN  → known-good personal/corporate cards
// AMBER  → prepaid or recently-seen high-risk BINs
// RED    → BINs associated with test/stolen card patterns
const BINS_GREEN = ['411111','451273','476148','428616','435592','438857','462203'];
const BINS_AMBER = ['539983','527841','521456','545501','512345','530956','556084'];
const BINS_RED   = ['400000','490116','402918','401177','403245','400115','492950'];

// Amounts (in kobo — 1 NGN = 100 kobo)
// GREEN:  ₦1,200 – ₦45,000  (everyday POS / e-commerce)
// AMBER:  ₦55,000 – ₦150,000 (above-average, warrants review)
// RED:    ₦200,000 – ₦500,000 (very high, typical card fraud amount)
const AMOUNTS_GREEN = [
  120000, 250000, 350000, 500000, 750000, 1000000,
  1250000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000,
];
const AMOUNTS_AMBER = [
  5500000, 6000000, 7000000, 7500000, 8500000,
  9000000, 10000000, 12000000, 13500000, 15000000,
];
const AMOUNTS_RED = [
  20000000, 25000000, 28000000, 30000000, 35000000,
  38000000, 42000000, 45000000, 48000000, 50000000,
];

//Exported simulate functions 

function simulateGreen() {
  _post({
    transaction_ref:  _ref(),
    amount:           _pick(AMOUNTS_GREEN),
    email:            _email(),
    card_bin:         _pick(BINS_GREEN),
    transaction_date: new Date().toISOString(),
  });
}

function simulateAmber() {
  _post({
    transaction_ref:  _ref(),
    amount:           _pick(AMOUNTS_AMBER),
    email:            _amberEmail(),
    card_bin:         _pick(BINS_AMBER),
    transaction_date: new Date().toISOString(),
  });
}

function simulateRed() {
  _post({
    transaction_ref:  _ref(),
    amount:           _pick(AMOUNTS_RED),
    email:            _badEmail(),
    card_bin:         _pick(BINS_RED),
    transaction_date: new Date().toISOString(),
  });
}
