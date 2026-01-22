import { useEffect, useState } from 'react';
import { getAllItems } from '../services/api';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('lol-favorites')) || []);

  useEffect(() => {
    getAllItems().then(data => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleToggleFav = (item, e) => {
    e.preventDefault();
    const isAlreadyFav = favorites.find(f => f.id === item.id);
    const updated = isAlreadyFav 
      ? favorites.filter(f => f.id !== item.id) 
      : [...favorites, item];
    
    setFavorites(updated);
    localStorage.setItem('lol-favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="container"><h2>Chargement...</h2></div>;

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', color: 'var(--gold)' }}>Boutique League Of Legends</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Rechercher un objet..." 
          className="search-bar"
          style={{ padding: '10px', width: '300px', borderRadius: '20px', border: '1px solid var(--gold)', background: '#1a1a1a', color: 'white' }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="shop-grid">
        {filteredItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            isFav={favorites.some(f => f.id === item.id)}
            onToggleFav={handleToggleFav}
          />
        ))}
      </div>
    </div>
  );
}