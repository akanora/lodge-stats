import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TopPlayers from './pages/TopPlayers';
import { ServerProvider } from './context/ServerContext';
import './index.css';

function App() {
  return (
    <ServerProvider>
      <Router basename="/stats">
        <div className="app-layout">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/top" element={<TopPlayers />} />
              {/* <Route path="/bans" element={<Bans />} /> */}
            </Routes>
          </main>

          <footer style={{ marginTop: '4rem', padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Lodge Stats. Powered by Bhoptimer.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ServerProvider>
  );
}

export default App;
