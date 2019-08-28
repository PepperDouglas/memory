back.parent.children.forEach(e => {
    console.log(back.parent.children.indexOf(e))
    for (let j = 0; j < matchedCards; j++){
        if (matchedCards[j] === back.parent.children.indexOf(e)){
            e.interactive = false;
        } else {
            e.interactive = true;
        }
    }
});

for (let b = 1; b < 3; b++){
    let j = matchedCards.length - b;
    async function moveToPile(){
        function getDestination(){
            let divisor = Math.floor(matchedCards.length / 12);
            return [750 + divisor * 100, 20 + matchedCards.length * 44 - 500 * divisor];
        }
        let destination = getDestination();
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
    //extract above
    
}