const crypto = require("crypto");

function stringToNumber(str) {
  const hash = crypto.createHash("sha256").update(str).digest();
  const num = hash.readUIntBE(0, 6);
  const remainder = num % 101;
  return remainder;
}
// Original data (an array of numbers)
const inputDoc = ["Balance", "of", "X", "is", "1001"];
const data = inputDoc.map(stringToNumber);
const input = stringToNumber("1001");

const g = 2;

const gToThePowerX = data.map((x) => g ** x % 101);
// Hash function
function hash(value) {
  return crypto.createHash("sha256").update(value.toString()).digest("hex");
}

// Homomorphic hash of the original data
const homomorphicHash = data.map(hash);

// Remove an item from the original data (for example, the number 3)
const indexToRemove = data.indexOf(input);
if (indexToRemove !== -1) {
  data.splice(indexToRemove, 1);
}

// Homomorphic hash of the updated data (without revealing the original data)
const updatedHomomorphicHash = homomorphicHash.filter(
  (_, index) => index !== indexToRemove
);

// console.log(data); // Output: [1, 2, 4, 5]
// console.log(homomorphicHash); // h(x) -> from blockchain
const gToThePowerInput = g ** input % 101; // shared by user
const gToThePowerXslashInput = data.map((x) => g ** x % 101); // shared by user
// console.log(g**input);
// console.log(hash(input)); // h(input) -> shared by user
// console.log(updatedHomomorphicHash); // h(x/input) ) -> shared by user
console.log("g power x slash input", gToThePowerXslashInput);
console.log("g power input", gToThePowerInput);
//checking
const toCheck = [...gToThePowerXslashInput, gToThePowerInput];
console.log("g power x", gToThePowerX.sort());
console.log(toCheck.sort());
