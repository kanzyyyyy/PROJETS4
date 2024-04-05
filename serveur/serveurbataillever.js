
let cardsanduser=[]; 
let tourdescartesbatailles = 0; 
class Deck {

    constructor() {
        const symboles = ["♥", "♦", "♣", "♠"];
        const numeros = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Q", "K", "J"];
        this.deck = [];
        let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        for (let i = 0; i < symboles.length; i++) {
            for (let j = 0; j < numeros.length; j++) {
                this.deck.push({number : symboles[i] , symbole : numeros[j] , valeur : values[j]})
            }

        }
        this.shuffle();
    }//construction des 52 cartes sockets
    shuffle() {//reposition des cartes pour la distribuer aux joueurs 
        //let ntotal = this.deck.length;
        for (var i = 0; i < 52; i++) {
            let j = Math.floor(Math.random() * 52);
            let tmp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = tmp;
        }
    }

    distribuer() {
        return this.deck.pop();
    }

    /*isEmpty() {
      return this.deck.length == 0;
    } 
  
    length() {
      return this.deck.length;
    } */
};


// might be already there : */
    socket.on('commencer jeu', () => {
        valrooms = new Deck();
        console.log(valrooms); 
        const cardsPerPlayer = Math.floor(52 / nbJ); // Calculate the number of cards each player should receive
        console.log('cards per player' , cardsPerPlayer); 
                for(let i = 0 ; i<cardsPerPlayer * nbJ ; i++ ){
                    utilisateurs[i%nbJ].cartes.push(valrooms.distribuer());
                }
            //console.log(card1); 
            //let opencard = [];
            //console.log(valrooms); 
            //console.log(player.cartes);
            for(player of utilisateurs){
            console.log(" each player gets : " , player.cartes.length)
            console.log(player);
            io.to(player.userId).emit('start variables', {cards : player.cartes , socketid : player.userId , username : player.username , score : player.cartes.length });
            }
    });

    socket.on('battleClicked', () => {
        if (nbJ === 1) {
            createur = socket.id;
            io.emit('btnShow1');
        }
        if (nbMax && nbJ > 1 && nbJ <= nbMax) {
            io.emit('btnShow2');
        }
        if (nbJ > nbMax) { io.emit('btnShow3'); }
        ///TO ADD!! ùù 
        socket.emit('NEWPLAYER' , nbJ); 
    });

