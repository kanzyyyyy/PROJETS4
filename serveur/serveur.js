 ///////Valet!!!!!!!!!!!!!!!!
    socket.on('enteredValet', () => {
        console.log('receiving the "enteredValet" event');
        console.log('nombre max pour jouer au Valet :', nbMax);
        joueursValets++;
        console.log('nombre des utilisateurs jouans Valet :', joueursValets);
        if (joueursValets == nbMax) {
            console.log('received enteredValet event about to show the start button');
            io.to(createur).emit('show the start button');
        }
    });

    class DeckValet {
        constructor() {
            const symboles = ["♥", "♦", "♣", "♠"];
            const numeros = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Q", "K", "J"];
            this.deck = [];
            for (let i = 0; i < symboles.length; i++) {
                for (let j = 0; j < numeros.length - 1; j++) {
                    this.deck.push({ symbol: symboles[i], number: numeros[j] })
                }
                this.deck.push({ symbol: symboles[i], number: numeros[12] })

            }
            this.deck.pop();
            this.shuffle();
        }//construction des 52 cartes sockets
        shuffle() {//reposition des cartes pour la distribuer aux joueurs 
            //let ntotal = this.deck.length;
            for (var i = 0; i < 51; i++) {
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

    socket.on('start valet', () => {
        //faire disparaître le bouton 'Commencer' pour tous les joueurs
        io.emit('commencer le jeu pout tout le monde');
        const deck = new DeckValet();
        console.log('checking the deck length in the beginning',deck.deck.length);
        utilisateurs.forEach((player) => {
            console.log('player ; ',player);
            if (player.cartes.length == 0) {
                for (let i = 0; i < 51 / joueursValets; i++) {
                    let card = deck.distribuer();
                    console.log('card: ',card);
                    player.cartes.push(card);
                }
            }
        });
        console.log('checking the decks length after initial loop : ',deck.deck.length);
        while (deck.deck.length != 0) {
            let card = deck.distribuer();
            let randomindex = Math.floor(Math.random() * nbJ);
            utilisateurs[randomindex].cartes.push(card);
            console.log('utilisateur ;',utilisateurs[randomindex]);
        };
        /*utilisateurs.forEach(player => {
            //console.log(player.cartes);
            io.to(player.userId).emit('cards to player', player);//i prefer sending the player directly
        });*/
        io.emit('cards to player',utilisateurs);
    });

    socket.on('chercherjoueurtourvalet', () => {
        data = globalTour;
        io.emit('tourdujoueur', { userId: utilisateurs[data].userId, username: utilisateurs[data].username, userIdNEXT: utilisateurs[data + 1].userId, usernameNEXT: utilisateurs[data + 1].username });
    });

