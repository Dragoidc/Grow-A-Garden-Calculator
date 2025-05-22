// ─── Data definitions ───────────────────────────────────────────────────────────
const categories = {
  "Public Crops": [
    "Carrot","Strawberry","Blueberry","Orange Tulip","Tomato",
    "Corn","Daffodil","Watermelon","Pumpkin","Apple",
    "Bamboo","Coconut","Cactus","Dragon Fruit","Mango",
    "Grape","Mushroom","Pepper","Cacao","Beanstalk"
  ],
  "Normal Seed Pack": ["Lemon","Pineapple","Peach","Raspberry","Pear"],
  "Premium Seed Pack": ["Raspberry","Cranberry","Durian","Eggplant","Venus Flytrap","Lotus"],
  "Exotic Seed Pack": ["Papaya","Banana","Passionfruit","Soul Fruit","Cursed Fruit"],
  "Easter Event": ["Chocolate Carrot","Candy Sunflower","Easter Egg","Red Lollipop","Candy Blossom"],
  "Lunar Glow Event": ["Nightshade","Glowshroom","Mint","Moonflower","Starfruit","Moonglow","Moon Blossom","Blood Banana","Moon Melon"]
};

const basePrices = {
  Carrot:270, Strawberry:167, Blueberry:500, Tomato:120, "Orange Tulip":350000,
  Corn:10, Daffodil:25000, Watermelon:61.25, Pumpkin:53.1, Apple:30.625,
  Bamboo:250, Coconut:2.04, Cactus:69.4, "Dragon Fruit":33, Mango:28.875,
  Grape:872.25, Mushroom:241.5, Pepper:320, Cacao:171.875, Pineapple:222,
  Raspberry:178, Starfruit:1666.25, "Easter Egg":280, "Candy Blossom":11100,
  Eggplant:300, Moonflower:2375, Moonglow:408, Glowshroom:533, Mint:5250,
  Beanstalk:200, "Blood Banana":4198, "Moon Melon":711
};

// ─── Persistent state ──────────────────────────────────────────────────────────
let calculationHistory = JSON.parse(localStorage.getItem('gardenCalculations')) || [];
let favorites          = JSON.parse(localStorage.getItem('favorites'))             || [];
let sidebarCollapsed   = localStorage.getItem('sidebarCollapsed') === 'true';

// ─── Crop‐info tooltips ─────────────────────────────────────────────────────────
const cropInfo = {};
Object.values(categories).flat().forEach(crop => {
  /* replace with your own descriptions */
  cropInfo["Carrot"]           = "Buyable from Seed Shop for 10₵ (always in stock)";
  cropInfo["Strawberry"]       = "Buyable from Seed Shop for 50₵ (always in stock)";
  cropInfo["Blueberry"]        = "Buyable from Seed Shop for 400₵ (always in stock)";
  cropInfo["Orange Tulip"]     = "Buyable from Seed Shop for 600₵ (~35% chance)";
  cropInfo["Tomato"]           = "Buyable from Seed Shop for 800₵ (always in stock)";
  cropInfo["Corn"]             = "Buyable from Seed Shop for 1,300₵ (~30% chance)";
  cropInfo["Daffodil"]         = "Buyable from Seed Shop for 1,000₵ (~15% chance)";
  cropInfo["Watermelon"]       = "Buyable from Seed Shop for 2,500₵ (~13% chance)";
  cropInfo["Pumpkin"]          = "Buyable from Seed Shop for 3,000₵ (~10% chance)";
  cropInfo["Apple"]            = "Buyable from Seed Shop for 3,250₵ (~7% chance)";
  cropInfo["Bamboo"]           = "Buyable from Seed Shop for 4,000₵ (~20% chance)";
  cropInfo["Coconut"]          = "Buyable from Seed Shop for 6,000₵ (~5% chance)";
  cropInfo["Cactus"]           = "Buyable from Seed Shop for 15,000₵ (~3% chance)";
  cropInfo["Dragon Fruit"]     = "Buyable from Seed Shop for 30,000₵ (~2% chance)";
  cropInfo["Mango"]            = "Buyable from Seed Shop for 100,000₵ (~1.5% chance)";
  cropInfo["Grape"]            = "Buyable from Seed Shop for 850,000₵ (~1% chance)";
  cropInfo["Mushroom"]         = "Buyable from Seed Shop for 150,000₵ (~0.75% chance)";
  cropInfo["Pepper"]           = "Buyable from Seed Shop for 1,000,000₵ (~0.5% chance)";
  cropInfo["Cacao"]            = "Buyable from Seed Shop for 2,500,000₵ (~0.5% chance)";
  cropInfo["Beanstalk"]        = "Buyable from Seed Shop for 10,000,000₵ (~0.5% chance)";
  /* …and so on for every crop… */
});

