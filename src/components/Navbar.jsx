// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const savedFavorites = localStorage.getItem('lol-favorites');
      setFavCount(savedFavorites ? JSON.parse(savedFavorites).length : 0);
    };
    updateCount();
    window.addEventListener('favoritesChanged', updateCount);
    return () => window.removeEventListener('favoritesChanged', updateCount);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return (
    <nav style={{
      backgroundColor: '#010a13', 
      padding: '25px 5%',
      borderBottom: '2px solid #d4af37',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
  
      <Link 
        to="/" 
        onClick={scrollToTop} 
        style={{ textDecoration: 'none' }}
      >
        <h2 style={{ color: '#d4af37', margin: 0, fontSize: '24px', cursor: 'pointer' }}>
          LoL Shop
        </h2>
      </Link>

      <ul style={{ listStyle: 'none', display: 'flex', gap: '30px', margin: 0, padding: 0 }}>
        <li>
          <Link to="/" onClick={scrollToTop} style={{ color: 'white', textDecoration: 'none' }}>
            🛒 Boutique
          </Link>
        </li>
        <li>
          <Link to="/favorites" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⭐ Favoris {favCount > 0 && (
              <span style={{ backgroundColor: '#e74c3c', borderRadius: '50%', padding: '2px 8px', fontSize: '12px' }}>
                {favCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;