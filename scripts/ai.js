class AI {

    constructor(id, dialogueBox) {
        this.id = id;
        this.dialogue = dialogueBox;
        this.dialogue.style.display = "none";
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
                        if (element > sortedC[i + 1]) {
                            sortedC.splice(i, 0, element);
                            break;
                        }
                    }
                }
            }
        };
        return sortedC;
    }

    getBestFirst(p, hand) {
        // use last value in pile
        return this.useResults([hand[hand.length - 1]], p);
    }

    useResults(r, pi) {
        let needed = new Map();
        for (let i = 0; i < r.length; i++) {
            let element = r[i];
            if (needed.has(element)) {
                needed.set(element, needed.get(element) + 1);
            } else {
                needed.set(element, 1);
            }
        }
        let resCodes = [];
        for (let [key, value] of pi) {
            if (needed.has(value)) {
                needed.set(value, needed.get(value) - 1);
                if (needed.get(value) <= 0) {
                    needed.delete(value);
                }
                resCodes.push(key);
            }
            if (needed.length == 0) {
                break;
            }
        }
        return resCodes;
    }

    async getBestMove(pile, pattern, curr) {
        console.log(curr);
        let hand = await this.sortCards(Array.from(pile.values()));
        if (pattern != -1) {
            // smallest possible move that's bigger than pattern
            if (pattern == 5) {
                return [-1];
            } else {
                // set up for search
                let resV = [];
                c = new Map();
                for (let i = 0; i < hand.length; i++) {
                    let element = hand[i];
                    if (c.has(element)) {
                        c.set(element, c.get(element) + 1);
                    } else {
                        c.set(element, 1);
                    }
                }
                let nums = { 1: [], 2: [], 3: [], 4: [] };
                for (let [key, value] of c) {
                    nums[value].push(key);
                }
                if (pattern <= 4) {
                    for (let j = nums[pattern].length - 1; j >= 0; j--) {
                        if (nums[pattern][j] > curr[0]) {
                            // use this
                            // console.log('curr:' + nums[pattern][j] + ' and prev:' + curr[0]);
                            for (let k = 0; k < pattern; k++) {
                                resV.push(nums[pattern][j]);
                            }
                            break;
                        }
                    }
                }
                // consecutives
                else if (p > 600 && p < 700) {
                    let l = p % 600;
                    for (let j = hand.length - 1; j >= l; j--) {
                        if (hand[j] > curr[curr.length - 1]) {
                            let cons = true;
                            for (let k = 0; k < l - 1; k++) {
                                if (hand[j - k] + 1 != hand[j - k - 1]) {
                                    cons = false;
                                }
                            }
                            if (cons) {
                                // use this one
                                for (let k = 0; k < l; k++) {
                                    resV.unshift(hand[j - k]);
                                }
                                break;
                            }
                        }
                    }
                }
                // pairs of 2
                else if (p > 20 && p < 30) {
                    let l = p - 20;
                    let twos = nums[2];
                    for (let j = twos.length - 1; j >= l; j--) {
                        if (twos[j] > curr[curr.length - 1]) {
                            let cons = true;
                            for (let k = 0; k < l - 1; k++) {
                                if (twos[j - k] + 1 != twos[j - k - 1]) {
                                    cons = false;
                                }
                            }
                            if (cons) {
                                // use this one
                                for (let k = 0; k < l; k++) {
                                    resV.unshift(twos[j - k]);
                                }
                                break;
                            }
                        }
                    }
                }
                // bomb with 2 
                else if (p == 42) {
                    let e4 = -1;
                    let e2 = -1;
                    if (this.getCount(curr, curr[0]) == 4) {
                        e4 = curr[0];
                        e2 = curr[-1];
                    } else {
                        e2 = curr[0];
                        e4 = curr[-1];
                    }
                    if (nums[4].length >= 1 && nums[2].length >= 1) {
                        // find bigger one
                        for (let k = nums[4].length - 1; k >= 0; k--) {
                            if (nums[4][k] > e4) {
                                for (var h = 0; h < 4; h++) resV.push(nums[4][k]);
                                for (var h = 0; h < 2; h++) resV.push(nums[2][nums[2].length - 1]);
                                break;
                            } else if (nums[4][k] == e4) {
                                let found = false;
                                for (var g = nums[2].length - 1; g >= 0; g--) {
                                    if (nums[2][g] > e2) {
                                        found = true;
                                        for (var h = 0; h < 4; h++) resV.push(nums[4][k]);
                                        for (var h = 0; h < 2; h++) resV.push(nums[2][g]);
                                        break;
                                    }
                                }
                                if (found) {
                                    break;
                                }
                            }
                        }
                    }
                }
                // airplanes 
                else if (p > 700 && p < 800) {
                    let combo = Math.floor((p - 700) / 10);
                    let rep = p - 700 - combo * 10;
                    if (nums[3].length >= rep && (combo == 0 || nums[combo].length >= rep)) {
                        // first check if have 3 consecutives
                        console.log('add this later!!')
                        return [-1];
                    }
                }
                // use bomb when needed
                else if (pattern != 4 && nums[4].length >= 1) {
                    for (let k = 0; k < 4; k++) {
                        resV.push(nums[4][-1]);
                    }
                }
                // use rocket when needed
                else if (c.size == 2 && c.has(14) && c.has(15)) {
                    resV.push(15);
                    resV.push(14);
                } else {
                    await this.makeMove('不出');
                    return [-1];
                }
                if (resV.length > 0) {
                    return this.useResults(resV, pile);
                } else {
                    return [-1];
                }
            }
        } else {
            return this.getBestFirst(pile, hand);
        }
    }

    getCount(arr, target) {
        let count = 0;
        for (let h = 0; h < arr.length; h++) {
            if (arr[h] == target) {
                count++;
            }
        }
        return count;
    }


    async makeMove(move) {
        await this.timeout(500);
        this.dialogue.style.display = "flex";
        this.dialogue.innerHTML = move;
        await this.timeout(1000);
        this.dialogue.style.display = "none";
    }

    async getBidPoints(choices) {
        await this.timeout(1500);
        this.dialogue.style.display = "flex";
        let choice = choices[Math.floor(Math.random() * choices.length)];
        if (choice == -1) {
            this.dialogue.innerHTML = '不叫';
        } else {
            this.dialogue.innerHTML = choice + '分';
        }
        await this.timeout(2500);
        this.dialogue.style.display = "none";
        return choice;
    }

    async findFirst(cards) {
        return cards[-1];
    }
}