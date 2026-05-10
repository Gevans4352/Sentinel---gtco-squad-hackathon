// Sentinel — frontend simulator
// Generates fake transaction objects and pushes them directly into the UI.
// Also fires a POST to the backend (fire-and-forget) so the real pipeline runs
// and the transaction gets saved to the database.

let _simCount = 0;
function _ref()  { return 'SIM-' + String(++_simCount).padStart(4, '0'); }
function _time() { return new Date().toTimeString().slice(0, 8); }

function _post(payload) {
  fetch('/webhook/squad', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'x-demo-mode': 'true' },
    body:    JSON.stringify({ event: 'charge_successful', data: payload }),
  }).catch(() => {}); // fire-and-forget — UI already updated locally
}

// Each function only POSTs to the backend.
// Socket.io receives the scored result and calls pushTransaction() once — no double-push.

function simulateGreen() {
  _post({ transaction_ref: _ref(), amount: 500000, email: 'safe@demo.com',
          card_bin: '411111', transaction_date: new Date().toISOString() });
}

function simulateAmber() {
  _post({ transaction_ref: _ref(), amount: 7500000, email: 'suspicious@demo.com',
          card_bin: '539983', transaction_date: new Date().toISOString().slice(0, 11) + '03:15:00.000Z' });
}

function simulateRed() {
  _post({ transaction_ref: _ref(), amount: 42000000, email: 'fraud@demo.com',
          card_bin: '400000', transaction_date: new Date().toISOString().slice(0, 11) + '02:50:00.000Z' });
}
