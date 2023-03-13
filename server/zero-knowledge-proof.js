var CryptoJS = require("crypto-js");
const SHA256 = require("crypto-js/sha256");
const { MerkleTree } = require("merkletreejs");
const crypto = require("crypto");

const inputDoc = ["Balance", "of", "X", "is", "1000"];
const shared_G = CryptoJS.SHA256("Random shared g").toString(CryptoJS.enc.Hex);
const shared_H = CryptoJS.SHA256("Random shared h").toString(CryptoJS.enc.Hex);

var hash2 = CryptoJS.SHA256("World");

const bitwiseAND = (hash1, hash2) => {
  var bin1 = BigInt("0x" + hash1).toString(2);
  var bin2 = BigInt("0x" + hash2).toString(2);

  bin1 = bin1.padStart(256, "0");
  bin2 = bin2.padStart(256, "0");

  var bin3 = "";
  for (var i = 0; i < 256; i++) {
    bin3 += bin1[i] & bin2[i];
  }
  var hash3 = BigInt("0b" + bin3).toString(16);
  return hash3;
};

const bitwiseOR = (hash1, hash2) => {
  var bin1 = BigInt("0x" + hash1).toString(2);
  var bin2 = BigInt("0x" + hash2).toString(2);

  bin1 = bin1.padStart(256, "0");
  bin2 = bin2.padStart(256, "0");

  var bin3 = "";
  for (var i = 0; i < 256; i++) {
    bin3 += bin1[i] | bin2[i];
  }
  var hash3 = BigInt("0b" + bin3).toString(16);
  return hash3;
};

const subtract = (hash1, hash2) => {
  let dec1 = parseInt(hash1, 36);
  let dec2 = parseInt(hash2, 36);
  let result = dec1 - dec2;
  let hash3 = crypto
    .createHash("sha256")
    .update(result.toString())
    .digest("hex");
  return hash3;
};

const add = (hash1, hash2) => {
  let dec1 = parseInt(hash1, 36);
  let dec2 = parseInt(hash2, 36);
  let result = dec1 + dec2;
  let hash3 = crypto
    .createHash("sha256")
    .update(result.toString())
    .digest("hex");
  return hash3;
};

const merkleHash = (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  return root;
};
const h = merkleHash(inputDoc);

console.log(h);
// const xG = bitwiseAND(h, shared_G);
// const xH = bitwiseAND(h, shared_H);

// const v = CryptoJS.SHA256("Secret value").toString(CryptoJS.enc.Hex);
// const vG = bitwiseAND(v, shared_G);
// const vH = bitwiseAND(v, shared_H);

// const c = bitwiseAND(shared_H, bitwiseOR(vH, bitwiseOR(vG, bitwiseOR(xG, xH))));

// const r = subtract(v, bitwiseAND(h, c));

//Check proof

// const rG = bitwiseAND(r, shared_G);
// const check_vG = add(rG, bitwiseAND(c, xG));

// console.log(vG);
// console.log(check_vG);
