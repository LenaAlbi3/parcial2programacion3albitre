const apiKey = 'live_OkMC1xvV1Qch4V5BQucXxzpIBS3NeCO1k8YymteDdO6qsVT2s8bRynH0wyzGS8D0';
const containerEl = document.getElementById("character-container");
const paginationEl = document.getElementById("pagination-buttons");
const firstBtn = document.getElementById("first");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const lastBtn = document.getElementById("last");
const searchInput = document.getElementById("search-input");

let allBreeds = [];
let filteredBreeds = [];
let currentPage = 1;
const itemsPerPage = 10;

async function fetchBreeds() {
  containerEl.innerHTML = `<p style="color: #000;">Cargando...</p>`;
  try {
    const response = await fetch("https://api.thedogapi.com/v1/breeds", {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const data = await response.json();
    allBreeds = data;
    filteredBreeds = data;
    renderPage();
  } catch (err) {
    containerEl.innerHTML = `<p style="color: #000;">Error al cargar razas</p>`;
    console.error(err);
  }
}

async function renderPage() {
  containerEl.innerHTML = `<p style="color: #000;">Cargando razas...</p>`;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentBreeds = filteredBreeds.slice(start, end);

  containerEl.innerHTML = "";
  for (const breed of currentBreeds) {
    try {
      const imageRes = await fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${breed.id}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      const imageData = await imageRes.json();
      const imageUrl = imageData[0]?.url || "";

      const card = document.createElement("div");
      card.className = "character-card";
      card.innerHTML = `
        <img src="${imageUrl}" alt="${breed.name}" />
        <h3 style="color: #fff;">${breed.name}</h3>
        <p style="color: #fff;">${breed.temperament || "Sin descripción"}</p>
      `;
      containerEl.appendChild(card);
    } catch (err) {
      console.error(`Error cargando imagen de ${breed.name}:`, err);
    }
  }

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredBreeds.length / itemsPerPage);
  firstBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastBtn.disabled = currentPage === totalPages;
  paginationEl.style.display = totalPages > 1 ? "block" : "none";
}

// Botones de navegación
firstBtn.onclick = () => {
  currentPage = 1;
  renderPage();
};
prevBtn.onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};
nextBtn.onclick = () => {
  const totalPages = Math.ceil(filteredBreeds.length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderPage();
  }
};
lastBtn.onclick = () => {
  currentPage = Math.ceil(filteredBreeds.length / itemsPerPage);
  renderPage();
};

// Búsqueda por raza
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
      filteredBreeds = allBreeds;
    } else {
      filteredBreeds = allBreeds.filter((breed) =>
        breed.name.toLowerCase().includes(query)
      );
    }
    currentPage = 1;
    renderPage();
  }
});

fetchBreeds();