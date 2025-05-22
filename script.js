// ────────────────────────────────────────────────────────────────────────────────
// script.js — Complete Rewrite
// ────────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // ─── 1) Data ────────────────────────────────────────────────────────────────
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
    Carrot: 270, Strawberry: 167, Blueberry: 500, Tomato: 120, "Orange Tulip": 350000,
    Corn: 10, Daffodil: 25000, Watermelon: 61.25, Pumpkin: 53.1, Apple: 30.625,
    Bamboo: 250, Coconut: 2.04, Cactus: 69.4, "Dragon Fruit": 33, Mango: 28.875,
    Grape: 872.25, Mushroom: 241.5, Pepper: 320, Cacao: 171.875, Pineapple: 222,
    Raspberry: 178, Starfruit: 1666.25, "Easter Egg": 280, "Candy Blossom": 11100,
    Eggplant: 300, Moonflower: 2375, Moonglow: 408, Glowshroom: 533, Mint: 5250,
    Beanstalk: 200, "Blood Banana": 4198, "Moon Melon": 711
  };

  // ─── 2) Persistent state ─────────────────────────────────────────────────────
  let calculationHistory = JSON.parse(localStorage.getItem('gardenCalculations')) || [];
  let favorites          = JSON.parse(localStorage.getItem('favorites'))             || [];
  let sidebarCollapsed   = localStorage.getItem('sidebarCollapsed') === 'true';

  // ─── 3) Crop Info Tooltips ───────────────────────────────────────────────────
  const cropInfo = {};
  Object.values(categories).flat().forEach(crop => {
    // (fill in all your tooltip strings exactly as before)
    cropInfo["Carrot"]           = "Buyable from Seed Shop for 10₵ (always in stock)";
    cropInfo["Strawberry"]       = "Buyable from Seed Shop for 50₵ (always in stock)";
    cropInfo["Blueberry"]        = "Buyable from Seed Shop for 400₵ (always in stock)";
    cropInfo["Orange Tulip"]     = "Buyable from Seed Shop for 600₵ (~35% chance to appear)";
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
    cropInfo["Lemon"]            = "Exclusive event reward (no longer obtainable)";
    cropInfo["Pineapple"]        = "Dropped from Normal Seed Pack (~7.7% chance)";
    cropInfo["Peach"]            = "Dropped from Normal Seed Pack (~7.7% chance)";
    cropInfo["Raspberry"]        = "Dropped from Normal Seed Pack (~7.7% chance)";
    cropInfo["Pear"]             = "Dropped from Normal Seed Pack (~7.7% chance)";
    cropInfo["Cranberry"]        = "Dropped from Basic Seed Pack (~30% chance); Premium Seed Pack (45% chance)";
    cropInfo["Durian"]           = "Dropped from Basic Seed Pack (~21% chance); Premium Seed Pack (35% chance)";
    cropInfo["Eggplant"]         = "Dropped from Basic Seed Pack (~8.7% chance); Premium Seed Pack (16% chance)";
    cropInfo["Venus Flytrap"]    = "Dropped from Basic Seed Pack (~0.01% chance); Premium Seed Pack (1% chance)";
    cropInfo["Lotus"]            = "Dropped from Basic Seed Pack (~0.25% chance); Premium Seed Pack (2.5% chance)";
    cropInfo["Papaya"]           = "Dropped from Exotic Seed Pack (~40% chance)";
    cropInfo["Banana"]           = "Dropped from Exotic Seed Pack (~38% chance)";
    cropInfo["Passionfruit"]     = "Dropped from Exotic Seed Pack (~20% chance)";
    cropInfo["Soul Fruit"]       = "Dropped from Exotic Seed Pack (~1.5% chance, event-limited)";
    cropInfo["Cursed Fruit"]     = "Dropped from Exotic Seed Pack (~0.5% chance, rarest crop)";
    cropInfo["Chocolate Carrot"] = "Buyable from Easter Event Shop for 10,000₵";
    cropInfo["Candy Sunflower"]  = "Buyable from Easter Event Shop for 75,000₵";
    cropInfo["Easter Egg"]       = "Buyable from Easter Event Shop for 500,000₵";
    cropInfo["Red Lollipop"]     = "Buyable from Easter Event Shop for 45,000₵";
    cropInfo["Candy Blossom"]    = "Buyable from Easter Event Shop for 10,000,000₵";
    cropInfo["Nightshade"]       = "Dropped from Night Seed Pack (35% chance)";
    cropInfo["Glowshroom"]       = "Dropped from Night Seed Pack (19.5% chance); Premium Night Seed Pack (30% chance)";
    cropInfo["Mint"]             = "Dropped from Night Seed Pack (14.3% chance); Premium Night Seed Pack (22% chance)";
    cropInfo["Moonflower"]       = "Dropped from Night Seed Pack (11.7% chance); Premium Night Seed Pack (18% chance)";
    cropInfo["Starfruit"]        = "Dropped from Night Seed Pack (10.08% chance); Premium Night Seed Pack (15.5% chance)";
    cropInfo["Moonglow"]         = "Dropped from Night Seed Pack (7.8% chance); Premium Night Seed Pack (12% chance)";
    cropInfo["Moon Blossom"]     = "Dropped from Night Seed Pack (1.63% chance); Premium Night Seed Pack (2.5% chance)";
    cropInfo["Blood Banana"]     = "Buyable from Blood Moon Shop for 200,000₵ when in stock";
    cropInfo["Moon Melon"]       = "Buyable from Blood Moon Shop for 500,000₵ when in stock";
  });

  // ─── 4) Build Sidebar ─────────────────────────────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  Object.entries(categories).forEach(([name, crops]) => {
    sidebar.appendChild(createCategorySection(name, crops));
  });

  // ─── 5) Populate Stats Table ─────────────────────────────────────────────────
  const statsBody = document.getElementById('stats-body');
  const cropImageMap = {
    "Carrot": "https://static.wikia.nocookie.net/growagarden/images/3/3c/Carrottransparent.png/revision/latest?cb=20250421123349",
    "Strawberry": "https://static.wikia.nocookie.net/growagarden/images/6/6d/Strawberry.png/revision/latest?cb=20250501001831",
    "Blueberry": "https://static.wikia.nocookie.net/growagarden/images/9/9e/Blueberry.png/revision/latest?cb=20250504064726",
    "Orange Tulip": "https://static.wikia.nocookie.net/growagarden/images/4/4d/Orangetulip.png/revision/latest?cb=20250422131408",
    "Tomato": "https://static.wikia.nocookie.net/growagarden/images/9/9d/Tomato.png/revision/latest?cb=20250501001240",
    "Corn": "https://static.wikia.nocookie.net/growagarden/images/e/ee/CornCropsPic.png/revision/latest?cb=20250429082913",
    "Daffodil": "https://static.wikia.nocookie.net/growagarden/images/3/31/Daffodilfruiticon.png/revision/latest?cb=20250422223149",
    "Watermelon": "https://static.wikia.nocookie.net/growagarden/images/3/31/Watermelonfruiticon.png/revision/latest?cb=20250422203923",
    "Pumpkin": "https://static.wikia.nocookie.net/growagarden/images/3/36/Pumpkincropp.png/revision/latest?cb=20250423182726",
    "Apple": "https://static.wikia.nocookie.net/growagarden/images/c/c3/Applefruiticon.png/revision/latest?cb=20250423014534",
    "Bamboo": "https://static.wikia.nocookie.net/growagarden/images/8/88/Bamboofruiticon.png/revision/latest?cb=20250422225330",
    "Coconut": "https://static.wikia.nocookie.net/growagarden/images/4/46/Coconutfruiticon.png/revision/latest?cb=20250421045107",
    "Cactus": "https://static.wikia.nocookie.net/growagarden/images/8/86/Cactus_fruit_icon.png/revision/latest?cb=20250422183017",
    "Dragon Fruit": "https://static.wikia.nocookie.net/growagarden/images/4/4a/Dragonfruitthumb.png/revision/latest?cb=20250421182136",
    "Mango": "https://static.wikia.nocookie.net/growagarden/images/0/0e/MangoFruitIcon.png/revision/latest?cb=20250421020339",
    "Grape": "https://static.wikia.nocookie.net/growagarden/images/7/7b/Grapwes.png/revision/latest?cb=20250420202852",
    "Mushroom": "https://static.wikia.nocookie.net/growagarden/images/3/3a/MushroomCropsPic.png/revision/latest/scale-to-width-down/1000?cb=20250430134436",
    "Pepper": "https://static.wikia.nocookie.net/growagarden/images/2/29/PepperCropsPic.png/revision/latest/scale-to-width-down/1000?cb=20250503163931",
    "Cacao": "https://static.wikia.nocookie.net/growagarden/images/f/f2/CacaoIcon.png/revision/latest?cb=20250511025646",
    "Lemon": "https://static.wikia.nocookie.net/growagarden/images/9/92/LemonCropsPic.png/revision/latest?cb=20250429120733",
    "Pineapple": "https://static.wikia.nocookie.net/growagarden/images/7/7a/PineappleTreePic.png/revision/latest?cb=20250428191705",
    "Peach": "https://static.wikia.nocookie.net/growagarden/images/1/13/Transparent_Peach.png/revision/latest?cb=20250421060048",
    "Raspberry": "https://static.wikia.nocookie.net/growagarden/images/1/1f/Raspberry.png/revision/latest?cb=20250423134817",
    "Pear": "https://static.wikia.nocookie.net/growagarden/images/a/a1/Regpear.png/revision/latest?cb=20250417155929",
    "Cranberry": "https://static.wikia.nocookie.net/growagarden/images/d/dd/Cranberry.png/revision/latest?cb=20250427102834",
    "Durian": "https://static.wikia.nocookie.net/growagarden/images/c/c0/Duriannobg.png/revision/latest?cb=20250427170102",
    "Eggplant": "https://static.wikia.nocookie.net/growagarden/images/f/fb/EggplantCropPic.png/revision/latest?cb=20250429150832",
    "Venus Flytrap": "https://static.wikia.nocookie.net/growagarden/images/a/a5/VenusFlyTrapCropsPic.png/revision/latest/scale-to-width-down/1000?cb=20250430165230",
    "Lotus": "https://static.wikia.nocookie.net/growagarden/images/6/68/LotusPic.png/revision/latest?cb=20250428145838",
    "Papaya": "https://static.wikia.nocookie.net/growagarden/images/3/31/Papayafruiticon.png/revision/latest?cb=20250422220237",
    "Banana": "https://static.wikia.nocookie.net/growagarden/images/c/cf/BananaPic.png/revision/latest/scale-to-width-down/1000?cb=20250428203430",
    "Passionfruit": "https://static.wikia.nocookie.net/growagarden/images/0/01/NormalPassionfruitPic.png/revision/latest/scale-to-width-down/1000?cb=20250428142506",
    "Soul Fruit": "https://static.wikia.nocookie.net/growagarden/images/9/96/SoulFruitCropsPic.png/revision/latest/scale-to-width-down/1000?cb=20250503182228",
    "Cursed Fruit": "https://static.wikia.nocookie.net/growagarden/images/f/f3/Cursed_Fruit.png/revision/latest?cb=20250517073936",
    "Chocolate Carrot": "https://static.wikia.nocookie.net/growagarden/images/d/d8/Chococarrotthumb.png/revision/latest?cb=20250424063607",
    "Candy Sunflower": "https://static.wikia.nocookie.net/growagarden/images/e/ed/CandySunflowerPic.png/revision/latest?cb=20250429072940",
    "Easter Egg": "https://static.wikia.nocookie.net/growagarden/images/8/8e/Easter_egg_plant2.png/revision/latest?cb=20250422190119",
    "Red Lollipop": "https://static.wikia.nocookie.net/growagarden/images/0/0d/Redlollithumb.png/revision/latest?cb=20250429063543",
    "Candy Blossom": "https://static.wikia.nocookie.net/growagarden/images/5/52/CandyBlossomPic.png/revision/latest?cb=20250504064114",
    "Nightshade": "https://static.wikia.nocookie.net/growagarden/images/d/dd/Flower.png/revision/latest?cb=20250510162934",
    "Glowshroom": "https://static.wikia.nocookie.net/growagarden/images/f/f7/GlowshroomTreePic.png/revision/latest?cb=20250510180232",
    "Mint": "https://static.wikia.nocookie.net/growagarden/images/0/09/MintFruit.png/revision/latest?cb=20250511171855",
    "Moonflower": "https://static.wikia.nocookie.net/growagarden/images/a/a0/MoonFlowerCropsIcon.png/revision/latest?cb=20250511112259",
    "Starfruit": "https://static.wikia.nocookie.net/growagarden/images/6/62/StarFruitFruit.png/revision/latest?cb=20250511082657",
    "Moonglow": "https://static.wikia.nocookie.net/growagarden/images/5/54/Nobackgroundmoonglow.png.png/revision/latest?cb=20250510175014",
    "Moon Blossom": "https://static.wikia.nocookie.net/growagarden/images/a/af/MoonBlossomFruit.png/revision/latest?cb=20250511173731",
    "Beanstalk": "https://static.wikia.nocookie.net/growagarden/images/f/f9/BeanstalkIcon.png/revision/latest/scale-to-width-down/1000?cb=20250517153727",
    "Blood Banana": "https://static.wikia.nocookie.net/growagarden/images/8/83/Blood_Banana_Icon.png/revision/latest?cb=20250517140315",
    "Moon Melon": "https://static.wikia.nocookie.net/growagarden/images/4/4f/Moon_Melon_Icon.png/revision/latest?cb=20250517140316"
  };
  Object.values(categories).flat().forEach(crop => {
    const tr = document.createElement('tr');
    const imageUrl   = cropImageMap[crop] || '';
    const tooltip    = cropInfo[crop] || crop;
    tr.innerHTML = `
      <td style="display:flex; align-items:center; gap:10px;">
        <span class="seed-item tooltip" data-tooltip="${tooltip}">
          <img src="${imageUrl}"
               alt="${crop}"
               referrerpolicy="no-referrer"
               onerror="this.onerror=null;this.src='https://via.placeholder.com/28x28?text=❌';"
               style="width:80px; height:80px; border-radius:4px;">
        </span>
        <span style="color:#fff; font-weight:bold; margin-left:8px;">${crop}</span>
      </td>
      <td>₵${basePrices[crop]||'N/A'}</td>
    `;
    statsBody.appendChild(tr);
  });

  // ─── 6) Mutation & Variant Setup ─────────────────────────────────────────────
  const mutations = [
    { name: "Shocked",     value: 99 },
    { name: "Chilled",     value: 1  },
    { name: "Wet",         value: 1  },
    { name: "Moonlit",     value: 1  },
    { name: "Frozen",      value: 9  },
    { name: "Chocolate",   value: 1  },
    { name: "Bloodlit",    value: 3  },
    { name: "Zombified",   value: 24 },
    { name: "Celestial",   value: 119},
    { name: "Disco",       value: 124}
  ];
  let variantMultiplier = 1, baseMultiplier = 1;
  const mutationChips = document.getElementById('mutation-chips');
  mutations.forEach(m => {
    const chip = document.createElement('div');
    chip.className = 'mutation-chip';
    chip.textContent = m.name;
    chip.dataset.value = m.value;
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      updateMultiplier();
    });
    mutationChips.appendChild(chip);
  });

  const variantButtons = document.querySelectorAll('.variant-buttons button');
  variantButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      variantButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      variantMultiplier = parseInt(this.dataset.mult);
      updateMultiplier();
    });
  });

  // ─── 7) UI Wiring ────────────────────────────────────────────────────────────
  // Clear History (HTML has onclick="clearHistory()")
  window.clearHistory = () => {
    calculationHistory = [];
    localStorage.removeItem('gardenCalculations');
    updateHistoryDisplay();
  };

  // Calculate button
  document.getElementById('calculate-btn').addEventListener('click', calculate);

  // Sidebar search inline filter
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

  // Toggle history view (HTML uses onclick="toggleHistoryView()")
  window.toggleHistoryView = () => {
    document.getElementById('history-list').classList.toggle('compact-view');
  };

  // ─── 8) Initial Render ───────────────────────────────────────────────────────
  updateFavoritesDisplay();
  updateCategoryStars();
  updateMultiplier();
  updateHistoryDisplay();
  sidebar.classList.toggle('collapsed', sidebarCollapsed);
});

