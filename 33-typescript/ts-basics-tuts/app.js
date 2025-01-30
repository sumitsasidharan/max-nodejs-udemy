"use strict";
const num1Element = document.getElementById('num1');
const num2Element = document.getElementById('num2');
const btnEl = document.querySelector('button'); // '!' is to tell  ts that element is not null
const numResults = [];
const textResults = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + '#' + num2;
    }
    // return number if either of is not a string
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
}
btnEl.addEventListener('click', () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    const stringResult = add(num1, num2);
    textResults.push(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('it worked');
    }, 1000);
});
myPromise.then(result => {
    console.log(result.split('w'));
});
