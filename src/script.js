//import * as PIXI from 'PIXI.js';

let Application = PIXI.Application,
            Container = PIXI.Container,
            loader = PIXI.loader,
            resources = PIXI.loader.resources,
            TextureCache = PIXI.utils.TextureCache,
            Sprite = PIXI.Sprite,
            Rectangle = PIXI.Rectangle;
        
        //Create a Pixi Application
        let app = new Application({ 
            width: 1024, 
            height: 720,                       
            antialias: true, 
            transparent: false, 
            resolution: 1
          }
        );
        
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.body.appendChild(app.view);
        
        //load a JSON file and run the `setup` function when it's done
        loader
        .add("./images/atlas/card_spritesheet2.json")
        .add("./images/1.png").add("./images/2.png").add("./images/3.png")
        .add("./images/4.png").add("./images/5.png").add("./images/6.png")
        .add("./images/7.png").add("./images/8.png").add("./images/9.png")
        .add("./images/10.png")
        .on("progress", loadHandler)
        .load(setup);

        function loadHandler(){
            console.log('loaded');
        }
        
        let id, seed;
        function setup(){
            id = resources["./images/atlas/card_spritesheet2.json"].textures;
            createBoard();
            //document.addEventListener('click', renderStage);
        }

        //regex loop the below arr from fn() to shorten it
        //^No, implmented in imgFileName
        let cardSelection = [
            "./images/1.png", "./images/2.png", "./images/3.png",
            "./images/4.png","./images/5.png","./images/6.png",
            "./images/7.png","./images/8.png","./images/9.png",
            "./images/10.png"];

        //selected cards below
        let cardsSelected = [];
        //check selected cards
        function checkWin(arr){
            let firstCard = imgFileName(arr[0]);
            let secondCard = imgFileName(arr[1]);
            if (firstCard === secondCard){
                return true;
            } else {
                return false;
            }
            //return firstCard === secondCard ? true : false;
        }
        
        function duplicateArr(arr){
            let duparr = [];
            for(let i = 0; i < arr.length; i++){
                duparr.push(arr[i]);
                duparr.push(arr[i]);
            }
            return duparr;
        }
        
        function imgFileName(fileLocation){
            let regex = /(images\/\w+)/;
            let fileName = fileLocation[0].match(regex)[0].split('/')[1];
            console.log(`Img name is ${fileName}`);
            return fileName;
        }

        function mixArray(arr){
            for(let i = 0; i < arr.length; i++){
                let jumps = Math.ceil(Math.random() * 6);
                let temp = arr[i];
                let trade = loopArray(jumps, i, arr);
                arr[i] = arr[trade];
                arr[trade] = temp;
            }
            return arr;
        }

        function loopArray(jumps, startPos, arr){
            let i = startPos;
            for (let j = 0; j < jumps; j++){
                i += 1;
                if (i === arr.length){
                    i = 0;
                }
            }
            return i;
        }

        let mixedArray = mixArray(duplicateArr(cardSelection));
        console.log(mixArray(duplicateArr(cardSelection)));


    async function flipAnim(location){
        let i = 0;
        while (i < 9){
            let next = new Sprite(id[i + 1]);
            next.width = 140;
            next.height = 140;
            let promise = new Promise(function(resolve, reject){
                    location.addChild(next);
                    console.log(i);
                    setTimeout(function(){
                        location.removeChild(next);
                        resolve();
                    }, 20);
            });
            await promise;
            i++;
        }
        return;
    }

    let matchedCards = ['filler'];

    function createBoard(){
        const slots = 20;
        for (let i = 0; i < slots; i++){
            let back = new Container;
            let cont = new Sprite(id[0]);
            cont.height = 140;
            cont.width = 140;
            back.num = i;
            if (i > 4 && i < 10){
                back.y = 140;
                i -= 5;
                back.x = i * 140 + 4;
                i += 5;
            } else if (i > 9 && i < 15){
                back.y = 240;
                i -= 10;
                back.x = i * 140 + 4;
                i += 10;
            } else if (i > 14){
                back.y = 340;
                i -= 15;
                back.x = i * 140 + 4;
                i += 15;
            } else { 
                back.y = 40;
                back.x = i * 140 + 4;
            }
            back.interactive = true;
            back.click = async function(){
                if(cardsSelected.length >= 1){
                    back.parent.children.forEach(e => {
                        e.interactive = false;
                    });
                }
                cardsSelected.push([mixedArray[back.num], back.num]); //now we can get the container
                back.interactive = false;
                back.children[0].visible = false;
                let won = flipAnim(back);
                await won;
                if(back.children.length < 2){
                    let cardSymbol = new Sprite(resources[mixedArray[back.num]].texture);
                    cardSymbol.width = 85;
                    cardSymbol.height = 85;
                    cardSymbol.x += 28;
                    cardSymbol.y += 28;
                    back.addChild(cardSymbol);
                } else {
                    back.children[1].visible = true;
                }
                if (cardsSelected.length === 2){
                    if(checkWin(cardsSelected)){
                        matchedCards.push(cardsSelected[0][1], cardsSelected[1][1]);
                        back.parent.children.forEach(e => {
                            e.interactive = true;
                        })
                        for (let j = 0; j < matchedCards.length; j++){
                            if (back.parent.children[matchedCards[j]]){
                                back.parent.children[matchedCards[j]].interactive = false;
                            }
                            //extract
                            for (let b = 1; b < 3; b++){
                                let j = matchedCards.length - b;
                                async function moveToPile(){
                                    function getDestination(){
                                        let divisor = Math.floor(matchedCards.length / 12);
                                        return [750 + divisor * 100, 20 + matchedCards.length * 44 - 500 * divisor];
                                    }
                                    let destination = getDestination();
                                    console.log(destination)
                                    //let i = 0;
                                    while (back.parent.children[matchedCards[j]].x !== destination[0]
                                        || back.parent.children[matchedCards[j]].y !== destination[1]){
                                        let promise = new Promise(function(resolve, reject){
                                            setTimeout(function(){
                                                if (back.parent.children[matchedCards[j]].x < destination[0]){
                                                    back.parent.children[matchedCards[j]].x += 1;
                                                }
                                                if (back.parent.children[matchedCards[j]].y > destination[1]){
                                                    back.parent.children[matchedCards[j]].y -= 1;
                                                }
                                                if (back.parent.children[matchedCards[j]].y < destination[1]){
                                                    back.parent.children[matchedCards[j]].y += 1;
                                                } 
                                                resolve();
                                            }, 20);
                                            
                                        });
                                        await promise;
                                        //i++;
                                    }
                                };
                                moveToPile();
                                //extract above

                            }
                        }
                        cardsSelected = [];
                    } else {
                        setTimeout(function(){
                            back.parent.children[cardsSelected[0][1]].children[1].visible = false;
                            back.parent.children[cardsSelected[1][1]].children[1].visible = false;
                            back.parent.children[cardsSelected[0][1]].children[0].visible = true;
                            back.parent.children[cardsSelected[1][1]].children[0].visible = true;
                            back.parent.children.forEach(e => {
                                e.interactive = true;
                            })
                            for (let j = 0; j < matchedCards.length; j++){
                                if (back.parent.children[matchedCards[j]]){
                                    back.parent.children[matchedCards[j]].interactive = false;
                                }
                            }
                            cardsSelected = [];
                        }, 500);
                    }
                }
            }
            back.addChild(cont);
            app.stage.addChild(back);
        }
    }