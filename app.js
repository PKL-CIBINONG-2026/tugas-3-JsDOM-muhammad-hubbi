// ==========================================
// 1. INITIAL DATA & PHASE 1 PURE FUNCTIONS
// ==========================================
const initialCharacter = {
  name: "Aether",
  level: 12,
  baseStats: { hp: 200, atk: 35, def: 20, spd: 15 },
  equipped: {
    weapon: {
      id: "wpn-01",
      name: "Iron Broadsword",
      slot: "weapon",
      rarity: "common",
      statBonus: { atk: 12, spd: -2 },
    },
    armor: {
      id: "arm-01",
      name: "Leather Tunic",
      slot: "armor",
      rarity: "common",
      statBonus: { hp: 30, def: 8, spd: 2 },
    },
    accessory: null,
  },
  inventory: [
    {
      id: "wpn-02",
      name: "Flamebrand Katana",
      slot: "weapon",
      rarity: "rare",
      qty: 1,
      statBonus: { atk: 28, spd: 5 },
    },
    {
      id: "acc-01",
      name: "Ring of Vitality",
      slot: "accessory",
      rarity: "uncommon",
      qty: 2,
      statBonus: { hp: 50, def: 3 },
    },
    {
      id: "arm-02",
      name: "Mithril Chainmail",
      slot: "armor",
      rarity: "epic",
      qty: 1,
      statBonus: { hp: 80, def: 25, spd: -1 },
    },
    {
      id: "pot-01",
      name: "Elixir of Strength",
      slot: "consumable",
      rarity: "rare",
      qty: 3,
      statBonus: { atk: 5 },
    },
  ],
};

// TODO: Tempelkan 6 fungsi pure dari Tahap 1 di sini
// (getTotalStats, equipItem, unequipItem, useConsumable, getInventorySummary, findBestUpgrade)
function getTotalStats(char) {
  // TODO: Implementasi Misi 1

  const baseStats = Object.entries(char.baseStats);
  // console.log("Base stats:", baseStats);

  const statBonus = Object.values(char.equipped)
    .filter((item) => item != null)
    .map((item) => item.statBonus);
  // console.log("Equipped stat bonuses:", statBonus);

  // console.log(statBonus);

  const total = Object.fromEntries(
    baseStats.map(([key, value]) => {
      const bonus = statBonus.reduce((total, val) => {
        return total + (val[key] ?? 0);
      }, 0);

      return [key, value + bonus];
    }),
  );
  // console.log("Total stats:", total);

  // console.log(total);

  return total;
}

function equipItem(char, itemId) {
  const item = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === itemId;
  });

  if (item === undefined || item.slot === "consumable") {
    return char;
  }

  const remainingItems = char.inventory.filter(
    (inventoryItem) => inventoryItem.id !== itemId,
  );
  // console.log("Inventory after removing item:", remainingItems);
  if (item.qty > 1) {
    remainingItems.push({ ...item, qty: item.qty - 1 });
  }

  // console.log(remainingItems);

  const oldEquippedItem = char.equipped[item.slot];
  // console.log("Previously equipped item:", oldEquippedItem);
  // console.log(oldEquippedItem);
  //

  const inventoryWithOldItem = [...remainingItems];
  // console.log("Inventory before returning old item:", inventoryWithOldItem);
  if (oldEquippedItem) {
    inventoryWithOldItem.push({
      ...oldEquippedItem,
      qty: oldEquippedItem.qty ?? 1,
    });
  }
  // console.log(inventoryWithOldItem));

  const newChar = {
    ...char,
    inventory: inventoryWithOldItem,
    equipped: {
      ...char.equipped,
      [item.slot]: { ...item, qty: 1 },
    },
  };
  // console.log("Character after equipping:", newChar);

  return newChar;
}

function unequipItem(char, slotName) {
  const item = char.equipped[slotName];

  if (item === null || item === undefined) {
    return char;
  }

  const existingItem = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === item.id;
  });

  let newInventory;

  if (existingItem !== undefined) {
    newInventory = char.inventory.map((inventoryItem) => {
      if (inventoryItem.id === item.id) {
        return { ...inventoryItem, qty: (inventoryItem.qty ?? 1) + 1 };
      }

      return inventoryItem;
    });
  } else {
    newInventory = [...char.inventory, { ...item, qty: item.qty ?? 1 }];
  }

  const newChar = {
    ...char,
    inventory: newInventory,
    equipped: { ...char.equipped, [slotName]: null },
  };
  // console.log("Character after unequipping:", newChar);

  return newChar;
}

