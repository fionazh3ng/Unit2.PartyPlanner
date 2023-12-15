const COHORT = "2311-fsa-et-web-ft-sf";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

// Initialize the state
const state = {
  parties: [],
};

const partyList = document.getElementById("parties");
const addPartyForm = document.getElementById("addParty");

// Sync state with the API and rerender
async function render() {
  await getParties();
  renderParties();
}
render();

// Update state with events from API
async function getParties() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    state.parties = result.data;

    state.parties.forEach((e) => {
      console.log(e);

      const events = document.createElement("li");
      partyList.appendChild(events);
    });
  } catch (error) {
    console.error(error);
  }
}

// Render parties from state
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No parties.</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <h2>${party.name}</h2>
      <h3>${party.date}</h3>
      <h3>${party.location}</h3>
      <p>${party.description}</p>
      <button>Delete</button>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

// Ask the API to create a new party based on form data
const addParty = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
        description: addPartyForm.description.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
};

addPartyForm.addEventListener("submit", addParty);
