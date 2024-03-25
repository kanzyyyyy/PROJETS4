import React, { useState, useEffect } from 'react';
import './valet.css';

const Player = ({ socket }) => {
    const [nomJoueur, setNom] = useState('');
    const [showCartes, setShowCartes] = useState(false);
    const [cartes, setCartes] = useState([]);
    const [click, setClickState] = useState(false);
    const [nbClick, setNBClick] = useState(0);

    useEffect(() => {
        socket.on('cards to player', (player) => {
            console.log('received cards to player event');
            //const player = players.find((player) => player.userId === socket.id);
            if (player) {
                setShowCartes(true);
                setNom(player.username);
                setCartes(player.cartes);
                if (player.position == 1) setClickState(true);
            }
        });
    }, [socket]);

    // Determine the number of columns based on screen width and card size
    const numColumns = Math.floor(window.innerWidth / 200); // Adjust 200 according to your card size

    const HandleClick = (carte) => {
        if (nbClick % 2 != 0) setClickState(false);
        setNBClick(nbClick + 1);
        console.log("selected card is : " + carte.number + " " + carte.symbol + " selected by " + nomJoueur);
    };

    const shuffle = ()=>{
        const cartesMelangee = [...cartes];
        let n = cartesMelangee.length;
        for (var i = 0; i < n; i++) {
            let j = Math.floor(Math.random() * n);
            let tmp = cartesMelangee[i];
            cartesMelangee[i] = cartesMelangee[j];
            cartesMelangee[j] = tmp;
        }
        setCartes(cartesMelangee);
    }

    return (
        <div>
            {nomJoueur && <h2>{nomJoueur}</h2>}
            <div className="cartes-joueur">
                {showCartes && cartes.filter(carte => carte).map((carte, index) => (
                    <div key={index} className="card" onClick={click ? () => HandleClick({ number: carte.number, score: carte.score }) : null}>
                        {carte.symbol === "♥" || carte.symbol === "♦" ? (
                            <div className='front1' data-symbol={carte.symbol}>
                                <div className='number-top'>{carte.number}</div>
                                <div className='symbol-top'>{carte.symbol}</div>
                                <div className='number-bottom'>{carte.number}</div>
                                <div className='symbol-bottom'>{carte.symbol}</div>
                            </div>
                        ) : (
                            <div className='front2' data-symbol={carte.symbol}>
                                <div className='number-top'>{carte.number}</div>
                                <div className='symbol-top'>{carte.symbol}</div>
                                <div className='number-bottom'>{carte.number}</div>
                                <div className='symbol-bottom'>{carte.symbol}</div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <button className='shuffle' onClick={shuffle}>Mélanger!</button>
        </div>
    );
};

export default Player;
