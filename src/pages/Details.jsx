import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemById } from '../services/api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Charger l'item depuis l'API
  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  // Vérifier si l'item est déjà en favori
  useEffect(() => {
    if (item) {
      const savedFavorites = localStorage.getItem('lol-favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.some(fav => fav.id === item.id));
      }
    }
  }, [item]);

  // Toggle favori
  const toggleFavorite = () => {
    const savedFavorites = localStorage.getItem('lol-favorites');
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

    if (isFavorite) {
      // Retirer des favoris
      favorites = favorites.filter(fav => fav.id !== item.id);
      setIsFavorite(false);
    } else {
      // Ajouter aux favoris
      favorites.push(item);
      setIsFavorite(true);
    }

    localStorage.setItem('lol-favorites', JSON.stringify(favorites));
    
    // Déclencher un événement pour mettre à jour la navbar
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: 'white', 
        minHeight: '100vh', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2>Chargement de l'item...</h2>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div style={{ 
        backgroundColor: '#121212', 
        color: 'white', 
        minHeight: '100vh', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e74c3c' }}>❌ Erreur : {error}</h2>
        <button
          onClick={() => navigate('/')}
          style={{
            backgroundColor: '#d4af37',
            color: '#0a0a0a',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px'
          }}
        >
          ← Retour à la boutique
        </button>
      </div>
    );
  }

  // Formater les stats
  const formatStatName = (statKey) => {
    const statNames = {
      FlatHPPoolMod: 'Points de vie',
      FlatMPPoolMod: 'Mana',
      FlatArmorMod: 'Armure',
      FlatSpellBlockMod: 'Résistance magique',
      FlatPhysicalDamageMod: 'Dégâts d\'attaque',
      FlatMovementSpeedMod: 'Vitesse de déplacement',
      PercentAttackSpeedMod: 'Vitesse d\'attaque',
      FlatCritChanceMod: 'Chances de coup critique',
      PercentLifeStealMod: 'Vol de vie'
    };
    return statNames[statKey] || statKey;
  };

  return (
    <div style={{ 
      backgroundColor: '#121212', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '40px 20px' 
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        padding: '30px',
        border: '2px solid #d4af37'
      }}>
        {/* Bouton retour */}
        <Link 
          to="/" 
          style={{
            color: '#d4af37',
            textDecoration: 'none',
            fontSize: '16px',
            display: 'inline-block',
            marginBottom: '20px'
          }}
        >
          ← Retour à la boutique
        </Link>

        {/* En-tête avec image et infos principales */}
        <div style={{ 
          display: 'flex', 
          gap: '30px', 
          alignItems: 'flex-start',
          marginBottom: '30px'
        }}>
          <img 
            src={item.image} 
            alt={item.name}
            style={{ 
              width: '128px', 
              height: '128px',
              borderRadius: '8px',
              border: '3px solid #d4af37'
            }}
          />
          
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              margin: '0 0 10px 0',
              color: '#d4af37',
              fontSize: '32px'
            }}>
              {item.name}
            </h1>
            
            {item.plaintext && (
              <p style={{ 
                color: '#888',
                fontSize: '16px',
                marginBottom: '15px'
              }}>
                {item.plaintext}
              </p>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div>
                <p style={{ color: '#888', margin: 0 }}>Prix total</p>
                <p style={{ 
                  color: '#d4af37', 
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '5px 0 0 0'
                }}>
                  {item.gold?.total || 0} G
                </p>
              </div>
              
              {item.gold?.sell > 0 && (
                <div>
                  <p style={{ color: '#888', margin: 0 }}>Prix de vente</p>
                  <p style={{ 
                    color: '#888', 
                    fontSize: '18px',
                    margin: '5px 0 0 0'
                  }}>
                    {item.gold.sell} G
                  </p>
                </div>
              )}
            </div>

            {/* Bouton favori */}
            <button
              onClick={toggleFavorite}
              style={{
                backgroundColor: isFavorite ? '#e74c3c' : '#27ae60',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              📜 Description
            </h3>
            <div 
              style={{ 
                backgroundColor: '#0a0a0a',
                padding: '15px',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        )}

        {/* Statistiques */}
        {item.stats && Object.keys(item.stats).length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              Statistiques
            </h3>
            <div style={{ 
              backgroundColor: '#0a0a0a',
              padding: '15px',
              borderRadius: '8px'
            }}>
              {Object.entries(item.stats).map(([key, value]) => (
                <div 
                  key={key}
                  style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #333'
                  }}
                >
                  <span style={{ color: '#aaa' }}>{formatStatName(key)}</span>
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                    +{value}{key.includes('Percent') ? '%' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div>
            <h3 style={{ color: '#d4af37', marginBottom: '10px' }}>
              Catégories
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {item.tags.map(tag => (
                <span 
                  key={tag}
                  style={{
                    backgroundColor: '#2c3e50',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemDetail;