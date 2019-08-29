
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;
        
let app = new Application({ 
    width: 1024, 
    height: 720,                       
    antialias: true, 
    transparent: false, 
    resolution: 1
    }
);

document.body.appendChild(app.view);

loader
    .add("./images/spritesheet/card_spritesheet.json")
    .add("./images/1.png").add("./images/2.png").add("./images/3.png")
    .add("./images/4.png").add("./images/5.png").add("./images/6.png")
    .add("./images/7.png").add("./images/8.png").add("./images/9.png")
    .add("./images/10.png")
    .on("progress", loadHandler)
    .load(setup);

function loadHandler(){
    console.log('loaded');
}
        
let id;
function setup(){
    id = resources["./images/spritesheet/card_spritesheet.json"].textures;
    createBoard();
}

let cardSelection = [
    "./images/1.png", "./images/2.png", "./images/3.png",
    "./images/4.png","./images/5.png","./images/6.png",
    "./images/7.png","./images/8.png","./images/9.png",
    "./images/10.png"
];

let cardsSelected = [];

function checkWin(arr){
    const firstCard = imgFileName(arr[0]);
    const secondCard = imgFileName(arr[1]);

    if (firstCard === secondCard){
        return true;
    } 
    
    return false;
}

function duplicateArr(arr){
    const doubledArr = [];

    for(let i = 0; i < arr.length; i++){
        doubledArr.push(arr[i]);
        doubledArr.push(arr[i]);
    }

    return doubledArr;
}
        
