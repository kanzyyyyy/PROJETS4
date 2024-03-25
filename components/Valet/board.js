import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './valet.css';

const Game = ({ socket }) => {
    const navigate = useNavigate();
    const [showSpinner, setSpinner] = useState(true);
    const [quitButton] = useState(true);
    const [startButton, setStart] = useState(false);
    const [instructions,setInstructions]= useState(false);
    const [commentaires,setCommentaire]=useState("");
    const [cartesCachees,setCartesC]=useState([]);
    useEffect(()=>{
        socket.on('show the start button',()=>{
            setSpinner(false);
            setStart(true);
        });

        socket.on('commencer le jeu pour tout le monde',()=>{
            setSpinner(false);
            setStart(false);
        });
        socket.on('commentaires',(data)=>{
            setInstructions(true);
            setCommentaire(data.msg);
        });
        socket.on('choisie une carte Valet',(cartes)=>{
            setCartesC(cartes);
        });
    });
    const startgame = ()=>{
        socket.emit('start valet');
    }
    const quit = ()=>{
        navigate('/home');
        socket.emit('quit',{id:socket.id});
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

            {instructions && (<div>
                <p style={{ color: 'white', fontFamily: 'Gill Sans, sans-serif' }}>{commentaires}</p>
            </div>)}
        </>
    );
};
export default Game;
