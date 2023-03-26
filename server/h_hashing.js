const hcrypt = require("node-hcrypt");

// Define the string to hash
const str = "Hello World!";

// Convert the string to an integer
const num = parseInt(Buffer.from(str).toString("hex"), 16);

// Perform homomorphic hashing operations
const sum = hcrypt.add(num, 5);
const product = hcrypt.mul(num, 10);

// Convert the result back to a string
const sumStr = Buffer.from(sum.toString(16), "hex").toString();
const productStr = Buffer.from(product.toString(16), "hex").toString();

console.log(`Sum: ${sumStr}`);
console.log(`Product: ${productStr}`);
