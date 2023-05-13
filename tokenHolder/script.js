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

 function testLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (error) {
      return false;
    }
 }
// disable the input if no localstorage
if (!testLocalStorage()) {
  document.getElementById('warning').style.display = 'block';
  document.querySelector('button').disabled = true;
}

function syntaxHighlightJSON(json) {
  const jsonString = JSON.stringify(json, undefined, 2);
  const jsonHighlightRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;


  return jsonString
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(jsonHighlightRegex, function (match) {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
}
function handleSubmit(e) {
  e.preventDefault()
  const symbolInput = document.getElementById('symbol-input').value;
  const factionInput = document.getElementById('faction-input').value;
  const emailInput = document.getElementById('email-input').value
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      symbol: symbolInput,
      faction: factionInput,
      email: emailInput ? emailInput : null
    }),
  };

  const errorBox = document.getElementById('error-box');
  const errorMessage = document.getElementById('error-message');
  // Validation check for Agent input length
    if (symbolInput.length < 3 || symbolInput.length > 14) {
      errorMessage.textContent = 'Agent input must be between 3 and 14 characters.';
      errorBox.style.display = 'block';
      return;
    }

  fetch('https://api.spacetraders.io/v2/register', options)
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        // Show the error box with the formatted JSON error message
        errorMessage.innerHTML = syntaxHighlightJSON(response.error);
        errorBox.style.display = 'block';
      } else {
        // Hide the error box
        errorBox.style.display = 'none';

        const token = response.data.token;
        const symbol = response.data.agent.symbol;

        // Save to localStorage
        localStorage.setItem(symbol, token);

        // Display all tokens
        displayTokens();
      }
    })
    .catch(err => {
      console.error(err);
      // Show the error box with a generic error message
      errorMessage.textContent = 'An error occurred. Please try again later.';
      errorBox.style.display = 'block';
    });
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

