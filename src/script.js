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

        //FUNCTION to get images
        //AND get them into a random order

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
            next.width = 100;
            next.height = 100;
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
        /*setInterval(function(){
            let next = new Sprite(id[i + 1])
            app.stage.children[location]
        }, 500);*/
    }

    function createBoard(){
        const slots = 20;
        for (let i = 0; i < slots; i++){
            let back = new Container;
            let cont = new Sprite(id[0]);
            cont.height = 100;
            cont.width = 100;
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
            back.click = function(){
                back.removeChild(cont);
                console.log(arr[back.num]);
                flipAnim(back)
            }
            back.addChild(cont);
            app.stage.addChild(back);
        }
    }