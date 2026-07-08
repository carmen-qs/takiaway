import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import ArtistDetail from "./pages/ArtistDetail";
import "./App.css";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/artist/:id" element={<ArtistDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