socket.on('joueurlabataille', data =>{
        while(tourdescartesbatailles <2 ){
            for(let i=0; i<data.length; i++){
                let index= utilisateurs.findIndex((user) => user.username === data[i].username );
                console.log('index' , index);  
                let p = utilisateurs[index].position -1;
                console.log('p' , p); 
                socket.emit('batailletour' , p); 
            }
            tourdescartesbatailles++; 
        }
    });
    socket.on('chercherjoueurtourmodebataille' , (data)=>{
        console.log('data des joueurs qui vont jouer dans la bataille' , data); 
        console.log('le tour du joueur en mode bataille :' , globalTour);
        let user = utilisateurs.find((user) => user.username === data[globalTour].username);
        user.tour=true;
        let joueurquialetour;
        for (let i = 0; i < utilisateurs.length; i++) {
            let player = utilisateurs[i];
            if (player.tour) {
                user.tour=false;
                joueurquialetour = player;
                console.log()
                console.log("Le joueur qui a le tour dans bataille c'est " + player.username + " avec le nombre de tour : "  + globalTour); 
            }
        }io.emit('tourdujoueurbataille', {player :  joueurquialetour , allplayers : data});
        

        

    }); 
    socket.on('chercherjoueurtourbataille' , ()=>{
        data = globalTour; 
        let user = utilisateurs.find((user) => user.username === utilisateurs[data].username); 
        user.tour=true; 
        let joueurquialetour; 
        for (let i = 0; i < utilisateurs.length; i++) {
            let player = utilisateurs[i];
            if (player.tour) {
                user.tour=false;
                joueurquialetour = player; 
                console.log("Le joueur qui a le tour c'est " + player.username + " avec le nombre de tour : "  + globalTour); 
            }
        }
        io.emit('tourdujoueur', {player :  joueurquialetour});

        

    }); 
    socket.on('joueurajoue', data => {
        let modebataille = false; 
        //chosenCards.push(data.cartejouee);
        //console.log('cartes jouees : ' , chosenCards);
        let j = utilisateurs.findIndex((user) => user.username === data.username);
        utilisateurs[j].cartes = data.cards;
        console.log("le joueur " + data.username + " a joué la carte " + JSON.stringify(data.cartejouee));
        console.log('les cartes du joueur aprés avoir joué', utilisateurs[j].cartes , 'cards length : ' , utilisateurs[j].cartes.length );
        socket.emit('cardupdate', utilisateurs[j] ); 
        const thisturn = {
            socketid : data.id,
            username : data.username,
            carte : data.cartejouee
        }
        chosenCards.push(thisturn); 
        console.log('chosencards' , chosenCards);
        globalTour++;        
        if(globalTour==nbJ){
            globalTour=0;
            let maxvalue = []; 
            maxvalue.push(chosenCards[0]);
            //console.log('maxvalue : ', maxvalue); 
            for(let i=1; i<chosenCards.length ; i++){
                if(chosenCards[i].carte.valeur > maxvalue[0].carte.valeur){
                    maxvalue = []; 
                    maxvalue.push(chosenCards[i]); 
                } 
                else{
                    if(chosenCards[i].carte.valeur === maxvalue[0].carte.valeur){
                        maxvalue.push(chosenCards[i]);
                    }
                }
            }
            console.log('cartes gangants ce tour !!! ' , maxvalue); 
            if(maxvalue.length > 1 ){
                io.emit('bataile'); /// to be modified 
                modebataille = true;
                 
            }            

            io.emit('revealresult', chosenCards );
            //utilisateurs.findIndex((user) => user.username === player[0]);
            if(!modebataille){
            //let user=  utilisateurs.find((u) => u.userId === maxvalue.socketid );
            let user = utilisateurs.find((u) => {
                console.log("u.userId:", u.userId);
                console.log("maxvalue.socketid:", maxvalue[0].socketid);
                return u.userId === maxvalue[0].socketid;
              });
              
            //console.log(user); 
            for(let i=0; i<chosenCards.length; i++){
                user.cartes.unshift(chosenCards[i].carte); 
            }
            user.score = user.cartes.length;
            console.log('info of winner', user);
            for(let player of utilisateurs){
                if(player.username != user.username){
                    player.score = player.cartes.length;
                    console.log(player.userId);
                    io.to(player.userId).emit('scoreupdate', player.score);
                    if(player.score === 0){
                        let p = utilisateurs.filter((user) => user.userId != player.userId ); 
                        utilisateurs = p; 
                        nbJ--; 
                        //globalTour=0; 
                        io.emit('joueurperdu', player); 
                        console.log(utilisateurs,  'apres elimination'); 

                    }
                    if(player.score=== 52/nbJ){
                        io.emit('joueur gagne!', player); 
                    }
                }
            }
            io.emit('gangant!' , user );
            chosenCards =[];
            }
            if(modebataille){
                console.log('maxvalue' , maxvalue); 
                io.emit('bataille', maxvalue);
                //chosenCards = []; 
            }
        }             
            


        if(!modebataille){
        console.log('condition !modebataille'); 
        socket.emit('next!' , chosenCards); }
    });
    socket.on("joueurajouebattle" , data=>{
        console.log('globaltourafter bataille' , globalTour); 
        
        let j = utilisateurs.findIndex((user) => user.username === data.username);
        utilisateurs[j].cartes = data.cards;
        console.log("le joueur " + data.username + " a joué la carte " + JSON.stringify(data.cartejouee));
        console.log('les cartes du joueur aprés avoir joué', utilisateurs[j].cartes , 'cards length : ' , utilisateurs[j].cartes.length );
        if(utilisateurs[j].cartes){
            console.log('condition verifiéé car :' , utilisateurs[j].cartes.number); 
        socket.emit('cardupdate', utilisateurs[j] ); 
        const thisturn = {
            socketid : data.id,
            username : data.username,
            carte : data.cartejouee
        }
        chosenCards.push(thisturn); 
    }
        console.log('chosencards' , chosenCards); 
        socket.emit('next!B' , data.allplayers);
        globalTour++;

        if(globalTour == data.allplayers.length){
            console.log("the condition globalTour == data.allplayers.length is verified" , globalTour == data.allplayers.length); 
            globalTour=0;             
            tourdescartesbatailles++;
            let user; 
            if(tourdescartesbatailles>=2){
                let maxvalue = [];
                maxvalue.push(chosenCards[chosenCards.length -1]);
                for(let i=chosenCards.length -2; i>=chosenCards.length-nbJ ; i--){
                    if(chosenCards[i].carte.valeur > maxvalue[0].carte.valeur){
                        maxvalue = []; 
                        maxvalue.push(chosenCards[i]); 
                    } 
                    else{
                        if(chosenCards[i].carte.valeur === maxvalue[0].carte.valeur){
                            maxvalue.push(chosenCards[i]);
                        }
                    }
                }
                let cond = false; 
                if(maxvalue.length>1){
                    cond = true;
                    for(let player of utilisateurs){
                            //let i = utilisateurs.find((u)=> u.username === player.username);
                            let maxvalue = [];
                            maxvalue.push(chosenCards[chosenCards.length -1]); 
                            for(let i=chosenCards.length -2; i>=0 ; i--){
                                if(chosenCards[i].carte.valeur > maxvalue[0].carte.valeur){
                                    maxvalue = []; 
                                    maxvalue.push(chosenCards[i]); 
                                } 
                                else{
                                    if(chosenCards[i].carte.valeur === maxvalue[0].carte.valeur){
                                        maxvalue.push(chosenCards[i]);
                                    }
                                }
                            }
                            player.score = player.cartes.length;
                            console.log(player.username , player); 
                            io.to(player.socketid).emit('scoreupdate', player.score);
                            if(player.score === 0){
                                let p = utilisateurs.filter((user) => user.userId != player.userId ); 
                                utilisateurs = p; 
                                nbJ--; 
                                //globalTour=0; 
                                io.emit('joueurperdu', player); 
                                console.log(utilisateurs,  'apres elimination'); 
                            }  
                    }
                }
                else{
                    if(maxvalue.length == 1){
                        user = utilisateurs.find((u) => {
                            console.log("u.userId:", u.userId);
                            console.log("maxvalue.socketid:", maxvalue[0].socketid);
                            return u.userId === maxvalue[0].socketid;
                          });
                          
                        //console.log(user); 
                        for(let i=0; i<chosenCards.length; i++){
                            user.cartes.unshift(chosenCards[i].carte); 
                        }
                        user.score = user.cartes.length;
                        //io.to(user.userId).emit('scoreupdate', user.score); 
                        console.log('info of winner', user);
                        for(let player of utilisateurs){
                            if(player.username != user.username){
                                //let i = utilisateurs.find((u)=> u.username === player.username); 
                                player.score = player.cartes.length;
                                console.log(player.userId , player);
                                io.to(player.socketid).emit('scoreupdate', player.score);
                                if(player.score === 0){
                                    let p = utilisateurs.filter((user) => user.userId != player.userId ); 
                                    utilisateurs = p; 
                                    nbJ--; 
                                    //globalTour=0; 
                                    io.emit('joueurperdu', player);
                                    console.log(utilisateurs,  'apres elimination'); 
 
                                }  
                            }
                        }
            
                    }
                }
                console.log('info of winner of la bataille' ,  user ); 
                io.emit('bataillefini' , {chosenCards : chosenCards  , maxvalue:  maxvalue, winner : user , cond : cond}); 
                chosenCards =[]; 
                globalTour = 0; 
                tourdescartesbatailles = 0; 
                console.log('JEU BATAILLE FINI'); 
            }
        }

    }); 