function useConsumable(char, itemId) {
  const item = char.inventory.find((inventoryItem) => {
    return inventoryItem.id === itemId && inventoryItem.slot === "consumable";
  });
  // console.log("Consumable to use:", item);

  if (item === undefined) {
    return char;
  }

  const baseStats = Object.entries(char.baseStats);
  // console.log("Base stats before consumable:", baseStats);
  const updatedStats = baseStats.map(([statName, currentValue]) => {
    const bonus = item.statBonus[statName] ?? 0;
    return [statName, currentValue + bonus];
  });
  const newBaseStats = Object.fromEntries(updatedStats);
  console.log("Base stats after consumable:", newBaseStats);

  const inventoryWithoutItem = char.inventory.filter((inventoryItem) => {
    return inventoryItem.id !== itemId;
  });
  console.log("Inventory without used consumable:", inventoryWithoutItem);
  let newInventory = inventoryWithoutItem;
  if (item.qty > 1) {
    newInventory = [...inventoryWithoutItem, { ...item, qty: item.qty - 1 }];
  }

  const newChar = {
    ...char,
    baseStats: newBaseStats,
    inventory: newInventory,
  };
  console.log("Character after using consumable:", newChar);

  return newChar;
}

function getInventorySummary(char) {
  // console.log("Inventory for summary:", char.inventory);
  const summary = char.inventory.reduce((currentSummary, item) => {
    const raritySummary = currentSummary[item.rarity] ?? {
      totalQty: 0,
      items: [],
    };

    let updatedItems = raritySummary.items;
    if (!raritySummary.items.includes(item.name)) {
      updatedItems = [...raritySummary.items, item.name];
    }

    const updatedRaritySummary = {
      totalQty: raritySummary.totalQty + (item.qty ?? 1),
      items: updatedItems,
    };
    // console.log("Updated rarity summary:", updatedRaritySummary);

    return {
      ...currentSummary,
      [item.rarity]: updatedRaritySummary,
    };
  }, {});
  // console.log("Final inventory summary:", summary);

  return summary;
}

function findBestUpgrade(char, slotName) {
  const current = char.equipped[slotName];
  // console.log("Currently equipped item:", current);
  const candidates = char.inventory
    .filter((item) => item.slot === slotName)
    .map((item) => {
      const statBonuses = Object.entries(item.statBonus);
      const scoreGain = statBonuses.reduce(
        (totalGain, [statName, itemBonus]) => {
          const currentBonus = current?.statBonus[statName] ?? 0;
          return totalGain + itemBonus - currentBonus;
        },
        0,
      );

      return {
        itemName: item.name,
        scoreGain,
      };
    })
    .filter((candidate) => candidate.scoreGain > 0);
  // console.log("Upgrade candidates:", candidates);

  // console.log(candidates)

  const bestUpgrade = candidates.reduce((best, candidate) => {
    if (best === null || candidate.scoreGain > best.scoreGain) {
      return candidate;
    }

    return best;
  }, null);
  // console.log("Best upgrade:", bestUpgrade);
  // console.log(bestUpgrade)

  return bestUpgrade;
}

// ==========================================
// 2. APPLICATION STATE & DOM RENDER ENGINE
// ==========================================
let appState = {
  character: structuredClone(initialCharacter),
  activeRarity: "all",
  logs: ["Karakter siap bertualang."],
};

// TODO: Implementasikan fungsi render() & event delegation di bawah ini

