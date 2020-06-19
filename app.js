const fs = require('fs'); // required to write to a file

// utility used to find if a value is distinct in an array
const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

// i realize this is a brute-force way of doing this, but it made the most logical sense at the time.

// this function runs through all of the permutations possible
function findAllOutcomes() {
    let a1 = 0, a2 = 0, a3 = 0, a4 = 0;
    const possibleOutcomes = [];

    while (a1 <= 6) {
        let outcome = [a1, a2, a3, a4];
        possibleOutcomes.push(outcome);

        if (a2 == 6 && a3 == 6 & a4 == 6) {
            a2 = 0;
            a1++;
        } else if (a3 == 6 & a4 == 6) {
            a3 = 0;
            a2 ++;
        } else if (a4 == 6) {
            a4 = 0;
            a3++;
        } else {
            a4 ++;
        }
    }

    return possibleOutcomes;
}

// this function removed all outcomes that didn't have a majority answer
function removeNonDeterministicOutcomes(allOutcomes) {
    const goodOutcomes = allOutcomes.filter(outcome => {
        const distinctAnswers = outcome.filter(distinct);
        return distinctAnswers.length < 4; // only care about outcomes where there are less than 4 distinct answers
    });

    return goodOutcomes;
}

// find a majority answer in an array of answers
function findMajorityAnswer(answers) {
    const map = {};
    let maxAnswer = answers[0];
    let maxCount = 1;

    answers.map(answer => {
        if (!map[answer]) {
            map[answer] = 1;
        }
        else map[answer]++;

        if (map[answer] > maxCount) {
            maxAnswer = answer;
            maxCount = map[answer];
        }
    })

    return maxAnswer;
}

// group by majority answer in the array of answers
function groupAnswers(outcomes) {
    const result = {
        a: [],
        b: [],
        c: [],
        d: [],
        e: [],
        f: [],
        g: []
    };

    outcomes.map(answers => {
        const majorityAnswer = findMajorityAnswer(answers);

        switch (majorityAnswer) {
            case 0:
                result.a.push(answers);
                break;

            case 1:
                result.b.push(answers);
                break;

            case 2:
                result.c.push(answers);
                break;

            case 3:
                result.d.push(answers);
                break;

            case 4:
                result.e.push(answers);
                break;

            case 5:
                result.f.push(answers);
                break;

            case 6:
                result.g.push(answers);
                break;
        
            default:
                break;
        }
    })

    return result;
}

// make the array a number so the form can work with it...
function translateToNumbers(answers) {
    const answersAsNumbers = [1, 10, 100, 1000, 10000, 100000, 1000000];
    const reducer = (accumulator, currentValue) => accumulator + currentValue;

    const translatedToNumbers = answers.map(answer => answersAsNumbers[answer]);
    const outcomeAsNumber = translatedToNumbers.reduce(reducer);

    return outcomeAsNumber
}

// format it to number used in form, for easy reading
function formatOutcomes(outcomes) {
    const a = outcomes.a.map(answers => translateToNumbers(answers)).filter(distinct);
    const b = outcomes.b.map(answers => translateToNumbers(answers)).filter(distinct);
    const c = outcomes.c.map(answers => translateToNumbers(answers)).filter(distinct);
    const d = outcomes.d.map(answers => translateToNumbers(answers)).filter(distinct);
    const e = outcomes.e.map(answers => translateToNumbers(answers)).filter(distinct);
    const f = outcomes.f.map(answers => translateToNumbers(answers)).filter(distinct);
    const g = outcomes.g.map(answers => translateToNumbers(answers)).filter(distinct);

    const text = `
        here are the outcomes grouped together \n
        \n
        [A Block]\n
        ${a}\n
        \n
        [B Block]\n
        ${b}\n
        \n
        [C Block]\n
        ${c}\n
        \n
        [D Block]\n
        ${d}\n
        \n
        [E Block]\n
        ${e}\n
        \n
        [F Block]\n
        ${f}\n
        \n
        [G Block]\n
        ${g}\n
        \n
    `;

    return text;
}


// run all of the stuff...
const allOutcomes = findAllOutcomes();
const deterministicOutcomes = removeNonDeterministicOutcomes(allOutcomes);
const groupedOutcomes = groupAnswers(deterministicOutcomes);
const formattedOutcomes = formatOutcomes(groupedOutcomes);
const result = formattedOutcomes;

fs.writeFile('output.txt', result, (err) => {
    if (err) return console.log(err);
    console.log('done');
})

console.log(result);
