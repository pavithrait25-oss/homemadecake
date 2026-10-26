/**
 * Sri Homemade Cakes - Main JavaScript
 * Handles Cake Catalog, Interactive Custom Order Builder,
 * WhatsApp Link Generation, Gallery Lightbox, and Baker Settings
 */

// Global Baker Settings (defaults with LocalStorage support)
const DEFAULT_BAKER_CONFIG = {
  phone: "+91 9566750694",
  whatsappNumber: "919566750694", // Clean digits for wa.me
  address: "Hosur,Tamilnadu,India",
  city: "Hosur"
};

let currentConfig = { ...DEFAULT_BAKER_CONFIG };

// Load settings from localStorage if available
function loadBakerConfig() {
  const saved = localStorage.getItem("sri_baker_config");
  if (saved) {
    try {
      currentConfig = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved config:", e);
    }
  }
  applyBakerConfigToDOM();
}

// Clean phone digits for wa.me
function getCleanDigits(phoneStr) {
  return phoneStr.replace(/[^0-9]/g, "");
}

// Apply config values to DOM elements
function applyBakerConfigToDOM() {
  document.querySelectorAll(".phone-display").forEach(el => {
    el.textContent = currentConfig.phone;
  });

  document.querySelectorAll(".phone-call-link").forEach(el => {
    el.setAttribute("href", `tel:${currentConfig.phone}`);
  });

  document.querySelectorAll(".address-display").forEach(el => {
    el.textContent = currentConfig.address;
  });

  const configPhoneInput = document.getElementById("configPhone");
  if (configPhoneInput) configPhoneInput.value = currentConfig.phone;

  const configAddressInput = document.getElementById("configAddress");
  if (configAddressInput) configAddressInput.value = currentConfig.address;
}

