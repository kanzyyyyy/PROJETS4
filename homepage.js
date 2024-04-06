import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cardImage from './carte2.png';
import nimmtImage from './nimmt.png';
import jackImage from './jack.jpg';

const Home = ({ socket }) => {
    const navigate = useNavigate();
    const [showBtn1, setShowBtn1] = useState(false);
    const [showBtn2, setShowBtn2] = useState(false);
    const [showBtn3, setShowBtn3] = useState(false);
    const [showBtn4, setShowBtn4] = useState(false);
    const [showBtn5, setShowBtn5] = useState(false);
    const [showBtn6, setShowBtn6] = useState(false);
    const [showBtn7, setShowBtn7] = useState(false);
    const [maxPlayers, setMaxPlayers] = useState(2);
    const [maxRounds, setMaxRounds] = useState(2);
    const [room, setRoomName] = useState('');
    const handleClick = () => {
        socket.emit('battleClicked');
    };
    const handleClickNimmt = () => {
        socket.emit('NimmtClicked');
    };
    const handleClickValet = () => {
        socket.emit('ValetClicked');
    };
    useEffect(() => {
        socket.on('btnShow1', () => {
            setShowBtn1(true);
        });
        socket.on('btnShow2', () => {
            setShowBtn2(true);
        });
        socket.on('btnShow3', () => {
            setShowBtn3(true);
        });
        socket.on('btnShow4', () => {
            setShowBtn4(true);
        });
        socket.on('btnShow5', () => {
            setShowBtn5(true);
        });
        socket.on('btnShow6', () => {
            setShowBtn6(true);
        });
        socket.on('btnShow7', () => {
            setShowBtn7(true);
        });
    }, [socket]);

    //-------------REPRISE-------------
    //émiter un évenement pour le serveur avec le nom de la partie 
    const handleReprisePartieClick = () => {
        const nomPartie = prompt("Entrer le nom de la partie :");
        socket.emit('reprendrePartie', nomPartie);
    };
    // Gestion de la confirmation de la reprise de partie 
    socket.on('reprisePartieConfirmation', (data) => {
        console.log(data.message);
        const { nbMax, nbTourMax, room, createur, utilisateurs, row } = data.donneesPartie;
        navigate('/jeu');
    });


    // Gestion de l'erreur lors de la reprise de partie 
    socket.on('reprisePartieErreur', (error) => {
        console.error(error);
    });
    //----------------REPRISE-------------------
    //bataille
    const handleStartClick = () => {
        socket.emit('setParam', { maxPlayers, maxRounds, room });
        navigate('/jeu');
        socket.emit('inTheGame');
    }
    const handleStartClickB = () => {
        navigate('/jeu');
        socket.emit('inTheGame');
    }
    //6 qui prend
    const handleStartClickNimmt = () => {
        socket.emit('setParam', { maxPlayers, room });
        navigate('/Nimmt');
        socket.emit('CreatorInAction');
    }
    const handleStartClickNimmtB = () => {
        navigate('/Nimmt');
        socket.emit('CreatorInAction');
    }
    //Valet qui pue
    const handleStartClickValet = () => {
        socket.emit('setParam', { maxPlayers, room });
        navigate('/Valet');
        socket.emit('enteredValet');
    }
    const handleStartClickValetB = () => {
        navigate('/Valet');
        socket.emit('enteredValet');
    }

    //page des joueurs
    const handleGo = () => {
        socket.emit('updateNBPlayers');
        navigate('/joueur');
    };
    return (
        <div className='home-container'>
            <h4>CLICK ON THE GAME YOU4D LIKE TO JOIN</h4>
            <div className='battle-game'>
                <img src={cardImage} alt="Battle Game" onClick={handleClick} />
            </div>
            <div className='battle-game'>
                <img src={nimmtImage} alt="Nimmt Game" onClick={handleClickNimmt} />
            </div>
            <div className='battle-game'>
                <img src={jackImage} alt="Valet Game" onClick={handleClickValet} />
            </div>
            <button className="reprise-partie-button" onClick={handleReprisePartieClick}>Reprise Partie</button>// ajoute cette ligne 
            <div className='start'>
                {showBtn1 && (
                    <>
                        <p>put the maximum number of players</p>
                        <input
                            type="number"
                            min="2" max="10"
                            placeholder='put the maximum number of players'
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(e.target.value)}
                        />
                        <br />
                        <p>put the maximum number of rounds</p>
                        <input type="number"
                            min="2" max="4"
                            placeholder="put the maximum number of rounds"
                            value={maxRounds}
                            onChange={(e) => setMaxRounds(e.target.value)} />
                        <br />
                        <p>choose a unique name for this round</p>
                        <input type="text"
                            value={room}
                            onChange={(e) => setRoomName(e.target.value)} />
                        <br />
                        <button onClick={handleStartClick}>Nouvelle Partie</button>
                    </>
                )}
                {showBtn2 && (<button onClick={handleStartClickB}>Rejoindre</button>)}
                {showBtn3 && (<button>Room is full! please await ...</button>)}
                {showBtn4 && (
                    <>
                        <p>put the maximum number of players</p>
                        <input
                            type="number"
                            min="2" max="10"
                            placeholder='put the maximum number of players'
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(e.target.value)}
                        />
                        <br />
                        <p>choose a unique name for this round</p>
                        <input type="text"
                            value={room}
                            onChange={(e) => setRoomName(e.target.value)} />
                        <br />
                        <button onClick={handleStartClickNimmt}>Nouvelle Partie</button>
                    </>
                )}
                {showBtn5 && (<button onClick={handleStartClickNimmtB}>Rejoindre</button>)}
                {showBtn6 && (
                    <>
                        <p>put the maximum number of players</p>
                        <input
                            type="number"
                            min="2" max="8"
                            placeholder='put the maximum number of players'
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(e.target.value)}
                        />
                        <br />
                        <p>choose a unique name for this round</p>
                        <input type="text"
                            value={room}
                            onChange={(e) => setRoomName(e.target.value)} />
                        <br />
                        <button onClick={handleStartClickValet}>Nouvelle Partie</button>
                    </>
                )}
                {showBtn7 && (<button onClick={handleStartClickValetB}>Rejoindre</button>)}
            </div>
            <button className="goToPlayerPage-btn" onClick={handleGo}>see other players and their scores!</button>
        </div>
    );
};

export default Home;
