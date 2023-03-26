const crypto = require("crypto");
let n = 101;
let g = 3;

let ans = 7;
const inputDoc = ["Balance", "of", "X", "is", "1001"];
const inputDocWithoutBalance = ["Balance", "of", "X", "is"];
let x = 0;

let y = 4;

let E1 = Math.pow(g, (x + y) % (n - 1)) % n;

let E2 = (Math.pow(g, x) * Math.pow(g, y)) % n;

let E3 = Math.pow(g, ans) % n;

const generateHash = (strings) => {
  let val = 0;
  strings.forEach((string) => {
    const num = parseInt(Buffer.from(string).toString("hex"), 16);
    val = (val + num) % n;
    console.log("hash", val);
  });
  return val;
};
x = generateHash(inputDoc);
let x_input = generateHash(inputDocWithoutBalance);
let input = generateHash(["1000"]);
let hash_x_input = Math.pow(g, x_input) % n;
let hash_input = Math.pow(g, input) % n;
// console.log("======Agreed parameters============");
// console.log("P=", n, "\t(Prime number)");
// console.log("G=", g, "\t(Generator)");
console.log("x=", x, "\t(Value 1 - Alice first value)");
// console.log("y=", y, "\t(value 2 - Alice second value)");
// console.log("ans=", ans, "\t(Answer = x+y?)");
// console.log("======Encrypted values============");
console.log("g^x=", Math.pow(g, x) % n);
console.log("g^xbyinput=", hash_x_input);
console.log("g^input=", hash_input);
console.log("multipled", (hash_input * hash_x_input) % n);

// console.log("g^y=", Math.pow(g, y) % n);

// console.log("======zkSnark====================");
// console.log("E1=", E1);
// console.log("E2=", E2);
// console.log("E3=", E3);
// if (E2 == E3) {
//   console.log("Alice has proven she knows the sum is ", ans);
// } else {
//   console.log("Alice has proven she does not know the sum is ", ans);
// }
