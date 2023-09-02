/** Rule for Yahtzee scoring.
 *
 * This is an "abstract class"; the real rules are subclasses of these.
 * This stores all parameters passed into it as properties on the instance
 * (to simplify child classes so they don't need constructors of their own).
 *
 * It contains useful functions for summing, counting values, and counting
 * frequencies of dice. These are used by subclassed rules.
 */

class Rule {
  constructor(params) {
    // put all properties in params on instance
    Object.assign(this, params);
  }

  sum(dice) {
    // sum of all dice
    return dice.reduce((prev, curr) => prev + curr);
  }

  freq(dice) {
    // frequencies of dice values
    const freqs = new Map();
    for (let d of dice) freqs.set(d, (freqs.get(d) || 0) + 1);
    return Array.from(freqs.values());
  }

  count(dice, val) {
    // # times val appears in dice
    return dice.filter((d) => d === val).length;
  }
}

/** Given a sought-for val, return sum of dice of that val.
 *
 * Used for rules like "sum of all ones"
 */

class TotalOneNumber extends Rule {
  evalRoll = (dice) => {
    return this.val * this.count(dice, this.val);
  };
}

/** Given a required # of same dice, return sum of all dice.
 *
 * Used for rules like "sum of all dice when there is a 3-of-kind"
 */

class SumDistro extends Rule {
  evalRoll = (dice) => {
    // do any of the counts meet of exceed this distro?
    return this.freq(dice).some((c) => c >= this.count) ? this.sum(dice) : 0;
  };
}

/** Check if full house (3-of-kind and 2-of-kind) */

class FullHouse extends Rule {
  evalRoll = (dice) => {
    const freqs = this.freq(dice);
    return freqs.includes(2) && freqs.includes(3) ? this.score : 0;
  };
}

/** Check for small straights. */

class SmallStraight extends Rule {
  evalRoll = (dice) => {
    const d = new Set(dice);

    if (d.has(2) && d.has(4) && d.has(3) && (d.has(5) || d.has(1))) {
      return this.score;
    }

    if (d.has(3) && d.has(4) && d.has(5) && (d.has(6) || d.has(2))) {
      return this.score;
    }

    return 0;
  };
}

/** Check for large straights. */

class LargeStraight extends Rule {
  evalRoll = (dice) => {
    const d = new Set(dice);

    // large straight must be 5 different dice & only one can be a 1 or a 6
    return d.size === 5 && (!d.has(1) || !d.has(6)) ? this.score : 0;
  };
}

/** Check if all dice are same. */

class Yahtzee extends Rule {
  evalRoll = (dice) => {
    // all dice must be the same
    return this.freq(dice)[0] === 5 ? this.score : 0;
  };
}

const ones = new TotalOneNumber({ val: 1, description: "Sum of 1's" });
const twos = new TotalOneNumber({ val: 2, description: "Sum of 2's" });
const threes = new TotalOneNumber({ val: 3, description: "Sum of 3's" });
const fours = new TotalOneNumber({ val: 4, description: "Sum of 4's" });
const fives = new TotalOneNumber({ val: 5, description: "Sum of 5's" });
const sixes = new TotalOneNumber({ val: 6, description: "Sum of 6's" });

const threeOfKind = new SumDistro({
  count: 3,
  description: "Sum of three of a kind",
});
const fourOfKind = new SumDistro({
  count: 4,
  description: "Sum of four of a kind",
});

const fullHouse = new FullHouse({
  score: 25,
  description: "Full House (25 points)",
});

const smallStraight = new SmallStraight({
  score: 30,
  description: "Small Straight (30 points)",
});
const largeStraight = new LargeStraight({
  score: 40,
  description: "Large Straight (40 points)",
});

const yahtzee = new Yahtzee({ score: 50, description: "Yahtzee (50 points)" });

const chance = new SumDistro({
  count: 0,
  description: "Sum of all dice",
});

export {
  ones,
  twos,
  threes,
  fours,
  fives,
  sixes,
  threeOfKind,
  fourOfKind,
  fullHouse,
  smallStraight,
  largeStraight,
  yahtzee,
  chance,
};