// ─── 9) Helper Functions ──────────────────────────────────────────────────────

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
        </button>
      `;
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
    ? favorites.filter(f => f !== crop)
    : [...favorites, crop];
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

window.selectPlant = (category, plant) => {
  selectCategory(category);
  document.getElementById('plant-select').value = plant;
};

window.selectCategory = (catName) => {
  hideCropReference();
  document.querySelectorAll('#sidebar button')
          .forEach(b => b.classList.toggle('active', b.textContent === catName));
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

function findCategoryForCrop(crop) {
  for (const [cat, cps] of Object.entries(categories)) {
    if (cps.includes(crop)) return cat;
  }
  return null;
}

window.selectCategoryFromFavorite = (crop) => {
  const cat = findCategoryForCrop(crop);
  if (cat) selectPlant(cat, crop);
};

function updateMultiplier() {
  let mutationSum = 0;
  document.querySelectorAll('.mutation-chip.active')
          .forEach(chip => mutationSum += parseInt(chip.dataset.value));
  const totalMult    = baseMultiplier + mutationSum;
  const effectiveMul = totalMult * variantMultiplier;
  document.getElementById('active-multiplier').textContent = effectiveMul;
  document.getElementById('multiplier').value            = effectiveMul;
}

function updateHistoryDisplay() {
  const list = document.getElementById('history-list');
  if (calculationHistory.length === 0) {
    list.innerHTML = '<li>No calculations yet.</li>';
    return;
  }
  list.innerHTML = calculationHistory.map(e =>
    `<li><span class="history-timestamp">${new Date(e.timestamp).toLocaleString()}</span>${e.html}</li>`
  ).join('');
}

window.validateMass = () => {
  const inp = document.getElementById('mass'),
        err = document.getElementById('massError'),
        v   = parseFloat(inp.value);
  if (v < 0.01) {
    err.textContent = "Mass cannot be less than 0.01 kg";
    err.style.display = 'block'; return false;
  }
  if (v > 9999) {
    err.textContent = "Mass cannot exceed 9999 kg";
    err.style.display = 'block'; return false;
  }
  err.style.display = 'none'; return true;
};

window.calculate = () => {
  if (!validateMass()) return;
  const plant = document.getElementById('plant-select').value;
  const mass  = parseFloat(document.getElementById('mass').value);
  const mult  = parseFloat(document.getElementById('multiplier').value);
  const base  = basePrices[plant] || 100;
  const price = Math.floor(mass * mass * base * mult);

  // Build display parts…
  let parts = [];
  const variantBtn     = document.querySelector('.variant-buttons button.active');
  const variant        = variantBtn ? variantBtn.textContent : 'Normal';
  const activeMutations = Array.from(document.querySelectorAll('.mutation-chip.active'))
                               .map(chip => chip.textContent);

  if (variant !== 'Normal') {
    const cls = variant === 'Golden' ? 'golden-text' : 'rainbow-text';
    parts.push(`<span class="${cls}">${variant.toLowerCase()}</span>`);
  }
  activeMutations.forEach(mut => {
    let cls = '';
    if (mut === 'Shocked') cls='shocked-text';
    else if (mut === 'Frozen') cls='frozen-text';
    else if (mut === 'Wet') cls='wet-text';
    else if (mut === 'Chilled') cls='chilled-text';
    else if (mut === 'Chocolate') cls='chocolate-text';
    else if (mut === 'Moonlit') cls='moonlit-text';
    else if (mut === 'Bloodlit') cls='bloodlit-text';
    else if (mut === 'Zombified') cls='zombified-text';
    else if (mut === 'Celestial') cls='celestial-text';
    else if (mut === 'Disco') cls='disco-text';
    parts.push(`<span class="${cls}">${mut.toLowerCase()}</span>`);
  });

  // Color-coded plant name
  const colorMap = {
    Carrot:'#FFA500',Strawberry:'#FF4C4C',Blueberry:'#4C4CFF',Tomato:'#FF6347',
    "Orange Tulip":'#FFB347',Corn:'#FFF200',Daffodil:'#FFFF66',Watermelon:'#FF6B6B',
    Pumpkin:'#FF7518',Apple:'#FF1A1A',Bamboo:'#7CFC00',Coconut:'#A0522D',Cactus:'#228B22',
    "Dragon Fruit":'#FF69B4',Mango:'#FFD166',Grape:'#800080',Mushroom:'#D2B48C',Pepper:'#FF0000',
    Cacao:'#5C3317',Pineapple:'#FFE135',Raspberry:'#E30B5D',Starfruit:'#FFF700',"Easter Egg":'#FFB6C1',
    "Candy Blossom":'#FF69B4',Eggplant:'#800080',Moonflower:'#9370DB',Moonglow:'#ADD8E6',
    Glowshroom:'#00CED1',Mint:'#98FF98',Beanstalk:'#2E8B57',"Blood Banana":'#8B0000',"Moon Melon":'#7FFFD4',
    Lemon:'#FFF44F',Peach:'#FFE5B4',Pear:'#D1E231',Papaya:'#FFDAB9',Banana:'#FFE135',
    Passionfruit:'#800080',"Soul Fruit":'#FF00FF',"Cursed Fruit":'#4B0082',"Chocolate Carrot":'#8B4513',
    "Candy Sunflower":'#FFD700',"Red Lollipop":'#FF0033',Nightshade:'#483D8B',"Moon Blossom":'#E6E6FA',
    Cranberry:'#A52A2A',Durian:'#A9A900',"Venus Flytrap":'#90EE90',Lotus:'#FFE4E1'
  };
  const clr = colorMap[plant] || '';
  parts.push(`<span style="color:${clr};font-weight:bold;">${plant.toLowerCase()}</span>`);

  const formattedName = parts.join(' ');
  const entry = {
    timestamp: new Date().toISOString(),
    html: `${formattedName} (${mass.toFixed(2)}kg × ${mult.toFixed(2)}) → ₵${price.toFixed(2)}`
  };

  // Update displays
  document.getElementById('calc-output').innerHTML = entry.html;
  document.getElementById('result').textContent   = entry.html;
  document.getElementById('result').style.display = 'block';

  calculationHistory.unshift(entry);
  if (calculationHistory.length > 10) calculationHistory.pop();
  localStorage.setItem('gardenCalculations', JSON.stringify(calculationHistory));
  updateHistoryDisplay();
};

window.hidePanel = () => {
  document.getElementById('panel').classList.remove('active');
  document.querySelectorAll('#sidebar button').forEach(b => b.classList.remove('active'));
  document.getElementById('result').style.display = 'none';
};

window.showCropReference = () => {
  document.getElementById('crop-reference').classList.add('active');
  document.querySelector('.main').style.display = 'none';
  document.getElementById('panel').classList.remove('active');
  document.body.style.overflow = 'hidden';
};

window.hideCropReference = () => {
  document.getElementById('crop-reference').classList.remove('active');
  document.querySelector('.main').style.display = 'flex';
  document.body.style.overflow = 'auto';
};
