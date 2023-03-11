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
const from = "0x66fe4806cD41BcD308c9d2f6815AEf6b2e38f9a3";
const to = "0xC41672E349C3F6dAdf8e4031b6D2d3d09De276f9";
const tokenId = 100;

const transaction = async () => {
  const a = await contract.callStatic.requirementFunction(8000);
  console.log(a);
};

const merkleHash = (inputDoc) => {
  const leaves = inputDoc.map((x) => SHA256(x));
  const tree = new MerkleTree(leaves, SHA256);
  const root = tree.getRoot().toString("hex");
  const leaf = SHA256("1000");
  const proof = tree.getProof(leaf);
  console.log(" Merkle tree : " + tree.verify(proof, leaf, root)); // true
  // perdersonCommit(root);
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

  // const hashRoot = merkleHash(inputDoc);
  // const commitment = perdersonCommit(hashRoot);
  // console.log(commitment);
  // if (commitment === commitmentUser) {
  // console.log("commitment matched ");
  // }
};
//transaction();
//merkleHash(inputDoc);

const commitmentUser = user(inputDoc);
// console.log("Commitment:");
// console.log(commitmentUser);
certifier(commitmentUser);
