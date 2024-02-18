class Deck {

    constructor() {
        this.deckId = 'hi';
    }

    getDeckId() {
        return this.deckId;
    }

    async initialize() {
        this.deckId = await this.createDeck();
        await this.initializeDeck();
    }

    async initializeDeck() {
        for (let i = 0; i < 3; i++) {
            await this.addToPile(17, i);
        }
        await this.addToPile(3, 'Bonus');
    }

    async createDeck() {
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1&jokers_enabled=true');
        let data = await response.json();
        return data['deck_id'];
    }

    async addToPile(count, id) {
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/draw/?count=' + count);
        let data = await response.json();
        let cards = data['cards'];
        let c = [];
        cards.forEach((element) => c.push(element['code']));
        let response1 = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/pile/' + id + '/add/?cards=' + c.join(','))
        return response1.json();
    }

    async addItemToPile(cards, id) {
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/pile/' + id + '/add/?cards=' + cards.join(','))
        let data = await response.json();
        return data['piles'][id]['remaining'];
    }

    async getPileLeft(id) {
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/pile/' + id + '/list/')
        let data = await response.json();
        return await data['piles'][id]['remaining'];
    }

    async getCards(id) {
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/pile/' + id + '/list/')
        let data = await response.json();
        return await data['piles'][id]['cards'];
    }


    async useCards(id, items) {
        console.log(items);
        let response = await fetch('https://www.deckofcardsapi.com/api/deck/' + this.deckId + '/pile/' + id + '/draw/?cards=' + items.join(','));
        let data = await response.json();
        return await data['cards'];
    }
}



