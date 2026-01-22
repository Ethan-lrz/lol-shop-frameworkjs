import { Link } from 'react-router-dom';

export default function ItemCard({ item, isFav, onToggleFav }) {
  return (
    <div className="item-card">
      <button 
        onClick={(e) => onToggleFav(item, e)}
        style={{ position: 'absolute', top: 5, right: 5, background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
      >
        {isFav ? '⭐' : '☆'}
      </button>
      
      <Link to={`/item/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src={item.image} alt={item.name} />
        <h3>{item.name}</h3>
        <p className="price">{item.gold.total} G</p>
      </Link>
    </div>
  );
}