const render = () => {
  // render nama dan level
  const { character, activeRarity, logs } = appState;
  document.getElementById("char-header").innerHTML =
    `${character.name} — ${character.level}`;

  // render stat
  document.getElementById("stats-container").innerHTML = Object.entries(
    getTotalStats(character),
  )
    .map(
      ([key, value]) => `
        <div class="stat-box">
            <div class="stat-label">${key}</div>
            <div class="stat-value">${value}</div>
        </div>
        `,
    )
    .join("");

  // render equipment slot
  document.getElementById("equipped-container").innerHTML = Object.entries(
    character.equipped,
  )
    .map(([category, item]) => {
      let statBonus = ``;
      if (item) {
        statBonus = Object.entries(item.statBonus)
          .map(([key, value]) => `${key} ${value}+<br>`)
          .join("");
      }

      return `
      <div class="slot-item">
            <div>
                <div class="slot-title">${category}</div>
                ${
                  item
                    ? `
                    <div>${item.name}</div>
                    <div class="bonus-text">${statBonus.toUpperCase()}</div>
                    `
                    : `<span class="empty-text">Empty Slot</span>`
                }
            </div>
            ${
              item
                ? `<button class="action-btn btn-unequip" data-action="unequip" data-slot="${category}">Unequip</button>`
                : ""
            }
        </div>
        `;
    })
    .join("");

  const summary = getInventorySummary(character);
  const totalQty = Object.values(summary).reduce(
    (total, value) => total + value.totalQty,
    0,
  );
  const filters = ["all", "common", "uncommon", "rare", "epic"];

  //render filter
  document.getElementById("filter-container").innerHTML = filters
    .map((rarity) => {
      const count =
        rarity === "all"
          ? totalQty
          : (summary[rarity.toLowerCase()]?.totalQty ?? 0);
      return `
      <button 
        class="tab-btn${activeRarity === rarity ? " active" : ""}" 
        data-action="filter" 
        data-rarity="${rarity}"
      >
        ${rarity[0].toUpperCase()}${rarity.slice(1)} (${count})
      </button>`;
    })
    .join("");

  const bestBySlot = Object.fromEntries(
    Object.keys(character.equipped).map((slot) => [
      slot,
      findBestUpgrade(character, slot),
    ]),
  );
  const bestUpgrade = Object.values(bestBySlot)
    .filter(Boolean)
    .reduce((best, candidate) =>
      best === null || candidate.scoreGain > best.scoreGain ? candidate : best,
    null);

  const selectedItems = character.inventory.filter((item) => {
    return activeRarity === "all" || item.rarity === activeRarity;
  });
  // console.log(selectedItems);

  //render inventory
  document.getElementById("inventory-container").innerHTML =
    selectedItems.length > 0
      ? selectedItems
          .map((item) => {
            const statBonus = Object.entries(item.statBonus)
              .map(([key, value]) => `${key} ${value}+<br>`)
              .join("");

            const isConsumable = item.slot === "consumable";
            const badge = !isConsumable && bestUpgrade?.itemName === item.name
              ? `<span class="badge badge-upgrade">▲ Best Upgrade (+${bestUpgrade.scoreGain})</span>`
              : "";
            // console.log(badge);
            // console.log(item.slot);
            return `
              <div class="inv-item">
                <div>
                  <p>${item.name}</p>
                  <span class="badge badge-rarity">${item.rarity}</span>
                  ${badge}
                  <div class="bonus-text">Qty: ${item.qty ?? 1}<br>${statBonus}</div>
                </div>
                <button class="action-btn ${isConsumable ? "btn-use" : "btn-equip"}" data-id="${item.id}" data-action="${isConsumable ? "consume" : "equip"}">${isConsumable ? "Use" : "Equip"}</button>
              </div>
              `;
          })
          .join("")
      : "No item in this category";

  //render log
  document.getElementById("log-container").innerHTML = logs
    .map((value) => `<li>${value}</li>`)
    .join("  ");
};

const saveLog = (message) => {
  if (appState.logs.length > 4) {
    appState.logs.splice(4);
  }
  const logs = [message, ...appState.logs];
  appState = { ...appState, logs: logs };
};

document.querySelector("#app").addEventListener("click", function (event) {
  const self = event.target;
  const action = self.getAttribute("data-action");

  if (!self || !action) return;

  switch (action) {
    case "filter":
      const current = self.getAttribute("data-rarity");
      console.log(current);
      appState = { ...appState, activeRarity: current };
      saveLog(`Change filter to ${current}`);
      render();
      return;
    case "equip":
      const itemId = self.getAttribute("data-id");
      const itemEquip = appState.character.inventory.find(
        (item) => item.id === itemId,
      );
      appState = {
        ...appState,
        character: equipItem(appState.character, itemId),
      };
      saveLog(`Equip item: ${itemEquip.name}`);
      render();
      return;
    case "unequip":
      const slot = self.getAttribute("data-slot");
      const itemUnequip = appState.character.equipped[slot];
      appState = {
        ...appState,
        character: unequipItem(appState.character, slot),
      };
      saveLog(`Unequip item: ${itemUnequip.name}`);
      render();
      return;
    case "consume":
      const consumableId = self.getAttribute("data-id");
      const itemConsume = appState.character.inventory.find(
        (item) => item.id === consumableId,
      );
      appState = {
        ...appState,
        character: useConsumable(appState.character, consumableId),
      };
      saveLog(`Consume item: ${itemConsume.name}`);
      render();
      return;
    case "reset":
      appState = {
        character: structuredClone(initialCharacter),
        activeRarity: "all",
        logs: ["Karakter siap bertualang."],
      };
      render();
      return;
  }
});
render();
