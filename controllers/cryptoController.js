const router = require("express").Router();
const { isUser } = require("../middlewares/guards");
const { parseError } = require("../util/parsers");
const user = require("../services/user");

router.get('/catalog', async(req,res)=>{
    const cryptos = await req.storage.getAllCrypto();

    res.render('catalog', {cryptos});
})

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

router.get('/details', async(req,res)=>{
  res.render('details')
})

module.exports = router;
