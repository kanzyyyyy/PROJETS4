import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/registerpage';
import HomePage from './components/homepage';
import GamePage from './components/chat/gamePage';
import PlayerPage from './components/chat/playerPage';
import Nimmt from './components/Nimmt/nimmtPage';
import Valet from './components/Valet/valetPage';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Register socket={socket} />}></Route>
          <Route path="/home" element={<HomePage socket={socket} />}></Route>
          <Route path="/Nimmt" element={<Nimmt socket={socket} />}></Route>
          <Route path="/jeu" element={<GamePage socket={socket} />}></Route>
          <Route path="/Valet" element={<Valet socket={socket} />}></Route>
          <Route path="/joueur" element={<PlayerPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;