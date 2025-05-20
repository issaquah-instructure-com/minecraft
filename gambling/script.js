fetch('cases.json')
  .then(res => res.json())
  .then(data => {
    const allCases = data.cases;

    for (const key in allCases) {
      const caseData = allCases[key];
      const div = document.createElement("div");
      div.className = "case-card";
      div.innerHTML = `<h3>${caseData.name}</h3><p>Price: ${caseData.price}</p>`;
      div.onclick = () => openCaseWithScroll(caseData);
      casesView.appendChild(div);
    }
  });

function getItemDetails(name) {
  // Basic rarity assignment
  const rarityMap = {
    "nether-star": "legendary",
    "diamond": "epic",
    "emerald": "epic",
    "gold": "rare",
    "golden-apple": "legendary",
    "golden-carrot": "epic",
    "glistering-melon": "epic",
    "cake": "epic",
    "cookie": "rare",
    "pumpkin-pie": "rare",
    "poisonous-potato": "rare"
  };

  return {
    name: name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    image: `images/${name}.png`,
    rarity: rarityMap[name] || "common"
  };
}

function openCaseWithScroll(caseData) {
  if (coins < caseData.price) {
    alert("You broke, sorry 😭");
    return;
  }

  coins -= caseData.price;
  updateCoins();

  const scrollContainer = document.createElement("div");
  scrollContainer.className = "scroll-animation";
  scrollContainer.innerHTML = "<h2>Opening...</h2>";

  const itemStrip = document.createElement("div");
  itemStrip.className = "item-strip";

  for (let i = 0; i < 30; i++) {
    const rawName = caseData.items[Math.floor(Math.random() * caseData.items.length)];
    const item = getItemDetails(rawName);

    const div = document.createElement("div");
    div.className = "scroll-item";
    div.innerHTML = `<img src="${item.image}" alt="${item.name}"><p>${item.name}</p>`;
    itemStrip.appendChild(div);
  }

  scrollContainer.appendChild(itemStrip);
  casesView.innerHTML = "";
  casesView.appendChild(scrollContainer);

  // Scroll animation logic
  let scrollPos = 0;
  const totalScroll = itemStrip.scrollWidth - itemStrip.clientWidth;
  const scrollSpeed = 35;
  const scrollInterval = setInterval(() => {
    scrollPos += scrollSpeed;
    itemStrip.scrollLeft = scrollPos;
    if (scrollPos >= totalScroll) {
      clearInterval(scrollInterval);
      const winRaw = caseData.items[Math.floor(Math.random() * caseData.items.length)];
      const winningItem = getItemDetails(winRaw);
      alert(`🎉 You got a ${winningItem.name}! (${winningItem.rarity})`);
      addToInventory(winningItem);
      updateCoins();
      document.getElementById("inventoryBtn").click();
    }
  }, 50);
}