// Open direct WhatsApp chat with message
function openDirectWhatsApp(messageText) {
  const cleanPhone = getCleanDigits(currentConfig.phone) || "919876543210";
  const encodedText = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

// Display toast notification
function showToast(message) {
  const toast = document.getElementById("toastNotice");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

/* ============================================================
   CAKE CATALOG DATA (All 10 user requested cakes)
============================================================ */
const cakeCatalog = [
  {
    id: "cake-1",
    name: "Chocolate Cake",
    subName: "Rich Dutch Truffle",
    category: "chocolate",
    tag: "Bestseller",
    tagClass: "tag-bestseller",
    diet: "Pure Veg / Eggless Available",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
    description: "Decadent dark chocolate sponge layered with silky Belgian chocolate ganache and chocolate curls.",
    prices: { "0.5": 500, "1": 950, "2": 1850 },
    defaultWeight: "1"
  },
  {
    id: "cake-2",
    name: "Black Forest Cake",
    subName: "Classic Cherry & Cream",
    category: "classics",
    tag: "All-Time Classic",
    tagClass: "",
    diet: "Egg & Eggless Options",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80",
    description: "Layers of moist chocolate sponge soaked with tart cherries, fresh dairy whipped cream, and chocolate flakes.",
    prices: { "0.5": 450, "1": 850, "2": 1650 },
    defaultWeight: "1"
  },
  {
    id: "cake-3",
    name: "Red Velvet Cake",
    subName: "Velvety Cream Cheese",
    category: "classics",
    tag: "Chef's Special",
    tagClass: "tag-special",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&auto=format&fit=crop&q=80",
    description: "Rich crimson cocoa sponge with our signature tangy cream cheese frosting and fine red velvet crumbs.",
    prices: { "0.5": 550, "1": 1050, "2": 2000 },
    defaultWeight: "1"
  },
  {
    id: "cake-4",
    name: "Vanilla Cake",
    subName: "Pure Madagascar Vanilla Bean",
    category: "classics",
    tag: "Family Favorite",
    tagClass: "",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80",
    description: "Soft golden sponge infused with genuine vanilla bean caviar, enveloped in delicate whipped vanilla buttercream.",
    prices: { "0.5": 400, "1": 750, "2": 1450 },
    defaultWeight: "1"
  },
  {
    id: "cake-5",
    name: "Butterscotch Cake",
    subName: "Caramel Crunch Delight",
    category: "classics",
    tag: "Crunchy Delight",
    tagClass: "",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=800&auto=format&fit=crop&q=80",
    description: "Caramel-infused butter sponge loaded with handmade butterscotch crunch praline and golden butterscotch drizzle.",
    prices: { "0.5": 450, "1": 850, "2": 1650 },
    defaultWeight: "1"
  },
  {
    id: "cake-6",
    name: "Fruit Cake",
    subName: "Fresh Seasonal Fruit Melody",
    category: "classics",
    tag: "Fresh & Light",
    tagClass: "tag-special",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    description: "Light vanilla sponge loaded with freshly sliced seasonal fruits (kiwi, berries, mango, grapes) and light dairy cream.",
    prices: { "0.5": 550, "1": 1050, "2": 2000 },
    defaultWeight: "1"
  },
  {
    id: "cake-7",
    name: "Cheesecake",
    subName: "Baked New York & Berry Swirl",
    category: "cheesecake",
    tag: "Premium",
    tagClass: "tag-special",
    diet: "Egg & Eggless Available",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80",
    description: "Creamy slow-baked authentic cheesecake on a buttery biscuit base, crowned with wild blueberry compote.",
    prices: { "0.5": 650, "1": 1250, "2": 2400 },
    defaultWeight: "1"
  },
  {
    id: "cake-8",
    name: "Birthday Cakes",
    subName: "Celebration Sprinkles & Candles",
    category: "celebration",
    tag: "Celebration Hit",
    tagClass: "tag-bestseller",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80",
    description: "Festive celebration cake with vibrant sprinkles, personalized birthday piping, colorful rosettes, and candles.",
    prices: { "0.5": 500, "1": 950, "2": 1850 },
    defaultWeight: "1"
  },
  {
    id: "cake-9",
    name: "Cartoon Cakes",
    subName: "Kids Theme & Fondant Magic",
    category: "celebration",
    tag: "Kids Favorite",
    tagClass: "tag-bestseller",
    diet: "Eggless Available",
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=800&auto=format&fit=crop&q=80",
    description: "Adorable theme cakes for children! Customizable with cartoon figures, unicorns, superheroes, or pastel rainbow themes.",
    prices: { "0.5": 600, "1": 1150, "2": 2200 },
    defaultWeight: "1"
  },
  {
    id: "cake-10",
    name: "Customised Cakes",
    subName: "Bespoke Multi-Tier & Photo Cakes",
    category: "custom",
    tag: "Personalised",
    tagClass: "tag-special",
    diet: "Custom Dietary Available",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80",
    description: "Tailor-made for weddings, engagements, milestone anniversaries, and bespoke designer themes with edible flowers.",
    prices: { "0.5": 650, "1": 1200, "2": 2300 },
    defaultWeight: "1"
  }
];

// Current selected weight for each cake card
const selectedWeights = {};

// Initialize default selected weights
cakeCatalog.forEach(cake => {
  selectedWeights[cake.id] = cake.defaultWeight;
});

// Render Cake Menu Grid
function renderCakeCatalog(filter = "all") {
  const grid = document.getElementById("cakeGrid");
  if (!grid) return;

  const filteredCakes = filter === "all" 
    ? cakeCatalog 
    : cakeCatalog.filter(cake => cake.category === filter);

  grid.innerHTML = filteredCakes.map(cake => {
    const currentWeight = selectedWeights[cake.id] || "1";
    const currentPrice = cake.prices[currentWeight] || cake.prices["1"];

    return `
      <div class="cake-card" data-category="${cake.category}" id="card-${cake.id}">
        <div class="cake-card-img-wrap">
          <img src="${cake.image}" alt="${cake.name} - Sri Homemade Cakes" class="cake-card-img" loading="lazy" />
          ${cake.tag ? `<span class="cake-tag-badge ${cake.tagClass}">${cake.tag}</span>` : ""}
          <span class="cake-diet-pill">
            <span class="veg-circle"></span> ${cake.diet}
          </span>
        </div>

        <div class="cake-card-body">
          <h3 class="cake-title">${cake.name}</h3>
          <p class="cake-desc">${cake.description}</p>

          <!-- Weight Selector -->
          <div class="cake-size-selector">
            <span class="selector-label">Choose Weight:</span>
            <div class="weight-btn-group">
              <button type="button" class="weight-chip ${currentWeight === '0.5' ? 'selected' : ''}" 
                onclick="changeCakeWeight('${cake.id}', '0.5')">0.5 Kg</button>
              <button type="button" class="weight-chip ${currentWeight === '1' ? 'selected' : ''}" 
                onclick="changeCakeWeight('${cake.id}', '1')">1.0 Kg</button>
              <button type="button" class="weight-chip ${currentWeight === '2' ? 'selected' : ''}" 
                onclick="changeCakeWeight('${cake.id}', '2')">2.0 Kg</button>
            </div>
          </div>

          <!-- Price & Order Action -->
          <div class="cake-footer-row">
            <div class="price-box">
              <span class="price-label">Starting at</span>
              <div class="price-value">
                <span class="price-currency">₹</span><span id="price-${cake.id}">${currentPrice}</span>
              </div>
            </div>

            <button type="button" class="btn btn-whatsapp btn-sm" 
              onclick="orderCakeWhatsApp('${cake.id}')">
              <svg class="icon-whatsapp" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.52 0-3-.41-4.31-1.19l-.31-.18-3.2.84.85-3.12-.2-.32a8.199 8.199 0 0 1-1.26-4.39c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c.01 4.54-3.69 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1.01 2.54.12.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29z"/>
              </svg>
              <span>Order</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Change weight on a card and update price
function changeCakeWeight(cakeId, weight) {
  selectedWeights[cakeId] = weight;
  const cake = cakeCatalog.find(c => c.id === cakeId);
  if (!cake) return;

  const card = document.getElementById(`card-${cakeId}`);
  if (card) {
    const chips = card.querySelectorAll(".weight-chip");
    chips.forEach(chip => {
      chip.classList.toggle("selected", chip.textContent.includes(weight));
    });

    const priceEl = document.getElementById(`price-${cakeId}`);
    if (priceEl) {
      priceEl.textContent = cake.prices[weight];
    }
  }
}

// Trigger WhatsApp order for a specific menu cake
function orderCakeWhatsApp(cakeId) {
  const cake = cakeCatalog.find(c => c.id === cakeId);
  if (!cake) return;

  const weight = selectedWeights[cakeId] || "1";
  const price = cake.prices[weight];

  const orderMsg = 
`🎂 *Cake Order Enquiry - Sri Homemade Cakes*
---------------------------------------
• *Cake:* ${cake.name} (${cake.subName})
• *Weight:* ${weight} Kg
• *Estimated Price:* ₹${price}
• *Dietary Note:* Eggless option requested
---------------------------------------
Hello Sri Homemade Cakes! I would like to order this cake. Please let me know your availability for my date. Thank you!`;

  openDirectWhatsApp(orderMsg);
}

// Filter Menu helper
function filterMenu(category) {
  const filterButtons = document.querySelectorAll("#menuFilters .filter-btn");
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === category);
  });
  renderCakeCatalog(category);
}

/* ============================================================
   GALLERY DATA & LIGHTBOX
============================================================ */
const galleryItems = [
  {
    id: "gal-1",
    category: "chocolate",
    title: "Rich Chocolate Truffle with Berries",
    description: "Multi-layered chocolate cake dripping with rich dark ganache and fresh raspberries.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-2",
    category: "birthday",
    title: "Festive Birthday Celebration Cake",
    description: "Vanilla buttercream celebration cake with rainbow sprinkles and birthday candles.",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-3",
    category: "celebration",
    title: "Elegant Floral Celebration Cake",
    description: "Two-tiered semi-naked cake adorned with fresh roses and delicate gold leaf.",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-4",
    category: "customized",
    title: "Cute Cartoon & Pastel Theme Cake",
    description: "Delightful colorful pastel rosettes and fun sprinkles crafted for a child's milestone party.",
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-5",
    category: "chocolate",
    title: "Decadent Black Forest Cake",
    description: "Classic Black forest with cherry compote, fresh whip cream, and dark chocolate shavings.",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-6",
    category: "celebration",
    title: "Deluxe Wedding / Anniversary Cake",
    description: "Piped royal icing with delicate white sugar pearls and fresh strawberries.",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-7",
    category: "birthday",
    title: "Party Cupcakes & Cake Table",
    description: "Assorted homemade cupcakes and centerpiece birthday cake for celebration parties.",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "gal-8",
    category: "customized",
    title: "Artistic Strawberry Glaze Cake",
    description: "Fresh strawberry compote glaze on a light chiffon sponge with handmade macarons.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80"
  }
];

function renderGallery(filter = "all") {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const filtered = filter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === filter);

  grid.innerHTML = filtered.map(item => `
    <div class="gallery-item" onclick="openLightbox('${item.id}')">
      <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy" />
      <div class="gallery-zoom-badge">🔍</div>
      <div class="gallery-overlay">
        <h4 class="gallery-caption-title">${item.title}</h4>
        <p class="gallery-caption-sub">${item.description}</p>
      </div>
    </div>
  `).join("");
}

// Lightbox modal operations
function openLightbox(itemId) {
  const item = galleryItems.find(g => g.id === itemId);
  if (!item) return;

  const modal = document.getElementById("lightboxModal");
  const img = document.getElementById("lightboxImg");
  const title = document.getElementById("lightboxTitle");
  const desc = document.getElementById("lightboxDescription");
  const orderBtn = document.getElementById("lightboxOrderBtn");

  if (!modal || !img) return;

  img.src = item.image;
  img.alt = item.title;
  title.textContent = item.title;
  desc.textContent = item.description;

  orderBtn.onclick = function() {
    const msg = `Hello Sri Homemade Cakes! I saw this cake in your gallery: "${item.title}". I would love to order a cake in this style. Please share pricing and details.`;
    openDirectWhatsApp(msg);
  };

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/* ============================================================
   5. CUSTOM CAKE ORDERS FORM & LIVE PREVIEW
============================================================ */
let isPriceManuallyEdited = false;

// Calculate smart price estimate based on selected flavour, weight, and design
function calculateCustomCakeEstimate() {
  const flavour = document.getElementById("cakeFlavour")?.value || "";
  const weight = document.getElementById("cakeWeight")?.value || "";
  const style = document.getElementById("cakeDesignStyle")?.value || "";

  // Base 1kg prices
  let base1Kg = 950;
  if (flavour.includes("Vanilla")) {
    base1Kg = 750;
  } else if (flavour.includes("Black Forest") || flavour.includes("Butterscotch")) {
    base1Kg = 850;
  } else if (flavour.includes("Chocolate")) {
    base1Kg = 950;
  } else if (flavour.includes("Red Velvet") || flavour.includes("Fruit")) {
    base1Kg = 1050;
  } else if (flavour.includes("Rasmalai")) {
    base1Kg = 1100;
  } else if (flavour.includes("Cheesecake")) {
    base1Kg = 1250;
  }

  // Weight multipliers
  let weightFactor = 1.0;
  if (weight.includes("0.5")) {
    weightFactor = 0.55;
  } else if (weight.includes("1.5")) {
    weightFactor = 1.48;
  } else if (weight.includes("2")) {
    weightFactor = 1.95;
  } else if (weight.includes("3")) {
    weightFactor = 2.85;
  }

  let calculated = Math.round((base1Kg * weightFactor) / 50) * 50;

  // Add-ons for custom styles
  if (style.includes("Cartoon") || style.includes("Fondant")) {
    calculated += 200;
  } else if (style.includes("Photo Cake")) {
    calculated += 150;
  } else if (style.includes("2-Tier")) {
    calculated += 250;
  }

  return calculated;
}

function updateCustomOrderLivePreview() {
  const name = document.getElementById("custName")?.value.trim() || "Your Name";
  const flavour = document.getElementById("cakeFlavour")?.value || "Rich Chocolate Truffle";
  const weight = document.getElementById("cakeWeight")?.value || "1.0 Kg";
  const occasion = document.getElementById("cakeOccasion")?.value || "Birthday";
  const style = document.getElementById("cakeDesignStyle")?.value || "Classic Round";
  const date = document.getElementById("deliveryDate")?.value || "Select date";
  const cakeMsg = document.getElementById("cakeMessage")?.value.trim() || "None yet";
  const notes = document.getElementById("specialNotes")?.value.trim() || "None";

  const priceInput = document.getElementById("cakePrice");
  const priceStatusTag = document.getElementById("priceStatusTag");

  // If user hasn't typed a custom budget, auto-update with current estimate
  if (!isPriceManuallyEdited && priceInput) {
    const est = calculateCustomCakeEstimate();
    priceInput.value = est;
    if (priceStatusTag) {
      priceStatusTag.textContent = "Estimated";
      priceStatusTag.classList.remove("tag-custom");
    }
  }

  const currentPrice = priceInput?.value.trim() || calculateCustomCakeEstimate();

  // Update price display banner
  const displayCustomPriceEl = document.getElementById("displayCustomPrice");
  if (displayCustomPriceEl) {
    displayCustomPriceEl.textContent = currentPrice;
  }

  const eggRadio = document.querySelector('input[name="eggPreference"]:checked');
  const diet = eggRadio ? eggRadio.value : "100% Eggless";

  document.getElementById("prevName").textContent = name;
  document.getElementById("prevFlavour").textContent = flavour;
  document.getElementById("prevWeight").textContent = weight;
  document.getElementById("prevOccasion").textContent = occasion;
  document.getElementById("prevStyle").textContent = style;
  document.getElementById("prevDiet").textContent = diet;
  document.getElementById("prevDate").textContent = date;
  document.getElementById("prevMessage").textContent = cakeMsg;
  document.getElementById("prevNotes").textContent = notes;

  const prevPriceEl = document.getElementById("prevPrice");
  if (prevPriceEl) {
    prevPriceEl.textContent = isPriceManuallyEdited
      ? `₹${currentPrice} (Your Budget)`
      : `₹${currentPrice} (Estimated)`;
  }
}

// Submit Custom Order on WhatsApp
function submitCustomOrder() {
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const occasion = document.getElementById("cakeOccasion").value;
  const flavour = document.getElementById("cakeFlavour").value;
  const weight = document.getElementById("cakeWeight").value;
  const style = document.getElementById("cakeDesignStyle").value;
  const date = document.getElementById("deliveryDate").value;
  const cakeMsg = document.getElementById("cakeMessage").value.trim() || "No message requested";
  const notes = document.getElementById("specialNotes").value.trim() || "None";
  const priceInput = document.getElementById("cakePrice");
  const price = priceInput && priceInput.value.trim() ? priceInput.value.trim() : calculateCustomCakeEstimate();

  const eggRadio = document.querySelector('input[name="eggPreference"]:checked');
  const diet = eggRadio ? eggRadio.value : "100% Eggless";

  if (!name || !phone || !date) {
    showToast("⚠️ Please fill in all required fields (Name, Phone & Date).");
    return;
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    showToast("⚠️ Please enter a valid estimated price or budget.");
    return;
  }

  const priceLabel = isPriceManuallyEdited ? `₹${price} (Customer Budget)` : `₹${price} (Estimated)`;

  const whatsappMessage = 
`🎂 *NEW CUSTOM CAKE ORDER - SRI HOMEMADE CAKES*
=========================================
👤 *Customer Name:* ${name}
📞 *Customer Phone:* ${phone}
🎉 *Occasion:* ${occasion}
🍰 *Flavour Choice:* ${flavour}
⚖️ *Size / Weight:* ${weight}
🌱 *Dietary Preference:* ${diet}
🎨 *Shape & Design:* ${style}
💰 *Estimated Price / Budget:* ${priceLabel}
📅 *Required By (Date):* ${date}
✍️ *Message on Cake:* "${cakeMsg}"
📝 *Special Instructions:* ${notes}
=========================================
Hello Sri Homemade Cakes! I have customized this cake order with my price/budget. Please let me know your availability and confirm the order. Thank you!`;

  openDirectWhatsApp(whatsappMessage);
  showToast("Opening WhatsApp with your order details...");
}

/* ============================================================
   6. QUICK CONTACT INQUIRY
============================================================ */
function submitQuickInquiry() {
  const name = document.getElementById("quickName").value.trim();
  const occasion = document.getElementById("quickOccasion").value.trim() || "Not specified";
  const inquiry = document.getElementById("quickMessage").value.trim();

  if (!name || !inquiry) {
    showToast("⚠️ Please enter your name and inquiry.");
    return;
  }

  const quickMsg = 
`💬 *General Enquiry - Sri Homemade Cakes*
---------------------------------------
👤 *Name:* ${name}
🎉 *Occasion:* ${occasion}
❓ *Question:* ${inquiry}
---------------------------------------
Hello Sri Homemade Cakes, please get back to me with details!`;

  openDirectWhatsApp(quickMsg);
  showToast("Opening WhatsApp chat...");
}

/* ============================================================
   BAKER SETTINGS / CONFIG MODAL
============================================================ */
function openConfigModal() {
  const modal = document.getElementById("configModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeConfigModal() {
  const modal = document.getElementById("configModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function saveBakerSettings() {
  const phone = document.getElementById("configPhone").value.trim();
  const address = document.getElementById("configAddress").value.trim();

  if (!phone) {
    showToast("Please enter a valid phone number.");
    return;
  }

  currentConfig.phone = phone;
  currentConfig.whatsappNumber = getCleanDigits(phone);
  currentConfig.address = address;

  localStorage.setItem("sri_baker_config", JSON.stringify(currentConfig));
  applyBakerConfigToDOM();
  closeConfigModal();
  showToast("✅ Baker details updated successfully!");
}

function resetDefaultConfig() {
  currentConfig = { ...DEFAULT_BAKER_CONFIG };
  localStorage.removeItem("sri_baker_config");
  applyBakerConfigToDOM();
  closeConfigModal();
  showToast("🔄 Reset to default placeholders.");
}

/* ============================================================
   EVENT LISTENERS & INITIALIZATION
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Load Baker configuration
  loadBakerConfig();

  // 2. Render Menus & Gallery
  renderCakeCatalog("all");
  renderGallery("all");

  // 3. Set minimum delivery date to tomorrow
  const dateInput = document.getElementById("deliveryDate");
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  // 4. Custom Order live preview listener
  const formElements = [
    "custName", "cakeFlavour", "cakeWeight", "cakeOccasion",
    "cakeDesignStyle", "deliveryDate", "cakeMessage", "cakePrice", "specialNotes"
  ];
  formElements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updateCustomOrderLivePreview);
      el.addEventListener("change", updateCustomOrderLivePreview);
    }
  });

  const cakePriceEl = document.getElementById("cakePrice");
  const priceStatusTag = document.getElementById("priceStatusTag");
  const btnResetPrice = document.getElementById("btnResetPrice");

  if (cakePriceEl) {
    cakePriceEl.addEventListener("input", () => {
      isPriceManuallyEdited = true;
      if (priceStatusTag) {
        priceStatusTag.textContent = "Your Budget";
        priceStatusTag.classList.add("tag-custom");
      }
    });
  }

  if (btnResetPrice) {
    btnResetPrice.addEventListener("click", () => {
      isPriceManuallyEdited = false;
      const est = calculateCustomCakeEstimate();
      if (cakePriceEl) cakePriceEl.value = est;
      if (priceStatusTag) {
        priceStatusTag.textContent = "Estimated";
        priceStatusTag.classList.remove("tag-custom");
      }
      updateCustomOrderLivePreview();
      showToast(`🔄 Price auto-calculated to ₹${est}`);
    });
  }

  document.querySelectorAll('input[name="eggPreference"]').forEach(radio => {
    radio.addEventListener("change", updateCustomOrderLivePreview);
  });

  // Initial preview update
  updateCustomOrderLivePreview();

  // 5. Menu Filters
  const menuFilterBtns = document.querySelectorAll("#menuFilters .filter-btn");
  menuFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      menuFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCakeCatalog(btn.dataset.filter);
    });
  });

  // 6. Gallery Filters
  const galleryFilterBtns = document.querySelectorAll("#galleryFilters .gallery-filter-btn");
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      galleryFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery(btn.dataset.category);
    });
  });

  // 7. Mobile Drawer Toggle
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.toggle("open");
      mobileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 8. Sticky Nav active state tracking on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });

  // 9. Keyboard Escape to close modals
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeConfigModal();
    }
  });

  // 10. Update copyright year
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 11. Initialize 3D Hero Chocolate Birthday Cake Animation
  initHeroCake3D();
});

/* ============================================================
   3D HERO CHOCOLATE BIRTHDAY CAKE ANIMATION (Three.js)
   - Procedural 3D two-tier chocolate birthday cake with ganache drips
   - Stand, rosettes, candied cherries, candles with glowing flame
   - Floating chocolate shards, curls, golden pearls and sparkles
   - Interactive 360° mouse & touch drag with inertia
   - Viewport-aware rendering (IntersectionObserver) & Reduced Motion support
============================================================ */
function initHeroCake3D() {
  const container = document.getElementById("cake3DStage");
  const canvas = document.getElementById("heroCakeCanvas");
  const fallbackImg = document.getElementById("heroFallbackImg");
  const hintPill = document.getElementById("cake3DHint");

  if (!container || !canvas) return;

  // 1. Check Three.js availability
  if (typeof THREE === "undefined") {
    console.warn("Three.js not detected; displaying fallback hero image.");
    if (fallbackImg) fallbackImg.style.display = "block";
    if (canvas) canvas.style.display = "none";
    if (hintPill) hintPill.style.display = "none";
    return;
  }

  // 2. Check WebGL support
  let isWebGLAvailable = false;
  try {
    const testCanvas = document.createElement("canvas");
    isWebGLAvailable = !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    isWebGLAvailable = false;
  }

  if (!isWebGLAvailable) {
    console.warn("WebGL not supported; falling back to hero image.");
    if (fallbackImg) fallbackImg.style.display = "block";
    if (canvas) canvas.style.display = "none";
    if (hintPill) hintPill.style.display = "none";
    return;
  }

  // 3. Setup Three.js Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 4. Scene & Perspective Camera (food photography 18° elevation angle)
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    38,
    container.clientWidth / (container.clientHeight || 1),
    0.1,
    100
  );
  camera.position.set(0, 2.7, 11.2);
  camera.lookAt(0, 0.6, 0);

  // 5. Lighting Setup (Key, Fill, Rim, Ambient, Candle Point Light)
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.72);
  scene.add(ambientLight);

  // Warm key light casting soft bakery shadow
  const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.35);
  keyLight.position.set(5.5, 9, 7.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Warm fill light from lower left to keep chocolate shadows rich
  const fillLight = new THREE.DirectionalLight(0xb86c38, 0.55);
  fillLight.position.set(-6, 3, -2);
  scene.add(fillLight);

  // Rim light to highlight chocolate silhouette edges
  const rimLight = new THREE.DirectionalLight(0xffdfba, 0.8);
  rimLight.position.set(0, 7, -8);
  scene.add(rimLight);

  // Dynamic candle flame point light with flicker
  const candleLight = new THREE.PointLight(0xffa224, 1.4, 7.5, 1.6);
  candleLight.position.set(0, 3.8, 0);
  scene.add(candleLight);

  // 6. Realistic Materials Palette
  const darkChocolateMat = new THREE.MeshStandardMaterial({
    color: 0x241209,
    roughness: 0.32,
    metalness: 0.08
  });

  const ganacheMirrorMat = new THREE.MeshStandardMaterial({
    color: 0x1a0a04,
    roughness: 0.13,
    metalness: 0.16
  });

  const milkChocoFrostingMat = new THREE.MeshStandardMaterial({
    color: 0x3d1f13,
    roughness: 0.36,
    metalness: 0.06
  });

  const vanillaCreamMat = new THREE.MeshStandardMaterial({
    color: 0xfdf6ea,
    roughness: 0.3,
    metalness: 0.04
  });

  const cherryMat = new THREE.MeshStandardMaterial({
    color: 0x8b0010,
    roughness: 0.08,
    metalness: 0.16
  });

  const cherryStemMat = new THREE.MeshStandardMaterial({
    color: 0x3e2814,
    roughness: 0.6,
    metalness: 0.05
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xe8ba47,
    roughness: 0.22,
    metalness: 0.88
  });

  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xfaf6f0,
    roughness: 0.2,
    metalness: 0.04
  });

  const candleMat = new THREE.MeshStandardMaterial({
    color: 0xfff9e8,
    roughness: 0.28,
    metalness: 0.08
  });

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
  const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xfffff0 });

  // 7. Master Cake Assembly Group
  const cakeGroup = new THREE.Group();
  scene.add(cakeGroup);

  // 8. Porcelain Pedestal Stand with Gold Rim
  const standGroup = new THREE.Group();
  cakeGroup.add(standGroup);

  // Base foot
  const baseMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(2.35, 2.7, 0.34, 48),
    porcelainMat
  );
  baseMesh.position.y = -2.14;
  baseMesh.receiveShadow = true;
  standGroup.add(baseMesh);

  // Base gold ring
  const baseRim = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.05, 16, 48),
    goldMat
  );
  baseRim.rotation.x = Math.PI / 2;
  baseRim.position.y = -2.28;
  standGroup.add(baseRim);

  // Pedestal stem
  const stemMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.82, 1.35, 32),
    porcelainMat
  );
  stemMesh.position.y = -1.35;
  stemMesh.castShadow = true;
  stemMesh.receiveShadow = true;
  standGroup.add(stemMesh);

  // Stem gold accent ring
  const stemRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.06, 16, 32),
    goldMat
  );
  stemRing.rotation.x = Math.PI / 2;
  stemRing.position.y = -1.45;
  standGroup.add(stemRing);

  // Platter plate
  const platterMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(3.55, 3.35, 0.24, 64),
    porcelainMat
  );
  platterMesh.position.y = -0.56;
  platterMesh.receiveShadow = true;
  platterMesh.castShadow = true;
  standGroup.add(platterMesh);

  // Platter gold rim
  const platterRim = new THREE.Mesh(
    new THREE.TorusGeometry(3.55, 0.06, 16, 64),
    goldMat
  );
  platterRim.rotation.x = Math.PI / 2;
  platterRim.position.y = -0.45;
  standGroup.add(platterRim);

  // 9. Soft Contact Shadows (Radial Alpha Canvas)
  function createSoftShadowTexture() {
    const sCanvas = document.createElement("canvas");
    sCanvas.width = 256;
    sCanvas.height = 256;
    const ctx = sCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(128, 128, 15, 128, 128, 128);
    gradient.addColorStop(0, "rgba(22, 10, 5, 0.82)");
    gradient.addColorStop(0.35, "rgba(25, 12, 6, 0.52)");
    gradient.addColorStop(0.7, "rgba(30, 15, 8, 0.16)");
    gradient.addColorStop(1, "rgba(30, 15, 8, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(sCanvas);
  }

  const shadowTexture = createSoftShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false
  });

  // Platter shadow under lower tier
  const platterShadow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), shadowMat);
  platterShadow.rotation.x = -Math.PI / 2;
  platterShadow.position.y = -0.43;
  standGroup.add(platterShadow);

  // Table shadow under stand
  const floorShadow = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 6.8), shadowMat);
  floorShadow.rotation.x = -Math.PI / 2;
  floorShadow.position.y = -2.32;
  scene.add(floorShadow);

  // 10. Two-Tier Chocolate Cake
  const cakeTiersGroup = new THREE.Group();
  cakeGroup.add(cakeTiersGroup);

  // === LOWER TIER ===
  const lowerTierGeom = new THREE.CylinderGeometry(2.85, 2.85, 1.7, 64);
  const lowerTierMesh = new THREE.Mesh(lowerTierGeom, darkChocolateMat);
  lowerTierMesh.position.y = 0.42;
  lowerTierMesh.castShadow = true;
  lowerTierMesh.receiveShadow = true;
  cakeTiersGroup.add(lowerTierMesh);

  // Lower tier mirror ganache top glaze
  const lowerGlazeGeom = new THREE.CylinderGeometry(2.88, 2.88, 0.14, 64);
  const lowerGlazeMesh = new THREE.Mesh(lowerGlazeGeom, ganacheMirrorMat);
  lowerGlazeMesh.position.y = 1.28;
  lowerGlazeMesh.castShadow = true;
  cakeTiersGroup.add(lowerGlazeMesh);

  // Lower tier base chocolate pearls garland
  const pearlGeom = new THREE.SphereGeometry(0.13, 12, 12);
  const lowerPearlCount = 32;
  for (let i = 0; i < lowerPearlCount; i++) {
    const angle = (i / lowerPearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeom, milkChocoFrostingMat);
    pearl.position.set(Math.cos(angle) * 2.86, -0.36, Math.sin(angle) * 2.86);
    pearl.castShadow = true;
    cakeTiersGroup.add(pearl);
  }

  // Lower tier ganache drips
  const lowerDripCount = 22;
  for (let i = 0; i < lowerDripCount; i++) {
    const angle = (i / lowerDripCount) * Math.PI * 2 + Math.sin(i * 3.1) * 0.08;
    const dripLen = 0.35 + Math.abs(Math.sin(i * 2.7)) * 0.45 + (i % 4 === 0 ? 0.3 : 0);
    const dripR = 2.88;

    const dripBodyGeom = new THREE.CylinderGeometry(0.07, 0.11, dripLen, 10);
    const dripBody = new THREE.Mesh(dripBodyGeom, ganacheMirrorMat);
    dripBody.position.set(
      Math.cos(angle) * dripR,
      1.24 - dripLen / 2,
      Math.sin(angle) * dripR
    );
    cakeTiersGroup.add(dripBody);

    const tipGeom = new THREE.SphereGeometry(0.1, 10, 10);
    const tip = new THREE.Mesh(tipGeom, ganacheMirrorMat);
    tip.position.set(
      Math.cos(angle) * dripR,
      1.24 - dripLen,
      Math.sin(angle) * dripR
    );
    cakeTiersGroup.add(tip);
  }

  // === UPPER TIER ===
  const upperTierGeom = new THREE.CylinderGeometry(1.92, 1.92, 1.45, 64);
  const upperTierMesh = new THREE.Mesh(upperTierGeom, darkChocolateMat);
  upperTierMesh.position.y = 2.0;
  upperTierMesh.castShadow = true;
  upperTierMesh.receiveShadow = true;
  cakeTiersGroup.add(upperTierMesh);

  // Upper tier mirror ganache glaze
  const upperGlazeGeom = new THREE.CylinderGeometry(1.95, 1.95, 0.12, 64);
  const upperGlazeMesh = new THREE.Mesh(upperGlazeGeom, ganacheMirrorMat);
  upperGlazeMesh.position.y = 2.73;
  upperGlazeMesh.castShadow = true;
  cakeTiersGroup.add(upperGlazeMesh);

  // Junction piping (alternating vanilla cream and chocolate rosettes)
  const junctionPearlCount = 24;
  for (let i = 0; i < junctionPearlCount; i++) {
    const angle = (i / junctionPearlCount) * Math.PI * 2;
    const isCream = i % 2 === 0;
    const junctionPearl = new THREE.Mesh(
      pearlGeom,
      isCream ? vanillaCreamMat : milkChocoFrostingMat
    );
    junctionPearl.position.set(
      Math.cos(angle) * 1.94,
      1.31,
      Math.sin(angle) * 1.94
    );
    junctionPearl.castShadow = true;
    cakeTiersGroup.add(junctionPearl);
  }

  // Upper tier ganache drips
  const upperDripCount = 18;
  for (let i = 0; i < upperDripCount; i++) {
    const angle = (i / upperDripCount) * Math.PI * 2 + Math.cos(i * 2.3) * 0.08;
    const dripLen = 0.28 + Math.abs(Math.sin(i * 3.4)) * 0.4 + (i % 3 === 0 ? 0.25 : 0);
    const dripR = 1.95;

    const dripBodyGeom = new THREE.CylinderGeometry(0.06, 0.09, dripLen, 10);
    const dripBody = new THREE.Mesh(dripBodyGeom, ganacheMirrorMat);
    dripBody.position.set(
      Math.cos(angle) * dripR,
      2.7 - dripLen / 2,
      Math.sin(angle) * dripR
    );
    cakeTiersGroup.add(dripBody);

    const tipGeom = new THREE.SphereGeometry(0.085, 10, 10);
    const tip = new THREE.Mesh(tipGeom, ganacheMirrorMat);
    tip.position.set(
      Math.cos(angle) * dripR,
      2.7 - dripLen,
      Math.sin(angle) * dripR
    );
    cakeTiersGroup.add(tip);
  }

  // === TOP DECORATIONS ===
  // 1. Buttercream Rosettes with Candied Ruby Cherries & Stems
  const rosetteCount = 8;
  const rosetteRadius = 1.42;
  const rosetteBaseGeom = new THREE.SphereGeometry(0.24, 12, 8);
  rosetteBaseGeom.scale(1, 0.55, 1);
  const rosetteTipGeom = new THREE.ConeGeometry(0.18, 0.22, 10);
  const cherryGeom = new THREE.SphereGeometry(0.16, 16, 16);
  const stemGeom = new THREE.CylinderGeometry(0.016, 0.016, 0.24, 6);

  for (let i = 0; i < rosetteCount; i++) {
    const angle = (i / rosetteCount) * Math.PI * 2;
    const rx = Math.cos(angle) * rosetteRadius;
    const rz = Math.sin(angle) * rosetteRadius;

    const rBase = new THREE.Mesh(rosetteBaseGeom, milkChocoFrostingMat);
    rBase.position.set(rx, 2.82, rz);
    rBase.castShadow = true;
    cakeTiersGroup.add(rBase);

    const rTip = new THREE.Mesh(rosetteTipGeom, milkChocoFrostingMat);
    rTip.position.set(rx, 2.94, rz);
    cakeTiersGroup.add(rTip);

    const cherry = new THREE.Mesh(cherryGeom, cherryMat);
    cherry.position.set(rx, 3.06, rz);
    cherry.castShadow = true;
    cakeTiersGroup.add(cherry);

    const stem = new THREE.Mesh(stemGeom, cherryStemMat);
    stem.position.set(rx + 0.04, 3.2, rz);
    stem.rotation.z = -0.35 + Math.sin(i) * 0.2;
    stem.rotation.y = angle;
    cakeTiersGroup.add(stem);
  }

  // 2. Chocolate Curls on Top Glaze
  const curlGeom = new THREE.TorusGeometry(0.2, 0.045, 8, 20, Math.PI * 1.3);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.3;
    const cr = 0.7 + (i % 2) * 0.35;
    const curl = new THREE.Mesh(curlGeom, ganacheMirrorMat);
    curl.position.set(Math.cos(angle) * cr, 2.82, Math.sin(angle) * cr);
    curl.rotation.x = Math.PI / 2 + 0.2 * (i % 3);
    curl.rotation.y = angle * 1.5;
    curl.rotation.z = i * 0.8;
    curl.castShadow = true;
    cakeTiersGroup.add(curl);
  }

  // 3. Golden Dragées / Sprinkles on Top Glaze
  const sprinkleGeom = new THREE.SphereGeometry(0.045, 8, 8);
  for (let i = 0; i < 24; i++) {
    const sr = 0.3 + Math.random() * 1.3;
    const sAngle = Math.random() * Math.PI * 2;
    const sprinkle = new THREE.Mesh(sprinkleGeom, goldMat);
    sprinkle.position.set(Math.cos(sAngle) * sr, 2.8, Math.sin(sAngle) * sr);
    sprinkle.castShadow = true;
    cakeTiersGroup.add(sprinkle);
  }

  // 4. Birthday Candles & Animated Glowing Flames
  const candlesGroup = new THREE.Group();
  cakeTiersGroup.add(candlesGroup);

  const candleConfigs = [
    { x: 0, z: 0.1, h: 1.25 },
    { x: -0.52, z: -0.15, h: 1.1 },
    { x: 0.52, z: -0.15, h: 1.1 }
  ];

  const flameMeshes = [];

  candleConfigs.forEach((cfg, idx) => {
    // Candle body
    const cMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, cfg.h, 16),
      candleMat
    );
    cMesh.position.set(cfg.x, 2.76 + cfg.h / 2, cfg.z);
    cMesh.castShadow = true;
    candlesGroup.add(cMesh);

    // Candle gold spiral stripes
    const spiralGeom = new THREE.TorusGeometry(0.068, 0.015, 8, 16);
    for (let s = 1; s <= 3; s++) {
      const ring = new THREE.Mesh(spiralGeom, goldMat);
      ring.rotation.x = Math.PI / 2 + 0.2;
      ring.position.set(cfg.x, 2.76 + (cfg.h / 4) * s, cfg.z);
      candlesGroup.add(ring);
    }

    // Wick
    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6),
      new THREE.MeshBasicMaterial({ color: 0x1a1a1a })
    );
    wick.position.set(cfg.x, 2.76 + cfg.h + 0.06, cfg.z);
    candlesGroup.add(wick);

    // Outer flame cone
    const fGeom = new THREE.ConeGeometry(0.08, 0.28, 12);
    fGeom.translate(0, 0.14, 0);
    const flameOuter = new THREE.Mesh(fGeom, flameMat);
    flameOuter.position.set(cfg.x, 2.76 + cfg.h + 0.08, cfg.z);
    candlesGroup.add(flameOuter);

    // Inner bright core
    const fcGeom = new THREE.ConeGeometry(0.04, 0.16, 10);
    fcGeom.translate(0, 0.08, 0);
    const flameCore = new THREE.Mesh(fcGeom, flameCoreMat);
    flameCore.position.set(cfg.x, 2.76 + cfg.h + 0.08, cfg.z);
    candlesGroup.add(flameCore);

    flameMeshes.push({
      outer: flameOuter,
      core: flameCore,
      phase: idx * 1.5
    });
  });

  // 5. Golden Celebration Star Topper Pick
  const topperGroup = new THREE.Group();
  candlesGroup.add(topperGroup);

  const postGeom = new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6);
  const post1 = new THREE.Mesh(postGeom, goldMat);
  post1.position.set(-0.25, 3.4, -0.45);
  topperGroup.add(post1);

  const post2 = new THREE.Mesh(postGeom, goldMat);
  post2.position.set(0.25, 3.4, -0.45);
  topperGroup.add(post2);

  const starGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.06, 6);
  const starMesh = new THREE.Mesh(starGeom, goldMat);
  starMesh.rotation.x = Math.PI / 2;
  starMesh.position.set(0, 4.05, -0.45);
  starMesh.castShadow = true;
  topperGroup.add(starMesh);

  const crownGeom = new THREE.ConeGeometry(0.22, 0.28, 5);
  const crownMesh = new THREE.Mesh(crownGeom, goldMat);
  crownMesh.position.set(0, 4.05, -0.42);
  topperGroup.add(crownMesh);

  // 11. Subtle Floating Chocolate Pieces & Decorations
  const floatingGroup = new THREE.Group();
  scene.add(floatingGroup);

  const floatingElements = [];

  // A. Floating Chocolate Chunks / Shards (8 pieces)
  const chunkGeoms = [
    new THREE.BoxGeometry(0.46, 0.28, 0.36),
    new THREE.BoxGeometry(0.38, 0.22, 0.42),
    new THREE.DodecahedronGeometry(0.25),
    new THREE.OctahedronGeometry(0.28)
  ];

  const chunkRadii = [4.1, 4.6, 4.9, 4.3, 4.8, 5.2, 4.0, 4.7];
  const chunkHeights = [-0.6, 0.2, 1.4, 2.2, 2.9, 1.0, -0.2, 2.6];

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + 0.4;
    const r = chunkRadii[i];
    const geom = chunkGeoms[i % chunkGeoms.length];
    const mat = i % 2 === 0 ? darkChocolateMat : ganacheMirrorMat;

    const chunk = new THREE.Mesh(geom, mat);
    const px = Math.cos(angle) * r;
    const py = chunkHeights[i];
    const pz = Math.sin(angle) * r;
    chunk.position.set(px, py, pz);
    chunk.castShadow = true;
    floatingGroup.add(chunk);

    floatingElements.push({
      mesh: chunk,
      baseX: px,
      baseY: py,
      baseZ: pz,
      radius: r,
      angle: angle,
      orbitSpeed: 0.003 * (i % 2 === 0 ? 1 : -0.8),
      floatSpeed: 1.2 + (i % 3) * 0.4,
      floatAmp: 0.15 + (i % 2) * 0.08,
      phase: i * 0.8,
      rotSpeedX: 0.012 * ((i % 3) - 1 || 1),
      rotSpeedY: 0.016 * (((i + 1) % 3) - 1 || -1),
      rotSpeedZ: 0.008
    });
  }

  // B. Floating Chocolate Ribbon Shavings / Curls (6 pieces)
  const floatCurlGeom = new THREE.TorusGeometry(0.3, 0.06, 8, 20, Math.PI * 1.35);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 1.2;
    const r = 4.4 + (i % 3) * 0.5;
    const curl = new THREE.Mesh(floatCurlGeom, darkChocolateMat);
    const py = -0.4 + i * 0.55;
    const px = Math.cos(angle) * r;
    const pz = Math.sin(angle) * r;
    curl.position.set(px, py, pz);
    curl.castShadow = true;
    floatingGroup.add(curl);

    floatingElements.push({
      mesh: curl,
      baseX: px,
      baseY: py,
      baseZ: pz,
      radius: r,
      angle: angle,
      orbitSpeed: 0.0025 * (i % 2 === 0 ? 0.9 : -0.7),
      floatSpeed: 1.0 + (i % 2) * 0.5,
      floatAmp: 0.18,
      phase: i * 1.1,
      rotSpeedX: 0.014,
      rotSpeedY: 0.01,
      rotSpeedZ: 0.012
    });
  }

  // C. Floating Golden Confectionery Pearls / Dragées (12 pieces)
  const floatPearlGeom = new THREE.SphereGeometry(0.12, 14, 14);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2 + 0.2;
    const r = 4.2 + (i % 4) * 0.45;
    const pearl = new THREE.Mesh(floatPearlGeom, goldMat);
    const py = -0.8 + (i / 12) * 4.2;
    const px = Math.cos(angle) * r;
    const pz = Math.sin(angle) * r;
    pearl.position.set(px, py, pz);
    floatingGroup.add(pearl);

    floatingElements.push({
      mesh: pearl,
      baseX: px,
      baseY: py,
      baseZ: pz,
      radius: r,
      angle: angle,
      orbitSpeed: 0.0035 * (i % 2 === 0 ? 1.1 : -1.0),
      floatSpeed: 1.5 + (i % 3) * 0.3,
      floatAmp: 0.12,
      phase: i * 0.7,
      rotSpeedX: 0.02,
      rotSpeedY: 0.025,
      rotSpeedZ: 0.01
    });
  }

  // D. Floating Golden Sparkles (24 subtle particles)
  const sparkleCount = 24;
  const sparkleGeom = new THREE.BufferGeometry();
  const sparklePos = new Float32Array(sparkleCount * 3);
  const sparkleData = [];

  for (let i = 0; i < sparkleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 3.5 + Math.random() * 2.8;
    const y = -1.5 + Math.random() * 5.0;
    sparklePos[i * 3] = Math.cos(angle) * r;
    sparklePos[i * 3 + 1] = y;
    sparklePos[i * 3 + 2] = Math.sin(angle) * r;

    sparkleData.push({
      radius: r,
      angle: angle,
      y: y,
      speed: 0.002 + Math.random() * 0.003,
      yVel: 0.004 + Math.random() * 0.006
    });
  }

  sparkleGeom.setAttribute("position", new THREE.BufferAttribute(sparklePos, 3));
  const sparkleMat = new THREE.PointsMaterial({
    color: 0xffde7a,
    size: 0.16,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  const sparkles = new THREE.Points(sparkleGeom, sparkleMat);
  floatingGroup.add(sparkles);

  // 12. Interactive Mouse & Touch Drag Controls with Damping
  let isDragging = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let rotationVelocityX = 0;
  let rotationVelocityY = 0;

  let mouseNormX = 0;
  let mouseNormY = 0;

  const AUTO_ROTATE_SPEED = 0.006;

  // Reduced motion detection
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let prefersReducedMotion = motionQuery.matches;

  motionQuery.addEventListener("change", (e) => {
    prefersReducedMotion = e.matches;
  });

  // Pointer event listeners on canvas
  canvas.addEventListener("pointerdown", (e) => {
    isDragging = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    rotationVelocityX = 0;
    rotationVelocityY = 0;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {}

    // Fade out interactive hint pill on user action
    if (hintPill) {
      hintPill.classList.add("fade-out");
    }
  });

  canvas.addEventListener("pointermove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseNormX = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    mouseNormY = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);

    if (isDragging) {
      const deltaX = e.clientX - prevPointerX;
      const deltaY = e.clientY - prevPointerY;

      cakeGroup.rotation.y += deltaX * 0.009;
      cakeGroup.rotation.x += deltaY * 0.006;

      // Restrict vertical tilt to keep cake upright and photogenic
      cakeGroup.rotation.x = Math.max(-0.15, Math.min(0.38, cakeGroup.rotation.x));

      rotationVelocityY = deltaX * 0.009;
      rotationVelocityX = deltaY * 0.006;

      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    }
  });

  function stopDragging(e) {
    if (isDragging) {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);
  canvas.addEventListener("pointerleave", () => {
    if (!isDragging) {
      mouseNormX = 0;
      mouseNormY = 0;
    }
  });

  // 13. Responsive Resize Handler (ResizeObserver)
  function handleResize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  const resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  resizeObserver.observe(container);
  handleResize();

  // 14. Performance Optimization: IntersectionObserver (pause rendering when scrolled away)
  let isVisible = true;
  let animId = null;
  const clock = new THREE.Clock();

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          clock.start();
          animate();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    },
    { threshold: 0.05 }
  );
  intersectionObserver.observe(container);

  // 15. Animation Render Loop
  function animate() {
    if (!isVisible) return;
    animId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (prefersReducedMotion) {
      // Reduced motion: static elegant 3D presentation without spinning or bobbing
      cakeGroup.rotation.y = 0.45;
      cakeGroup.rotation.x = 0.1;
      cakeGroup.position.y = 0;
      renderer.render(scene, camera);
      return;
    }

    // A. Smooth Gentle Rotation & Inertia
    if (!isDragging) {
      rotationVelocityY *= 0.94;
      rotationVelocityX *= 0.94;

      cakeGroup.rotation.y += rotationVelocityY + AUTO_ROTATE_SPEED;
      cakeGroup.rotation.x += rotationVelocityX;

      // Smoothly spring vertical tilt back towards default pleasant viewing angle
      cakeGroup.rotation.x += (0.08 - cakeGroup.rotation.x) * 0.025;
    }

    // B. Subtle Floating Bob
    cakeGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.07;

    // C. Dynamic Candle Flame Flicker & Point Light Glow
    const flicker = Math.sin(elapsedTime * 18) * 0.12 + Math.cos(elapsedTime * 32) * 0.08;
    candleLight.intensity = 1.35 + flicker;
    candleLight.position.x = Math.sin(elapsedTime * 8) * 0.05;

    flameMeshes.forEach((flame) => {
      const fScaleY = 1.0 + Math.sin(elapsedTime * 16 + flame.phase) * 0.18;
      const fScaleXZ = 1.0 + Math.cos(elapsedTime * 14 + flame.phase) * 0.12;
      flame.outer.scale.set(fScaleXZ, fScaleY, fScaleXZ);
      flame.core.scale.set(fScaleXZ, fScaleY, fScaleXZ);
    });

    // D. Subtle Floating Chocolate Pieces & Decorations
    floatingElements.forEach((item) => {
      item.angle += item.orbitSpeed;
      item.mesh.position.x = Math.cos(item.angle) * item.radius;
      item.mesh.position.z = Math.sin(item.angle) * item.radius;
      item.mesh.position.y =
        item.baseY + Math.sin(elapsedTime * item.floatSpeed + item.phase) * item.floatAmp;

      item.mesh.rotation.x += item.rotSpeedX;
      item.mesh.rotation.y += item.rotSpeedY;
      item.mesh.rotation.z += item.rotSpeedZ;
    });

    // E. Golden Sparkles Drift
    const posArr = sparkleGeom.attributes.position.array;
    for (let i = 0; i < sparkleCount; i++) {
      const s = sparkleData[i];
      s.angle += s.speed;
      s.y += s.yVel * 0.3;
      if (s.y > 4.2) s.y = -1.2;

      posArr[i * 3] = Math.cos(s.angle) * s.radius;
      posArr[i * 3 + 1] = s.y;
      posArr[i * 3 + 2] = Math.sin(s.angle) * s.radius;
    }
    sparkleGeom.attributes.position.needsUpdate = true;

    // F. Gentle Mouse Hover Parallax
    const targetCamX = mouseNormX * 0.55;
    const targetCamY = 2.7 + mouseNormY * 0.35;
    camera.position.x += (targetCamX - camera.position.x) * 0.05;
    camera.position.y += (targetCamY - camera.position.y) * 0.05;
    camera.lookAt(0, 0.6, 0);

    renderer.render(scene, camera);
  }

  // Hide fallback image once WebGL is active
  if (fallbackImg) {
    fallbackImg.style.display = "none";
  }
  canvas.style.display = "block";

  // Start rendering
  clock.start();
  animate();
}
