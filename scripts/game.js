let landload = 0;
let currTerm = 0;
let gameStart = false;
let g = new Graphics();
let deck = new Deck();
let lord = 0;
let p2 = new AI(1, document.getElementById("dialogueBox2"));
let p3 = new AI(2, document.getElementById("dialogueBox3"));
let aiP = [p2, p3];
let callBids = document.getElementsByClassName('bid');
let comparator = new cardCompare();
let choices = [document.getElementById("use"), document.getElementById("pass")];
let loadingScreen = document.getElementById('loadingScreen');
let menu = document.getElementById('optionMenu');
let holder = document.getElementById("playerCards");
let order = { '3': 0, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5, '9': 6, '0': 7, 'J': 8, 'Q': 9, 'K': 10, 'A': 11, '2': 12, 'X': 13 };
let p = -1;
let gameEnds = -1;
// pCurr - [index of last player, current card values]
let pCurr = [];
let winnerTag = document.getElementById('winner');
let endScreen = document.getElementById('endingScreen');
initiate();

function codeToNums(codes) {
    let converted = new Map();
    codes.forEach(element => {
        let c = element.substring(0, 1);
        if (c == 'X') {
            converted.set(element, order[c] + parseInt(element.substring(1)));
        } else {
            converted.set(element, order[c]);
        }
    })
    return converted;
}


async function onPlay($this) {
    let allCodes = [];
    let buttons = document.getElementsByClassName('selected');
    for (let i = 0; i < buttons.length; i++) {
        allCodes.push(buttons[i].dataset.key);
    }
    let con = codeToNums(allCodes);
    if (p == -1) {
        p = comparator.isValidPattern(con);
    } else {
        p = await comparator.isValidPlay(con, p, pCurr[1]);
    }
    if (p != -1) {
        pCurr = [0, Array.from(con.values())]
        await deck.useCards(0, allCodes);
        drawLayout();
        if (await deck.getPileLeft(0) == 0) {
            gameEnds = 0;
        }
        nextTerm();
    }

}

function onPass($this) {
    nextTerm();
}

async function initiate() {
    endScreen.style.display = "none";
    choices.forEach(element => {
        element.style.display = "none";
    });
    g.setCurr(0);
    await deck.initialize();
    g.setCurr(0);
    await drawLayout();
    loadingScreen.style.display = 'none';
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function onChosenLord($this) {
    await timeout(500);
    for (let i = 0; i < callBids.length; i++) {
        callBids[i].style.display = "none";
    }
    let choices = [-1, 1, 2, 3];
    let highestBid = $this.dataset.key;
    if (highestBid == 3) {
        lord = 0;
    } else {
        if (highestBid != -1) {
            choices = [-1].concat(choices.splice(choices.indexOf(parseInt(highestBid)) + 1));
        }
        this.nextTerm();
        let aiPoints = await p2.getBidPoints(choices);
        if (aiPoints == 3) {
            lord = 1;
        } else {
            if (aiPoints != -1) {
                choices = [-1].concat(choices.splice(choices.indexOf(parseInt(aiPoints)) + 1));
            }
            if (aiPoints > highestBid) {
                lord = 1;
                highestBid = aiPoints;
            }
            this.nextTerm();
            aiPoints = await p3.getBidPoints(choices);
            if (aiPoints > highestBid) {
                lord = 2;
                highestBid = aiPoints;
            }
        }
    }
    g.setLord(lord);
    currTerm = lord;
    await revealBonus();
}


async function revealBonus() {
    let bonusCards = await deck.getCards('Bonus');
    let codes = await getCodes('Bonus');
    await deck.useCards('Bonus', codes);
    await deck.addItemToPile(codes, lord)
    await g.revealLordCards(bonusCards);
    timeout(1000);
    await g.changeCardsLeft(lord, 20);
    await drawLayout();
    gameStart = true;
    currTerm--;
    nextTerm();
}

async function getCodes(id) {
    let cards = await deck.getCards(id);
    let cardCodes = [];
    for (let i = 0; i < cards.length; i++) {
        cardCodes.push(cards[i]['code']);
    }
    return cardCodes;
}

async function nextTerm() {
    if (gameEnds == -1) {
        if (currTerm == 2 || currTerm == -1) {
            currTerm = 0;
            choices.forEach(element => {
                element.style.display = "inline-block";
            });
        } else {
            currTerm++;
            choices.forEach(element => {
                element.style.display = "none";
            });
        }
        g.setCurr(currTerm);
        if (pCurr[0] == currTerm) {
            p = -1;
            pCurr = [];
        }
        if (p == -1) {
            choices[1].style.display = "none";
        }
        if (gameStart && currTerm != 0) {
            let move;
            console.log(pCurr);
            if (currTerm == 1 || currTerm == 2) {
                c = await getCodes(currTerm);
                let con = codeToNums(c);
                move = await aiP[currTerm - 1].getBestMove(con, p, pCurr[1]);
            }
            if (move[0] != -1) {
                let used = await deck.useCards(currTerm, move);
                let cur = Array.from(this.codeToNums(move).values());
                if (p == -1) {
                    p = comparator.isValidPattern(cur);
                }
                pCurr = [currTerm, cur];
                await g.drawCards(used, currTerm);
                let newL = await deck.getPileLeft(currTerm);
                await g.changeCardsLeft(currTerm, newL);
                if (newL == 0) {
                    gameEnds = currTerm;
                }
            } else {
                g.clearCards(currTerm);
                await aiP[currTerm - 1].makeMove('不出');
            }
            await timeout(750);
            nextTerm();
        }
    } else {
        console.log('game ends');
        endScreen.style.display = "flex";
        if (gameEnds == lord) {
            winnerTag.innerHTML = '地主赢了!';
        } else {
            winnerTag.innerHTML = '村民赢了!';
        }

    }
}

async function drawLayout() {
    let cards = await deck.getCards(0);
    await g.drawCards(cards, 0);
}

function restart() {
    location.reload();
}


