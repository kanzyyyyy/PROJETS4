import React, { useState, useEffect } from 'react';
import Game from './board.js'

const Valet = ({socket}) => {
  return (
    <div>
      <Game socket={socket}/>
    </div>
  );
};
export default Valet;
