import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Details from './pages/Details';
import Favorites from './pages/Favorites';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar /> {/* Toujours visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<Details />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}
export default App;