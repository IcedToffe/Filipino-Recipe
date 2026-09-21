const searchInput = document.getElementById("searchInput");
const categoryChips = document.getElementById("categoryChips");
const favToggle = document.getElementById("favToggle");
const pickBtn = document.getElementById("pickBtn");
const status = document.getElementById("status");
const recipeListEl = document.getElementById("recipeList");

const recipeCard = document.getElementById("recipeCard");
const recipeName = document.getElementById("recipeName");
const tagCategory = document.getElementById("tagCategory");
const tagTimeValue = document.getElementById("tagTimeValue");
const tagServingsValue = document.getElementById("tagServingsValue");
const ingredientsList = document.getElementById("ingredientsList");
const stepsList = document.getElementById("stepsList");
const recipeTip = document.getElementById("recipeTip");
const favStar = document.getElementById("favStar");

const FAVORITES_KEY = "pinoy-recipe-picker:favorites";

let recipes = [];
let selectedRecipe = null;
let activeCategory = "all";
let showFavoritesOnly = false;


function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Could not read favorites:", err);
    return [];
  }
}

function saveFavorites(list) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Could not save favorites:", err);
  }
}

function isFavorite(name) {
  return loadFavorites().includes(name);
}

function toggleFavorite(name) {
  const favs = loadFavorites();
  const index = favs.indexOf(name);
  if (index === -1) {
    favs.push(name);
  } else {
    favs.splice(index, 1);
  }
  saveFavorites(favs);
}

// --- Data loading ---------------------------------------------------------

async function loadRecipes() {
  try {
    const response = await fetch("recipes.json");
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    recipes = await response.json();
    status.textContent = `${recipes.length} recipes loaded. Handa ka na!`;
    pickBtn.disabled = false;
    renderList();
  } catch (err) {
    status.textContent =
      "Hindi na-load ang recipes.json. Kung double-click mo lang ang file, " +
      "gumamit ng local server (tingnan ang README).";
    console.error("Failed to load recipes:", err);
  }
}

// --- Filtering --------------------------------------------------------

function getVisibleRecipes() {
  const query = searchInput.value.trim().toLowerCase();

  return recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(query);
    const matchesCategory = activeCategory === "all" || r.category === activeCategory;
    const matchesFavorites = !showFavoritesOnly || isFavorite(r.name);
    return matchesSearch && matchesCategory && matchesFavorites;
  });
}



function renderList() {
  const visible = getVisibleRecipes();
  recipeListEl.innerHTML = "";

  if (visible.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-list";
    empty.textContent = showFavoritesOnly
      ? "Wala ka pang paborito. Mag-star muna ng recipe."
      : "Walang recipe na tugma. Subukan ang ibang search o filter.";
    recipeListEl.appendChild(empty);
    return;
  }

  visible.forEach((r) => {
    const row = document.createElement("button");
    row.className = "recipe-row";
    row.dataset.category = r.category;
    if (selectedRecipe && selectedRecipe.name === r.name) {
      row.classList.add("selected");
    }

    const top = document.createElement("span");
    top.className = "recipe-row-top";

    const nameEl = document.createElement("span");
    nameEl.className = "recipe-row-name";
    nameEl.textContent = r.name;

    const star = document.createElement("span");
    star.className = "recipe-row-star";
    star.textContent = isFavorite(r.name) ? "★" : "☆";

    top.append(nameEl, star);

    const catEl = document.createElement("span");
    catEl.className = "recipe-row-category";
    catEl.textContent = r.category;

    row.append(top, catEl);
    row.addEventListener("click", () => renderRecipe(r));
    recipeListEl.appendChild(row);
  });
}



function renderRecipe(recipe) {
  selectedRecipe = recipe;
  recipeCard.hidden = false;
  status.textContent = "";

  recipeName.textContent = recipe.name;
  recipeCard.dataset.category = recipe.category;
  tagCategory.textContent = recipe.category;
  tagTimeValue.textContent = recipe.time;
  tagServingsValue.textContent = recipe.servings;

  ingredientsList.innerHTML = "";
  recipe.ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ingredientsList.appendChild(li);
  });

  stepsList.innerHTML = "";
  recipe.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });

  if (recipe.tip) {
    recipeTip.hidden = false;
    recipeTip.textContent = `💡 ${recipe.tip}`;
  } else {
    recipeTip.hidden = true;
  }

  favStar.textContent = isFavorite(recipe.name) ? "★" : "☆";
  favStar.setAttribute("aria-pressed", isFavorite(recipe.name));

  renderList();
}

function pickRandomRecipe() {
  const visible = getVisibleRecipes();
  if (visible.length === 0) return;

  let pool = visible;
  if (selectedRecipe && visible.length > 1) {
    pool = visible.filter((r) => r.name !== selectedRecipe.name);
  }

  const choice = pool[Math.floor(Math.random() * pool.length)];
  renderRecipe(choice);
}



searchInput.addEventListener("input", renderList);

categoryChips.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;

  categoryChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  btn.classList.add("active");
  activeCategory = btn.dataset.category;
  renderList();
});

favToggle.addEventListener("click", () => {
  showFavoritesOnly = !showFavoritesOnly;
  favToggle.setAttribute("aria-pressed", showFavoritesOnly);
  renderList();
});

favStar.addEventListener("click", () => {
  if (!selectedRecipe) return;
  toggleFavorite(selectedRecipe.name);
  favStar.textContent = isFavorite(selectedRecipe.name) ? "★" : "☆";
  favStar.setAttribute("aria-pressed", isFavorite(selectedRecipe.name));
  renderList();
});

pickBtn.disabled = true;
pickBtn.addEventListener("click", pickRandomRecipe);

loadRecipes();
