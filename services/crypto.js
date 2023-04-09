const Crypto = require("../models/Crypto");

async function getAllCrypto() {
  return Crypto.find().populate("owner").lean();
}

async function getCryptoById(id) {
  return Crypto.findById(id).populate("owner").lean();
}

async function createCrypto(cryptoData) {
  const crypto = new Crypto(cryptoData);

  await crypto.save();

  return crypto;
}

async function editCrypto(id, cryptoData) {
  const crypto = await Crypto.findById(id);

  crypto.name = cryptoData.name;
  crypto.imageUrl = cryptoData.imageUrl;
  crypto.price = cryptoData.price;
  crypto.description = cryptoData.description;
  crypto.payment = cryptoData.payment;

  return crypto.save();
}

async function deleteCrypto(id) {
  return Crypto.findByIdAndDelete(id);
}

async function buyCrypto(cryptoId, userId) {
  const crypto = await Crypto.findById(cryptoId);

  crypto.boughtBy.push(userId);

  return crypto.save();
}

module.exports = {
  getAllCrypto,
  getCryptoById,
  createCrypto,
  editCrypto,
  deleteCrypto,
  buyCrypto
};
