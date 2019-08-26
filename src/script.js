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
            width: 512, 
            height: 512,                       
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

        /*function renderStage(){
            console.log(app.stage.children.length);
            setTimeout(createBoard, 1000);
            if (app.stage.children.length > 0){
                for (let i = 0; i < app.stage.children.length; i++){
                    
                    app.stage.removeChild(app.stage.children[0]);
                    console.log('yes');
                }
            }
            console.log(`You have won ${determineWin()} times!`);
        }*/

        /*function determineWin(){
            const figures = app.stage.children;
            let wins = 0;
            for (let i = 0; i < 3; i++){
                let arr1 = figures.slice(i*4, i*4+4);
                if (arr1[0]._texture.textureCacheIds[0] === arr1[1]._texture.textureCacheIds[0]
                && arr1[1]._texture.textureCacheIds[0] === arr1[2]._texture.textureCacheIds[0]
                && arr1[2]._texture.textureCacheIds[0] === arr1[3]._texture.textureCacheIds[0]){
                    wins += 1;
                }
            }
            return wins;
        }*/

        
        /*function animalRoll(){
        let numberOfAnimals = 3;
            const animalInt = getRandomInt(numberOfAnimals)
            function getRandomInt(max) {
                 return Math.floor(Math.random() * Math.floor(max));
            }
            switch(animalInt){
                case 0: return "cat.png";
                case 1: return "hedgehog.png";
                case 2: return "tiger.png";
            }

        }*/
    let arr = ['0', '1', '2', '3'];

    async function flipAnim(location){
        let i = 0;
        console.log(location.x, location.y);
        while (i < 9){
            let next = new Sprite(id[i + 1]);
            next.width = 76;
            next.height = 76;
            let promise = new Promise(function(resolve, reject){
                    location.addChild(next);
                    console.log(i);
                    setTimeout(function(){
                        location.removeChild(next);
                        resolve();
                    }, 100);
            });
            await promise;
            i++;
        }
        let cardSymbol = new Sprite(resources[mixedArray[location.num]].texture);
        cardSymbol.width = 76;
        cardSymbol.height = 76;
        cardsSelected.push([mixedArray[location.num], location.num]); //now we can get the container
        location.addChild(cardSymbol);
        /*if (cardsSelected.length === 2){
            if(checkWin(cardsSelected)){
                return true;
                /*location.removeChild(cardSymbol);
                cardsSelected = [];
            } else {
                return false;
                /*
                console.log(cardsSelected[0][1], cardsSelected[1][1]);
                console.log(location);
                location.parent.children[cardsSelected[1][1]].children[0].visible = true;
                location.removeChild(cardSymbol);
                location.children[0].visible = true;
                location.interactive = true;
                cardsSelected = [];
            }
        }*/
        return true;
    }

    function createBoard(){
        let mainContainer = [];
        const slots = 20;
        for (let i = 0; i < slots; i++){
            let back = new Container;
            let cont = new Sprite(id[0]);
            cont.height = 76;
            cont.width = 76;
            back.num = i;
            if (i > 4 && i < 10){
                back.y = 100;
                i -= 5;
                back.x = i * 64 + 4;
                i += 5;
            } else if (i > 9 && i < 15){
                back.y = 180;
                i -= 10;
                back.x = i * 64 + 4;
                i += 10;
            } else if (i > 14){
                back.y = 260;
                i -= 15;
                back.x = i * 64 + 4;
                i += 15;
            } else { 
                back.y = 20;
                back.x = i * 64 + 4;
            }
            back.interactive = true;
            back.click = async function(){
                //back.removeChild(cont);
                back.interactive = false;
                back.children[0].visible = false;
                console.log(arr[back.num]);
                let won = flipAnim(back);
                await won;
                if (won){
                    console.log('flipped');
                    if (cardsSelected.length === 2){
                        if(checkWin(cardsSelected)){
                            //location.removeChild(cardSymbol);
                            console.log('won');
                            cardsSelected = [];
                        } else {
                            console.log(cardsSelected[0][1], cardsSelected[1][1]);
                            console.log('missed');
                            //location.removeChild(cardSymbol);
                            //location.children[0].visible = true;
                            //location.interactive = true;
                            cardsSelected = [];
                        }
                    }
                }
            }
            back.addChild(cont);
            mainContainer.push(back);
            app.stage.addChild(back);
        }
    }