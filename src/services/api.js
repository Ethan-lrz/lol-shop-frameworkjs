// src/services/api.js
let cachedVersion = null;
let cachedItems = null;

const getLatestVersion = async () => {
  if (cachedVersion) return cachedVersion;
  try {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await response.json();
    cachedVersion = versions[0];
    return cachedVersion;
  } catch (error) {
    console.error('Erreur version:', error);
    throw error;
  }
};

export const getAllItems = async () => {
  if (cachedItems) return cachedItems;

  try {
    const version = await getLatestVersion();
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/item.json`;
    const response = await fetch(url);
    const data = await response.json();

    const itemsArray = Object.entries(data.data).map(([id, item]) => ({
      id,
      name: item.name,
      description: item.description,
      gold: item.gold,
      stats: item.stats || {},
      tags: item.tags || [],
      maps: item.maps || {},
      image: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`,
      plaintext: item.plaintext || '',
      inStore: item.inStore !== false,
    }));

    // 1. Filtrage initial (Map 11 + Purchasable)
    const filteredRift = itemsArray.filter(item => 
      item.maps["11"] === true && 
      item.gold.purchasable === true && 
      item.gold.total > 0
    );

    // 2. SUPPRESSION DES DOUBLONS PAR NOM
    // On utilise le nom comme clé unique pour ne garder qu'une version de l'item
    const uniqueByName = Array.from(
      new Map(filteredRift.map(item => [item.name, item])).values()
    );

    // Tri par nom
    uniqueByName.sort((a, b) => a.name.localeCompare(b.name));

    cachedItems = uniqueByName;
    return uniqueByName;
  } catch (error) {
    console.error('Erreur items:', error);
    throw new Error('Erreur de chargement');
  }
};

export const getItemById = async (itemId) => {
  const allItems = await getAllItems();
  return allItems.find(i => i.id === itemId);
};