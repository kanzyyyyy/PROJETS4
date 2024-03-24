import React, { useState, useEffect } from 'react';
import './valet.css';

const Player = ({ socket }) => {
    const [nomJoueur, setNom] = useState('');
    const [showCartes, setShowCartes] = useState(false);
    const [cartes, setCartes] = useState([]);

    useEffect(() => {
        socket.on('cards to player', (player) => {
            console.log('received cards to player event');
            //const player = players.find((player) => player.userId === socket.id);
            if (player) {
                setShowCartes(true);
                setNom(player.username);
                setCartes(player.cartes);
            }
        });
    }, [socket]);

    console.log('les cartes de joueurs : ', nomJoueur, 'sont :', cartes);

    // Determine the number of columns based on screen width and card size
    const numColumns = Math.floor(window.innerWidth / 200); // Adjust 200 according to your card size

    return (
        <div>
            {nomJoueur && <h2>{nomJoueur}</h2>}
            <div className="card-container">
                {showCartes && cartes.filter(carte => carte).map((carte, index) => (
                    <div key={index} className="card">
                        <div className='front' data-symbol={carte.symbol}>
                            <div className='number-top'>{carte.number}</div>
                            <div className='symbol-top'>{carte.symbol}</div>
                            <div className='number-bottom'>{carte.number}</div>
                            <div className='symbol-bottom'>{carte.symbol}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Player;

/*import React, { useState, useEffect, useRef } from 'react';
import './valet.css';

const Player = ({ socket }) => {
    const [nomJoueur, setNom] = useState('');
    const [showcartes, setShowCartes] = useState(false);
    const [cartes, setCartes] = useState([]);
    useEffect(() => {
        socket.on('cards to player', (players) => {
            console.log('received cards to player event');
            let player = players.find((player) => player.userId === socket.id);
            if (player) {
                setShowCartes(true);
                setNom(player.username);
                setCartes(player.cartes);
            }

        });
    });
    console.log('les cartes de joueurs : ', nomJoueur, 'sont :', cartes);
    return (
        <>
            {nomJoueur && (<h2>{nomJoueur}</h2>)}
            <table>
                <tbody>
                    <tr>
                        {showcartes && cartes.filter(carte => carte).map((carte, index) => (
                            <td key={index}>
                                <div className='front' data-symbol={carte.symbol}>
                                    <div className='number-top'>{carte.number}</div>
                                    <div className='symbol-top'>{carte.symbol}</div>
                                    <div className='number-bottom'>{carte.number}</div>
                                    <div className='symbol-bottom'>{carte.symbol}</div>
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>

            </table>
        </>

    )
};
export default Player;*/



