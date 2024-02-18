function onSelected($this) {
    if ($this.classList.contains('selected')) {
        $this.classList.remove('selected');
    } else {
        $this.classList.add('selected');
    }
}

class Graphics {
    p = [document.getElementById("p1"), document.getElementById("p2"), document.getElementById("p3")];
    cards = document.getElementById("playerCards");
    pCards = [document.getElementById("playerCards"), document.getElementById("p2Cards"), document.getElementById("p3Cards")];
    names = [document.getElementById("name1"), document.getElementById("name2"), document.getElementById("name3")];
    // cardHolder = document.getElementById("playerCards");
    alert = document.getElementById('gameBanner');
    cardCount = [document.getElementById('cardCount2'), document.getElementById('cardCount3')]
    cardsOrder = { '3': 0, '4': 1, '5': 2, '6': 3, '7': 4, '8': 5, '9': 6, '0': 7, 'J': 8, 'Q': 9, 'K': 10, 'A': 11, '2': 12, 'X': 13 };
    lordCards = [document.getElementById('lord1'), document.getElementById('lord2'), document.getElementById('lord3')];

    setLord(i) {
        this.p[i].classList.add("landlord");
        this.p[i].innerHTML = "地主";
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setCurr(index) {
        this.alert.innerHTML = '等待玩家' + (index + 1) + '...';
        for (let i = 0; i < this.names.length; i++) {
            if (i == index) {
                this.names[i].classList.add("curr");
            } else {
                this.names[i].classList.remove("curr");
            }
        }
    }

    async sortCards(c) {
        let sortedC = [];
        for (let i = 0; i < c.length; i++) {
            let element = c[i];
            if (sortedC.length == 0) {
                sortedC.push(element);
            } else {
                for (let i = 0; i <= sortedC.length; i++) {
                    if (i == sortedC.length) {
                        sortedC.push(element);
                        break;
                    } else {
                        if (this.cardsOrder[element['code'].substring(0, 1)] > this.cardsOrder[sortedC[i]['code'].substring(0, 1)]) {
                            sortedC.splice(i, 0, element);
                            break;
                        } else if (element['code'] == 'X2') {
                            sortedC.splice(i, 0, element);
                            break;
                        } else if (this.cardsOrder[element['code'].substring(0, 1)] == this.cardsOrder[sortedC[i]['code'].substring(0, 1)]
                            && this.cardsOrder[element['code'].substring(1)] > this.cardsOrder[sortedC[i]['code'].substring(1)]) {
                            sortedC.splice(i, 0, element);
                            break;
                        }
                    }
                }
            }
        };
        return sortedC;
    }

    async revealLordCards(cards) {
        for (let i = 0; i < 3; i++) {
            this.lordCards[i].style.backgroundImage = "url(" + cards[i]['image'] + ")";
        }
        await timeout(2000);
        for (let i = 0; i < 3; i++) {
            this.lordCards[i].style.display = "none";
        }
    }



    async drawCards(card, index) {
        this.clearCards(index);
        let c = await this.sortCards(card);
        let indent = 0;
        for (let i = 0; i < c.length; i++) {
            let element = c[i];
            if (index == 0) {
                let button = document.createElement('button');
                button.setAttribute('data-key', element['code']);
                button.setAttribute('onclick', 'onSelected(this)');
                button.classList.add('card');
                button.style.left = indent + "px";
                indent += 50;
                button.style.backgroundImage = "url(" + element['image'] + ")";
                this.pCards[index].appendChild(button);
            } else {
                let div = document.createElement('div');
                div.classList.add('card');
                div.style.left = indent + "px";
                indent += 50;
                div.style.backgroundImage = "url(" + element['image'] + ")";
                this.pCards[index].appendChild(div);
            }

        };
    }

    clearCards(index) {
        while (this.pCards[index].firstChild) {
            this.pCards[index].removeChild(this.pCards[index].firstChild);
        }
    }

    async changeCardsLeft(p, num) {
        if (p != 0) {
            this.cardCount[p - 1].innerHTML = num;
        }
    }
}

