const router = require("express").Router();
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");
const user = require("../services/user");

router.get("/catalog", async (req, res) => {
  const cryptos = await req.storage.getAllCrypto();

  res.render("catalog", { cryptos });
});

router.get("/create", (req, res) => {
  res.render("create");
});

router.post("/create", isUser(), async (req, res) => {
  try {
    const cryptoData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      payment: req.body.payment,
      owner: req.user,
    };

    await req.storage.createCrypto(cryptoData);

    res.redirect("/crypto/catalog");
  } catch (err) {
    console.log(err.message);

    const ctx = {
      errors: parseError(err),
      cryptoData: {
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        payment: req.body.payment,
      },
    };
    res.render("create", ctx);
  }
});

router.get("/details/:id", isUser(), async (req, res) => {
  const crypto = await req.storage.getCryptoById(req.params.id);

  crypto.isOwner = req.user && req.user._id == crypto.owner._id;
  crypto.isNotOwner = req.user && req.user._id != crypto.owner._id;
  crypto.bought = req.user && crypto.boughtBy.find((u) => u == req.user._id);

  res.render("details", { crypto });
});

router.get("/edit/:id", isUser(), async (req, res) => {
  try {
    const crypto = await req.storage.getCryptoById(req.params.id);

    res.render("edit", { crypto });
  } catch (err) {
    console.log(err.message);
    res.redirect("/crypto/details/" + req.params.id);
  }
});

router.post("/edit/:id", isUser(), async (req, res) => {
  try {
    await req.storage.editCrypto(req.params.id, req.body);
    res.redirect("/crypto/details/" + req.params.id);
  } catch (err) {
    const ctx = {
      errors: parseError(err),
      crypto: {
        _id: req.params.id,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        description: req.body.description,
        payment: req.body.payment,
      },
    };
    res.render("edit", ctx);
  }
});

router.get("/delete/:id", async (req, res) => {
  try {
    await req.storage.deleteCrypto(req.params.id);
    res.redirect("/crypto/catalog");
  } catch (err) {
    console.log(err.message);
    res.redirect("/crypto/details/" + req.params.id);
  }
});

router.get("/buy/:id", isUser(), async (req, res) => {
  try {
    //const buy = await req.storage.getGameById(req.params.id);

    //console.log('User',req.user)
    await req.storage.buyCrypto(req.params.id, req.user._id);

    res.redirect("/crypto/details/" + req.params.id);
  } catch (err) {
    console.log("Éroor", err.message);
    res.redirect("/crypto/details/" + req.params.id);
  }
});

module.exports = router;
