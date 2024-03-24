import React, { useState, useEffect } from 'react';
import Game from './board.js';
import Player from './cartesDeJoueur.js';

const Valet = ({socket}) => {
  return (
    <div>
      <Game socket={socket}/>
      <Player socket={socket}/>
    </div>
  );
};
export default Valet;