function imgFileName(fileLocation){
    let regex = /(images\/\w+)/;
    let fileName = fileLocation[0].match(regex)[0].split('/')[1];
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

async function flipAnim(location){
    let i = 0;
    while (i < 9){
        let next = new Sprite(id[i + 1]);
        next.width = 140;
        next.height = 140;
        let promise = new Promise(function(resolve, reject){
                location.addChild(next);
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

function getDestination(){
    let divisor = Math.floor(matchedCards.length / 12);
    return [800 + divisor * 150, 20 + matchedCards.length * 50 - 492 * divisor];
}

async function moveToPile(back, j){
    let lastTwoCards = j;
    let allCards = back.parent.children;
    let thePair = matchedCards[lastTwoCards];
    let destination = getDestination();
    const flyingCard = allCards[thePair];
    const [x, y] = destination;

    while (flyingCard.x !== x
        || flyingCard.y !== y){
            let promise = new Promise(function(resolve, reject){
                setTimeout(function(){
                    flyingCard.children[1].anchor.x = 0.6706;
                    flyingCard.children[1].anchor.y = 0.6706;
                    flyingCard.rotation += 0.05;
                    if (flyingCard.x < x){
                        flyingCard.x = Math.min(flyingCard.x + 4, x)
                    }
                    if (flyingCard.y > y){
                        flyingCard.y -= 4;
                        flyingCard.y < y ? 
                            flyingCard.y = y : null;
                    }
                    if (flyingCard.y < y){
                        flyingCard.y += 4;
                        flyingCard.y > y ? 
                            flyingCard.y = y : null;
                    } 
                    resolve();
                }, 5);
            });
            await promise;
        }
};

function createCont(size) {
    let cont = new Sprite(id[0]);
    cont.height = size;
    cont.width = size;
    return cont;
}

function createBoard(){
    const slots = 20;
    const numberOfItemsInRow = 5;
    const spaceBetweenTwo = 5;
    const size = 140;

    for (let i = 0; i < slots; i++) {
        let back = new Container();

        let cont = back.addChild(createCont(size));
        back.num = i;
        
        const xOffset = (i % numberOfItemsInRow);
        const yOffset = Math.floor(i / numberOfItemsInRow);

        back.position.set(xOffset * (size +  spaceBetweenTwo), yOffset * (size +  spaceBetweenTwo));

        back.interactive = true;
        back.hitArea = new PIXI.Rectangle(28, 28, 85, 85);
        back.click = async () => {
            if(cardsSelected.length >= 1){
                back.parent.children.forEach(e => {
                    e.interactive = false;
                });
            }
            cardsSelected.push([mixedArray[back.num], back.num]);
            back.interactive = false;
            back.children[0].visible = false;
            await flipAnim(back);
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
                    const [firstCard, secondCard, ...rest] = cardsSelected;
                    matchedCards.push(cardsSelected[0][1], cardsSelected[1][1]);
                    back.parent.children.forEach(e => {
                        e.interactive = true;
                    })
                    for (let j = 0; j < matchedCards.length; j++){
                        if (back.parent.children[matchedCards[j]]){
                            back.parent.children[matchedCards[j]].interactive = false;
                        }
                    }
                    for (let b = 1; b < 3; b++){
                        let j = matchedCards.length - b;
                        moveToPile(back, j);
                    }
                    cardsSelected = [];
                } else {
                    setTimeout(function(){
                        const firstCard = cardsSelected[5];
                        let firstSelectedFront = back.parent.children[cardsSelected[0][1]].children[1];
                        let secondSelectedFront = back.parent.children[cardsSelected[1][1]].children[1];
                        let firstSelectedBack = back.parent.children[cardsSelected[0][1]].children[0];
                        let secondSelectedBack = back.parent.children[cardsSelected[1][1]].children[0];
                        firstSelectedFront.visible = false;
                        secondSelectedFront.visible = false;
                        firstSelectedBack.visible = true;
                        secondSelectedBack.visible = true;
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
            console.log(cardsSelected);
        }
        app.stage.addChild(back);
    }

    // for (let i = 0; i < slots; i++){
    //     let back = new Container();
    //     let cont = new Sprite(id[0]);
    //     cont.height = 140;
    //     cont.width = 140;
    //     back.num = i;


    //     if(i < 5){
    //         back.y = 40;
    //         back.x = i * 140 + 4;
    //     } else if (i < 10) {
    //         back.y = 140;
    //         i -= 5;
    //         back.x = i * 140 + 4;
    //         i += 5;
    //     } else if (i < 15) {
    //         back.y = 240;
    //         i -= 10;
    //         back.x = i * 140 + 4;
    //         i += 10;
    //     } else {
    //         back.y = 340;
    //         i -= 15;
    //         back.x = i * 140 + 4;
    //         i += 15;
    //     }

    //     if (i > 4 && i < 10){
    //         back.y = 140;
    //         i -= 5;
    //         back.x = i * 140 + 4;
    //         i += 5;
    //     } else if (i > 9 && i < 15){
    //         back.y = 240;
    //         i -= 10;
    //         back.x = i * 140 + 4;
    //         i += 10;
    //     } else if (i > 14){
    //         back.y = 340;
    //         i -= 15;
    //         back.x = i * 140 + 4;
    //         i += 15;
    //     } else { 
    //         back.y = 40;
    //         back.x = i * 140 + 4;
    //     }
    //     back.interactive = true;
    //     back.hitArea = new PIXI.Rectangle(28, 28, 85, 85);
    //     back.click = async function(){
    //         if(cardsSelected.length >= 1){
    //             back.parent.children.forEach(e => {
    //                 e.interactive = false;
    //             });
    //         }
    //         cardsSelected.push([mixedArray[back.num], back.num]);
    //         back.interactive = false;
    //         back.children[0].visible = false;
    //         let won = flipAnim(back);
    //         await won;
    //         if(back.children.length < 2){
    //             let cardSymbol = new Sprite(resources[mixedArray[back.num]].texture);
    //             cardSymbol.width = 85;
    //             cardSymbol.height = 85;
    //             cardSymbol.x += 28;
    //             cardSymbol.y += 28;
    //             back.addChild(cardSymbol);
    //         } else {
    //             back.children[1].visible = true;
    //         }
    //         if (cardsSelected.length === 2){
    //             if(checkWin(cardsSelected)){
    //                 matchedCards.push(cardsSelected[0][1], cardsSelected[1][1]);
    //                 back.parent.children.forEach(e => {
    //                     e.interactive = true;
    //                 })
    //                 for (let j = 0; j < matchedCards.length; j++){
    //                     if (back.parent.children[matchedCards[j]]){
    //                         back.parent.children[matchedCards[j]].interactive = false;
    //                     }
    //                 }
    //                 for (let b = 1; b < 3; b++){
    //                     let j = matchedCards.length - b;
    //                     moveToPile(back, j);
    //                 }
    //                 cardsSelected = [];
    //             } else {
    //                 setTimeout(function(){
    //                     let firstSelectedFront = back.parent.children[cardsSelected[0][1]].children[1];
    //                     let secondSelectedFront = back.parent.children[cardsSelected[1][1]].children[1];
    //                     let firstSelectedBack = back.parent.children[cardsSelected[0][1]].children[0];
    //                     let secondSelectedBack = back.parent.children[cardsSelected[1][1]].children[0];
    //                     firstSelectedFront.visible = false;
    //                     secondSelectedFront.visible = false;
    //                     firstSelectedBack.visible = true;
    //                     secondSelectedBack.visible = true;
    //                     back.parent.children.forEach(e => {
    //                         e.interactive = true;
    //                     })
    //                     for (let j = 0; j < matchedCards.length; j++){
    //                         if (back.parent.children[matchedCards[j]]){
    //                             back.parent.children[matchedCards[j]].interactive = false;
    //                         }
    //                     }
    //                     cardsSelected = [];
    //                 }, 500);
    //             }
    //         }
    //     }
    //     back.addChild(cont);
    //     app.stage.addChild(back);
    // }
}
