import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './valet.css';

const Game = ({ socket }) => {
    const navigate = useNavigate();
    const [showSpinner, setSpinner] = useState(true);
    const [quitButton] = useState(true);
    const [startButton, setStart] = useState(false);
    useEffect(()=>{
        socket.on('show the start button',()=>{
            setSpinner(false);
            setStart(true);
        });

        socket.on('commencer le jeu pout tout le monde',()=>{
            setSpinner(false);
            setStart(false);
        });
    });
    const startgame = ()=>{
        socket.emit('start valet');
    }
    const quit = ()=>{
        navigate('/home');
    }
    return (
        <>
            {startButton && (
                    <div>
                        <button onClick={startgame} className="btnStart"> Commencer le jeu ! </button>
                    </div>
                )}
            {showSpinner && (
                <div>
                    <p>PLEASE AWAIT OTHER PLAYERS TO CONNECT</p>
                    <div className="spinner-container">
                        <div className="loading-spinner">
                        </div>
                    </div>
                </div>
            )}
            {quitButton && (
                <button onClick={quit} className='btn'> Quitter !</button>
            )}
        </>
    );
};
export default Game;