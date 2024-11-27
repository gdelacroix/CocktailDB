const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalIngredients = document.getElementById('modalIngredients');
const modalInstructions = document.getElementById('modalInstructions');
const searchByName = document.getElementById('searchByName');
const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1/";

/**
 * Ecouteur d'évenements sur le click du bouton search
 */
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();

    //je vérifie ce qui a été coché
    const searchType = searchByName.checked ? 'name' : 'ingredient';
    if (!query) return alert("Veuillez entrer un terme de recherche.");

    const endpoint =
        searchType === 'name'
            ? `${API_BASE}search.php?s=${query}`
            : `${API_BASE}filter.php?i=${query}`;

    fetch(endpoint)
        .then((response) => response.json())
        .then((data) => displayResults(data.drinks))
        .catch(console.error);
});

/**
 * Fonction qui renvoit les résultats
 * @param {*} drinks 
 * @returns 
 */
function displayResults(drinks) {
    resultsContainer.innerHTML = '';
    if (!drinks) {
        resultsContainer.innerHTML = '<p class="text-center">No results.</p>';
        return;
    }
    drinks.forEach((drink) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
      <div class="card h-100">
        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="${drink.strDrink}">
        <div class="card-body">
          <h5 class="card-title">${drink.strDrink}</h5>
          <button class="btn btn-primary" onclick="getDetails(${drink.idDrink})" data-bs-toggle="modal" data-bs-target="#detailsModal">See details</button>
        </div>
      </div>
    `;
        resultsContainer.appendChild(col);
    });
}

/**
 * Fonction pour récupérer les détails d'un cocktail grâce à son id
 * @param {*} id 
 */
function getDetails(id) {
    fetch(`${API_BASE}lookup.php?i=${id}`)
        .then((response) => response.json())
        .then((data) => displayDetails(data.drinks[0]))
        .catch(console.error);
}

/**
 * Fonction pour afficher les détails d'un cocktail dans la modal
 * @param {*} drink 
 */
function displayDetails(drink) {
    modalTitle.innerHTML = `<h4>` + drink.strDrink + `</h4>
         <div class="container-fluid"> 
            <div class="row">
                <div class="col-md-4">
                    <p><strong>Category :</strong> ${drink.strCategory}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Glass To Use :</strong> ${drink.strGlass}</p>
                </div>
                <div class="col-md-4">
                    <p><strong>Type :</strong> ${drink.strAlcoholic}</p>
                </div>
            </div>
        </div> `;
    modalImage.src = drink.strDrinkThumb;
    // Catégorie, type de verre et alcool
    modalIngredients.innerHTML = "";

    // Liste des ingrédients avec dosages
    // je récupère toutes les clés (propriétés de l'objet drink)
    Object.keys(drink)
        .filter((key) => key.startsWith('strIngredient') && drink[key]) //je filtre les clés et ne récupère que celle qui commencent par strIngredient
        .forEach((key, index) => { // puis je boucle dessus
            const ingredient = drink[key]; 
            const measureKey = `strMeasure${index + 1}`;
            const measure = drink[measureKey] || "Not specified quantity";
            modalIngredients.innerHTML += `<li>${ingredient} - ${measure}</li>`;
        });

    modalInstructions.textContent = drink.strInstructions;
}
