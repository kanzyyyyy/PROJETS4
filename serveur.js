socket.on('ValetClicked', () => {
        if (nbJ === 1) {
            createur = socket.id;
            io.emit('btnShow6');
        }
        if (nbMax && nbJ > 1 && nbJ <= nbMax) {
            io.emit('btnShow7');
        }
        if (nbJ > nbMax) { io.emit('btnShow3'); }
    });
socket.on('enteredValet', () => {
        //console.log('receiving the "enteredValet" event');
        //console.log('nombre max pour jouer au Valet :', nbMax);
        joueursValets++;
        //console.log('nombre des utilisateurs jouans Valet :', joueursValets);
        if (joueursValets == nbMax) {
            //console.log('received enteredValet event about to show the start button');
            io.to(createur).emit('show the start button');
        }
    });
class DeckValet{
    constructor() {
        const symboles = ["♥", "♦", "♣", "♠"];
        const numeros = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Q", "K", "J"];
        this.deck = [];
        for (let i = 0; i < symboles.length; i++) {
            for (let j = 0; j < numeros.length -1 ; j++) {
                this.deck.push({symbol : symboles[i] , number : numeros[j] })
            }
            this.deck.push({symbol: symboles[i] , number : numeros[12]  })

        }
        this.deck.pop(); 
        this.shuffle();
    }//construction des 52 cartes sockets
    shuffle() {//reposition des cartes pour la distribuer aux joueurs 
        //let ntotal = this.deck.length;
        for (var i = 0; i <51 ; i++) {
            let j = Math.floor(Math.random() * 51);
            let tmp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = tmp;
        }
    }

    distribuer() {
        return this.deck.pop();
    }

}

    socket.on('start valet' , ()=> {
        //faire disparaître le bouton 'Commencer' pour tous les joueurs
        io.emit('commencer le jeu pour tout le monde');
        let player = utilisateurs.find((player) => player.userId == createur);
        let msg = `c'est le tour de ${player.username} choisie une carte`;
        io.emit('commentaires', { msg });
        const deck = new DeckValet(); 
        console.log(deck.deck.length); 

        console.log(deck); 
        utilisateurs.forEach((player) => {
            if(player.cartes.length == 0 ){
                for(let i=0 ; i<51/nbJ ; i++ ){
                    let card = deck.distribuer(); 
                    if(!card){
                        break; 
                    }
                    player.cartes.push(card); 
                    //console.log("value after distribution loop :" +deck.deck.length); 
                }
                

            }}); 
        console.log("value by the end of distribution loop " + deck.deck.length); 

        while(deck.deck.length > 0 ){
                    let card = deck.distribuer(); 
                    if(!card){
                        break; 
                    }
                    if(card){
                    let randomindex= Math.floor(Math.random() * nbJ); 
                    utilisateurs[randomindex].cartes.push(card); 
        }}; 
        utilisateurs.forEach(player =>{
            let cartes = player.cartes;
            console.log('les cartes de joueurs avant d`enlever les doublons',cartes);
            let cartesUnique = Array.from(new Set(cartes.map(carte => carte.number))).map(number => cartes.find(carte => carte.number === number));
            console.log('les cartes de joueurs APRES d`enlever les doublons',cartes);
            player.cartes=cartesUnique;
        });
        utilisateurs.forEach(player => {
            console.log(player.cartes); 
            console.log(player.cartes.length); 
            io.to(player.userId).emit('cards to player' , player.cartes); 
        });
        setTimeout(() => {
            for (let i = 0; i < utilisateurs.length; i++) {
                let player = utilisateurs[i];
                if (player.tour) {
                    let prochainIndex = (i + 1) % utilisateurs.length;
                    io.to(player.userId).emit('choisie une carte Valet', utilisateurs[prochainIndex].cartes);
                }
            }
        }, "1000");
    }); 
 socket.on('chercherjoueurtourvalet', ()=> {
        data = globalTour ; 
        io.emit('tourdujoueur' , {userId : utilisateurs[data].userId , username : utilisateurs[data].username , userIdNEXT : utilisateurs[data+1].userId , usernameNEXT : utilisateurs[data+1].username}); 
    }); 
