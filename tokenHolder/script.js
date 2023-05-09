// script.js

const factionDropdown = document.getElementById('faction-input');
const FACTIONS = [
    "COSMIC",
    "VOID",
    "GALACTIC",
    "QUANTUM",
    "DOMINION",
    "ASTRO",
    "CORSAIRS"
]
// populate the dropdown
  FACTIONS.forEach(faction => {
    const option = document.createElement('option');
    option.value = faction;
    option.textContent = faction
    factionDropdown.appendChild(option);
  });

function getAgentToken() {
  const symbolInput = document.getElementById('symbol-input').value;
  const factionInput = document.getElementById('faction-input').value;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol: symbolInput,
      faction: factionInput,
    }),
  };

  fetch('https://api.spacetraders.io/v2/register', options)
    .then(response => response.json())
    .then(response => {
      const token = response.data.token;
      const symbol = response.data.agent.symbol;

      // Save to localStorage
      localStorage.setItem(symbol, token);

      // Display all tokens
      displayTokens();
    })
    .catch(err => console.error(err));
}

function displayTokens() {
  const tokenList = document.getElementById('token-list');
  tokenList.innerHTML = ''; // Clear current list
  for (let i = 0; i < localStorage.length; i++) {
    const symbol = localStorage.key(i);
    const token = localStorage.getItem(symbol);
    const item = document.createElement('div');
    item.classList.add('token-item');
    item.textContent = `Symbol: ${symbol}, Token: ${token}`;
    tokenList.appendChild(item);
  }
}

// Display existing tokens when page loads
displayTokens();

