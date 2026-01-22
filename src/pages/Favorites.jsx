import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  // Récupère les favoris depuis localStorage au chargement
  useEffect(() => {
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('lol-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };

    loadFavorites();

    // Écouter les changements
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => window.removeEventListener('favoritesChanged', loadFavorites);
  }, []);

  // Supprimer un favori
  const removeFavorite = (itemId) => {
    const updated = favorites.filter(item => item.id !== itemId);
    setFavorites(updated);
    localStorage.setItem('lol-favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  // Vider tous les favoris
  const clearAll = () => {
    setFavorites([]);
    localStorage.removeItem('lol-favorites');
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '20px' 
    }}>
      <h1>⭐ Mes Favoris</h1>
      
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '18px', color: '#888' }}>
            Aucun item favori pour le moment
          </p>
          <Link to="/" style={{ 
            color: '#d4af37', 
            textDecoration: 'none',
            fontSize: '16px' 
          }}>
            → Retour à la boutique
          </Link>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#888', fontSize: '18px' }}>
              {favorites.length} item{favorites.length > 1 ? 's' : ''} dans vos favoris
            </p>
            <button 
              onClick={clearAll}
              style={{
                backgroundColor: '#c0392b',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Vider tous les favoris
            </button>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '15px' 
          }}>
            {favorites.map(item => (
              <div 
                key={item.id} 
                style={{ 
                  border: '1px solid #444', 
                  padding: '15px', 
                  textAlign: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Link to={`/item/${item.id}`} style={{ textDecoration: 'none' }}>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    style={{ width: '64px', borderRadius: '4px' }} 
                  />
                  <p style={{ fontSize: '14px', marginTop: '8px', color: 'white' }}>
                    {item.name}
                  </p>
                  <p style={{ color: '#d4af37', marginBottom: '10px' }}>
                    {item.gold?.total || 0} G
                  </p>
                </Link>
                <button
                  onClick={() => removeFavorite(item.id)}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    width: '100%'
                  }}
                >
                  ❌ Retirer
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;