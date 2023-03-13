const { ethers, providers } = require("ethers");
require("dotenv").config();
const { abi } = require("../artifacts/contracts/Req.sol/Req.json");
const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");
const crypto = require("crypto");
const Pedersen = require("simple-js-pedersen-commitment");
const contractAddress = "0x42D9A54221aDAf22d01629F3D5f1E203cC124149";
const pederson = new Pedersen(
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

const contract = new ethers.Contract(contractAddress, abi, signer);
const inputDoc = ["Balance", "of", "X", "is", "1000"];

const transaction = async () => {
  const a = await contract.callStatic.requirementFunction(8000);
  console.log(a);
};
let g = 8,
  h = 4,
  v = 6,
  x = 0xffffff;

const merkleHash = (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  return root;
};

const perdersonCommit = (hash) => {
  const secret = pederson.newSecret();
  const commitment = pederson.commit(hash, secret);
  const result = pederson.verify(hash, [commitment], secret);
  console.log("Pederson commit  : " + commitment);
  return commitment;
};

const user = (inputDoc) => {
  const hashRoot = merkleHash(inputDoc);
  const commitment = perdersonCommit(hashRoot);
  return commitment;
};

const certifier = async (commitmentUser) => {
  commitmentUser.forEach((c) => {
    c = crypto.sign("SHA256", c, privateKey);
  });
  const tx = await contract.setCommitment(commitmentUser);
  const receipt = await tx.wait();
  console.log(receipt);
  const b = await contract.callStatic.getCommitment();
  console.log(b);
};

//Check Proof
const generateProofMerkleTree = (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  const leaf = SHA256("1000");
  const proof = tree.getProof(leaf);
  const isVerified = tree.verify(proof, leaf, root);
  // perdersonCommit(root);
  return isVerified;
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
  const smallerParts = hash.match(/.{1,6}/g).map((e) => Number("0x" + e));
  smallerParts.forEach((hashPart) => {
    if (!check(hashPart)) {
      isCheck = false;
      return;
    }
  });
  if (isCheck) return true;
  else return false;
};

//const commitmentUser = user(inputDoc);
// console.log("Commitment:");
// console.log(commitmentUser);
//console.log(generateProofMerkleTree(inputDoc));
//certifier(commitmentUser);
const result = zeroKnowledgeProof(merkleHash(inputDoc));
console.log(result);
