const { ethers, providers } = require("ethers");
require("dotenv").config();
const { abi } = require("../artifacts/contracts/Req.sol/Req.json");
const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");
const Pedersen = require("simple-js-pedersen-commitment");

let hrstart = process.hrtime();
const contractAddress = "0x42D9A54221aDAf22d01629F3D5f1E203cC124149";
let pederson = new Pedersen(
  "925f15d93a513b441a78826069b4580e3ee37fc5",
  "959144013c88c9782d5edd2d12f54885aa4ba687"
);
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const signer = new ethers.Wallet(
  "7238bcd2b5ec01dd347d3d0ff0a92633fc5ee1b6b12986fba8d2a89083f1f01b",
  providers.getDefaultProvider(
    "https://eth-goerli.g.alchemy.com/v2/1fypRVHc0bJNqGLM1YcDnwyXmk8M15y8"
  )
);
const secret = pederson.newSecret();

const contract = new ethers.Contract(contractAddress, abi, signer);
const inputDoc = ["Balance", "of", "X", "is", "1001"];
const input = "1001";
const transaction = async (input) => {
  const a = await contract.callStatic.requirementFunction(input);
  console.log(a);
};

let g = crypto.randomInt(100),
  h = crypto.randomInt(100),
  v = 6,
  x = 0xffffff;

const merkleHash = (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  return root;
};

function h_hash(value) {
  return crypto.createHash("sha256").update(value.toString()).digest("hex");
}

const homomorphicHash = (inputDoc) => {
  const hash_x = inputDoc.map(h_hash);
  return crypto.createHash("sha256").update(hash_x.join(",")).digest("hex");
};

function stringToNumber(str) {
  const hash = crypto.createHash("sha256").update(str).digest();
  const num = hash.readUIntBE(0, 6);
  const remainder = num % 101;
  return remainder;
}
const homomorphicHide = (inputDoc) => {
  const data = inputDoc.map(stringToNumber);
  const gToThePowerX = data.map((x) => g ** x % 101);
  return crypto
    .createHash("sha256")
    .update(gToThePowerX.join(","))
    .digest("hex");
};

const perdersonCommit = (hash) => {
  console.log("Hash......");
  console.log(hash);
  console.log(secret);

  const commitment = pederson.commit(hash, secret);

  const result = pederson.verify(hash, [commitment], secret);
  console.log("Result........");
  console.log(result);

  return commitment;
};

const user = (inputDoc) => {
  const hashRoot = merkleHash(inputDoc);
  const commitment = perdersonCommit(hashRoot);
  return commitment;
};

const user_h_hash = (inputDoc) => {
  const h_hash = homomorphicHash(inputDoc);
  const commitment = perdersonCommit(h_hash);
  return commitment;
};

const user_h_hide = (inputDoc) => {
  const h_hide = homomorphicHide(inputDoc);
  const commitment = perdersonCommit(h_hide);
  return commitment;
};

const certifier = async (commitmentUser) => {
  console.log("Before signing......");
  console.log(commitmentUser);

  commitmentUser = commitmentUser.map((c) =>
    crypto.privateEncrypt(privateKey, Buffer.from(c, "utf8")).toString("base64")
  );

  console.log("After signing......");
  console.log(commitmentUser);

  // commitmentUser = commitmentUser.map((c) =>
  //   crypto.publicDecrypt(publicKey, Buffer.from(c, "base64")).toString()
  // );

  // console.log("After decrypting......");
  // console.log(commitmentUser);
  const tx = await contract.setCommitment(commitmentUser);
  const receipt = await tx.wait();
  // console.log(receipt);
  console.log("receipt done...");
};

//Check Proof
const generateProofMerkleTree = async (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  console.log("Root......");
  console.log(root);
  console.log(secret);

  const commitment = pederson.commit(root, secret);
  console.log("commitment.....");
  console.log(commitment);
  const signedCommitmentFromContract =
    await contract.callStatic.getCommitment();
  console.log("signed commitment from contract.....");
  console.log(signedCommitmentFromContract);
  const decryptedCommitment = signedCommitmentFromContract.map((c) =>
    crypto.publicDecrypt(publicKey, Buffer.from(c, "base64")).toString()
  );
  console.log("Decrypted commitment from contract.....");
  console.log(decryptedCommitment);
  const result = pederson.verify(root, [decryptedCommitment], secret);
  console.log("Result2........");
  console.log(result);
  const commitmentVerified = true;
  // const commitmentVerified = decryptedCommitment[0] === commitment[0] && decryptedCommitment[1] === commitment[1]
  const leaf = SHA256("1001");
  const proof = tree.getProof(leaf);
  const isVerified = tree.verify(proof, leaf, root);
  return isVerified && commitmentVerified;
};

const check = function (hashCheck) {
  x = hashCheck;
  const c = h * ((x * g) | (x * h) | (v * g) | (v * h));
  const r = v - x * c;

  const check1 = v * g;
  const check2 = r * g + c * (x * g);

  const check3 = v * h;
  const check4 = r * h + c * (x * h);
  if (check1 == check2 && check3 == check4) return true;
  else return false;
};

const zeroKnowledgeProof = (hash) => {
  let isCheck = true;
  const smallerParts = hash.match(/.{1,2}/g).map((e) => Number("0x" + e));
  for (let index = 0; index < smallerParts.length; index++) {
    const hashPart = smallerParts[index];
    if (!check(hashPart)) {
      isCheck = false;
      break;
    }
  }
  return isCheck;
};