// ─── Page‐load initialization ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');

  // 1) Build sidebar once
  Object.entries(categories).forEach(([name, crops]) => {
    sidebar.appendChild(createCategorySection(name, crops));
  });

  // 2) Clear history
  document.querySelector('.clear-btn').addEventListener('click', () => {
    calculationHistory = [];
    localStorage.removeItem('gardenCalculations');
    updateHistoryDisplay();
  });

  // 3) Calculate button
  document.getElementById('calculate-btn').addEventListener('click', calculate);

  // 4) Sidebar search filter
  document.getElementById('sidebarSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.category-section').forEach(sec => {
      let any = false;
      sec.querySelectorAll('button').forEach(b => {
        const show = b.textContent.toLowerCase().includes(q);
        b.style.display = show ? 'block' : 'none';
        if (show) any = true;
      });
      sec.open = q.length > 0 && any;
    });
  });

  // 5) Initial render calls
  updateFavoritesDisplay();
  updateCategoryStars();
  updateMultiplier();
  updateHistoryDisplay();
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
});

// ─── HELPERS: Sidebar, Favorites, History, etc. ───────────────────────────────
function createCategorySection(name, crops) {
  const section = document.createElement('details');
  section.className = 'category-section';
  section.innerHTML = `
    <summary>${name}</summary>
    ${crops.map(crop => {
      const isFav = favorites.includes(crop);
      return `
        <button data-crop="${crop}" onclick="selectPlant('${name}','${crop}')">
          ${crop}
          <span class="star-icon ${isFav?'active':''}"
                onclick="toggleFavorite('${crop}',event);event.stopPropagation()">
            ${isFav?'★':'☆'}
          </span>
        </button>`;
    }).join('')}
  `;
  return section;
}

function updateFavoritesDisplay() {
  const favList = document.getElementById('favoritesList');
  favList.innerHTML = favorites.map(crop => `
    <button class="starred" data-crop="${crop}"
            onclick="selectCategoryFromFavorite('${crop}')">
      ${crop} <span class="star-icon active" onclick="toggleFavorite('${crop}',event)">★</span>
    </button>
  `).join('');
  document.querySelector('.empty-state').style.display = favorites.length ? 'none' : 'block';
}

function toggleFavorite(crop, event) {
  event.stopPropagation();
  favorites = favorites.includes(crop)
    ? favorites.filter(f => f!==crop)
    : [...favorites,crop];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesDisplay();
  updateCategoryStars();
}

function updateCategoryStars() {
  document.querySelectorAll('.category-section button').forEach(btn => {
    const crop = btn.getAttribute('data-crop');
    const star = btn.querySelector('.star-icon');
    if (!star) return;
    if (favorites.includes(crop)) {
      star.classList.add('active'); star.textContent = '★';
    } else {
      star.classList.remove('active'); star.textContent = '☆';
    }
  });
}

// ─── Selection Helpers ────────────────────────────────────────────────────────
window.selectPlant = function(category, plant) {
  selectCategory(category);
  document.getElementById('plant-select').value = plant;
};

window.selectCategory = function(catName) {
  hideCropReference();
  document.querySelectorAll('#sidebar button')
          .forEach(b => b.classList.toggle('active', b.textContent===catName));
  const sel = document.getElementById('plant-select');
  sel.innerHTML = '';
  categories[catName].forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    sel.appendChild(opt);
  });
  document.getElementById('panel-title').textContent = catName;
  document.getElementById('panel').classList.add('active');
  updateHistoryDisplay();
};

window.selectCategoryFromFavorite = function(crop) {
  for (let [cat, cps] of Object.entries(categories)) {
    if (cps.includes(crop)) return selectPlant(cat,crop);
  }
};

// ─── Statistics & Mutation Setup ──────────────────────────────────────────────
// (Your existing stats-body, mutation-chips, variant-buttons, updateMultiplier, etc.)
// … copy the rest of your original logic below exactly as it was …

// ─── Calculation & Validation ─────────────────────────────────────────────────
window.calculate = function() {
  if (!validateMass()) return;
  /* your calculate() implementation here */
};

window.validateMass = function() {
  const inp = document.getElementById('mass'),
        err = document.getElementById('massError'),
        v = parseFloat(inp.value);
  if (v<0.01) { err.textContent="Mass ≥0.01kg"; err.style.display='block'; return false; }
  if (v>9999) { err.textContent="Mass ≤9999kg"; err.style.display='block'; return false; }
  err.style.display='none'; return true;
};

function updateHistoryDisplay() {
  const list = document.getElementById('history-list');
  if (!calculationHistory.length) {
    list.innerHTML = '<li>No calculations yet.</li>';
    return;
  }
  list.innerHTML = calculationHistory.map(e =>
    `<li><span class="history-timestamp">${new Date(e.timestamp).toLocaleString()}</span>${e.html}</li>`
  ).join('');
}
