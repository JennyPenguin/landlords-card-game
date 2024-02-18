class cardCompare {

    compareHands(org, curr) {
        // if (this.isValidPlay(curr))
    }

    // curr is array of card values
    searchHand(hand, pattern, curr) {
        c = new Map();
        hand.forEach(element => {
            if (c.has(element)) {
                c.set(element, c.get(element) + 1);
            } else {
                c.set(element, 1);
            }
        });
        // if has both jokers
        if (c.has(14) && c.has(15)) {
            return 5;
        }
        // bombs
        if (pattern != 4) {
            c.keys.forEach(element => {
                if (c.get(element) == 4) {
                    return element;
                }
            });
        }
        if (pattern <= 4) {
            c.keys.forEach(element => {
                if (c > curr[0] && c.get(element) == pattern) {
                    return element;
                }
            });
        }
        // consecutives
        if (pattern > 10 && pattern < 100) {
            for (let i = 0; i < hand.length - curr.length + 1; i++) {
                if (hand[i] > curr[0]) {
                    for (let j = 1; j < curr.length; j++) {
                        if (hand[i + j] != hand[i] + j) {
                            break
                        } else if (j == curr.length - 1) {
                            return 6 * 10 + hand[i];
                        }
                    }
                }
            }
        }
        // 3s

    }

    // hand is array of card values
    isValidPattern(og) {
        let hand = Array.from(og.values());
        if (hand.length <= 0) {
            return -1;
        }
        let c = new Map();
        for (let i = 0; i < hand.length; i++) {
            let element = hand[i];
            if (c.has(element)) {
                c.set(element, c.get(element) + 1);
            } else {
                c.set(element, 1);
            }
        }
        // jokers (5)
        if (c.size == 2 && c.has(14) && c.has(15)) {
            return 5;
        }
        // single combinations (1-4)
        if (c.size == 1 && hand.length <= 4) {
            return hand.length;
        }
        // consecutives (6 length) 
        if (c.size >= 5) {
            let cons = true;
            for (let i = 1; i < hand.length; i++) {
                if (hand[i] != hand[i - 1] - 1) {
                    cons = false;
                }
            }
            if (cons) {
                return 600 + hand.length;
            }
        }
        // add list of 2 + num of pairs
        if (hand.length >= 6 && hand.length % 2 == 0) {
            if (c.size == hand.length / 2) {
                let cons = true;
                for (let i = 0; i < hand.length; i += 2) {
                    if (i < hand.length - 3 && hand[i] - 1 != hand[i + 2]) {
                        cons = false;
                    }
                }
                if (cons) {
                    return 2 * 10 + hand.length / 2;
                }
            }
        }
        let nums = { 1: [], 2: [], 3: [], 4: [] };
        for (let [key, value] of c) {
            nums[value].push(key);
        }
        // bomb with 2
        if (c.size == 2) {
            if (nums[4].length == 1 && nums[2].length == 1) {
                return 42;
            }
        }
        // add lots of airplanes
        //3 with 2/1/0 (7 1/2) however much times
        if (nums[3].length >= 1) {
            // check consecutive 3s
            let planes = nums[3];
            for (let i = 1; i < planes.length; i++) {
                if (Math.abs(planes[i - 1] - planes[i]) > 1) {
                    return -1;
                }
            }
            if (hand.length % 3 == 0) {
                // only 3s
                return 700 + nums[3].length;
            } else {
                let remain = hand.length - 3 * nums[3].length;
                if (remain % 2 == 0 && remain / 2 == nums[2].length) {
                    return 720 + nums[3].length;
                } else if (remain == nums[3].length) {
                    return 710 + nums[3].length;
                }
            }
        }
        return -1;
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


    // hand is array of card values
    async isValidPlay(pile, pattern, curr) {
        let hand = await this.sortCards(Array.from(pile.values()));

        if (pattern == 5) {
            return -1;
        } else {

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
            // bomb?
            if (pattern != 4 && nums[4].length == 1 && hand.length == 4) {
                return 4;
            }
            // rocket
            else if (c.size == 2 && c.has(14) && c.has(15)) {
                return 5;
            }
            else if (pattern <= 4) {
                if (c.size == 1 && nums[pattern].length > 0 && hand[0] > curr[0]) {
                    return pattern;
                }
            }
            // consecutives
            else if (p > 600 && p < 700) {
                let l = p % 600;
                // is hand consecutive? Is starting one bigger than curr?
                for (let j = 0; j < hand.length - 1; j++) {
                    if (hand[j] - 1 != hand[j + 1]) {
                        return -1;
                    }
                }
                if (hands[0] > curr[0] && hand.length == curr.length) return pattern;
            }
            // pairs of 2
            else if (p > 20 && p < 30) {
                let l = p - 20;
                let twos = nums[2];
                for (let j = 0; j = twos.length; j++) {
                    if (twos[j] - 1 != twos[j + 1]) {
                        return -1;
                    }
                }
                if (hand.length == twos.length * 2) return pattern;
            }
            // bomb with 2 
            else if (p == 42) {
                if (hand.length == 6 && nums[4].length == 1 && nums[2].length == 1) return pattern;
            }
            // airplanes 
            else if (p > 700 && p < 800) {
                return -1;
            }
            return -1;
        }
    }
}