async function usingMerkleTree() {
  const commitmentUser = user(inputDoc);
  // const commitUser_h_hash = user_h_hash(inputDoc);
  console.log("Commitment h_hash:", commitmentUser);
  await certifier(commitmentUser);
  await transaction(parseInt(inputDoc[4]));
  console.log("Zero knowledge proof:");
  const result = await zeroKnowledgeProof(merkleHash(inputDoc));
  console.log("ZKP", result);
  console.log("Merkle tree proof:");
  console.log(await generateProofMerkleTree(inputDoc));

  hrend = process.hrtime(hrstart);

  console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
}

async function homomorphicHashProof(inputDoc) {
  const h_hashOfx = homomorphicHash(inputDoc).toString();
  const commitment = perdersonCommit(h_hashOfx);
  console.log("commitment.....");
  console.log(commitment);
  const signedCommitmentFromContract =
    await contract.callStatic.getCommitment();
  console.log("signed commitment from contract.....");
  console.log(signedCommitmentFromContract);
  const decryptedCommitment = signedCommitmentFromContract.map((c) =>
    crypto.publicDecrypt(publicKey, Buffer.from(c, "base64")).toString()
  );
  console.log("Decrypted commitment from contract.....");
  console.log(decryptedCommitment);
  const result = pederson.verify(h_hashOfx, [decryptedCommitment], secret);
  console.log("Result2........");
  console.log(result);
  const indexToRemove = inputDoc.indexOf(input);
  if (indexToRemove !== -1) {
    inputDoc.splice(indexToRemove, 1);
  }
  const updatedHomomorphicHash = inputDoc.map(h_hash);
  console.log("Hash of x:", h_hashOfx); // h(x) -> from blockchain
  const hashOfInput = h_hash(input);
  console.log("hash of input", hashOfInput); // h(input) -> shared by user
  console.log("update homomorphic hash", updatedHomomorphicHash); // h(x/input) ) -> shared by user
  updatedHomomorphicHash.push(hashOfInput);
  const checkupdatedHomomorphicHash = crypto
    .createHash("sha256")
    .update(updatedHomomorphicHash.join(","))
    .digest("hex")
    .toString();
  return h_hashOfx === checkupdatedHomomorphicHash;
}

async function homomorphicHideProof(inputDoc) {
  const h_hideOfx = homomorphicHide(inputDoc).toString();
  const commitment = perdersonCommit(h_hideOfx);
  console.log("commitment.....");
  console.log(commitment);
  const signedCommitmentFromContract =
    await contract.callStatic.getCommitment();
  console.log("signed commitment from contract.....");
  console.log(signedCommitmentFromContract);
  const decryptedCommitment = signedCommitmentFromContract.map((c) =>
    crypto.publicDecrypt(publicKey, Buffer.from(c, "base64")).toString()
  );
  console.log("Decrypted commitment from contract.....");
  console.log(decryptedCommitment);
  const result = pederson.verify(h_hideOfx, [decryptedCommitment], secret);
  console.log("Result2........");
  console.log(result);
  const indexToRemove = inputDoc.indexOf(input);
  if (indexToRemove !== -1) {
    inputDoc.splice(indexToRemove, 1);
  }
  const updatedHomomorphicHide = inputDoc.map(stringToNumber);
  const gToThePowerXslashInput = updatedHomomorphicHide.map(
    (x) => g ** x % 101
  ); // shared by user
  console.log("Hash of x:", h_hideOfx); // h(x) -> from blockchain
  const gToThePowerInput = g ** stringToNumber(input) % 101; // shared by user

  console.log("hash of input", gToThePowerInput); // h(input) -> shared by user
  console.log("update homomorphic hash", gToThePowerXslashInput); // h(x/input) ) -> shared by user
  gToThePowerXslashInput.push(gToThePowerInput);
  const checkupdatedHomomorphicHash = crypto
    .createHash("sha256")
    .update(gToThePowerXslashInput.join(","))
    .digest("hex")
    .toString();
  return h_hideOfx === checkupdatedHomomorphicHash;
}
async function usingHomomorphicHash() {
  const commitmentUser = user_h_hash(inputDoc);
  console.log("Commitment h_hash:", commitmentUser);
  await certifier(commitmentUser);
  await transaction(parseInt(inputDoc[4]));
  console.log("Zero knowledge proof:");
  const result = await zeroKnowledgeProof(homomorphicHash(inputDoc).toString());
  console.log("ZKP", result);
  console.log("Homomorphic Hash proof:");
  console.log(await homomorphicHashProof(inputDoc));

  // hrend = process.hrtime(hrstart);

  // console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
}

async function usingHomomorphicHiding() {
  const commitmentUser = user_h_hide(inputDoc);
  console.log("Commitment h_hide:", commitmentUser);
  await certifier(commitmentUser);
  await transaction(parseInt(inputDoc[4]));
  console.log("Zero knowledge proof:");
  const result = zeroKnowledgeProof(homomorphicHide(inputDoc).toString());
  console.log(result);
  console.log("Homomorphic Hash proof:");
  console.log(await homomorphicHideProof(inputDoc));

  // hrend = process.hrtime(hrstart);

  // console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1] / 1000000);
}

async function main(params) {
  //usingMerkleTree();
  usingHomomorphicHash();
  //usingHomomorphicHiding();
}

main();
