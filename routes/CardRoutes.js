const router = require('express').Router();

const CardController = require('../controllers/CardController');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.post('/create', verifyToken, CardController.create);
router.get('/mycards', verifyToken, CardController.getAllUserCards);
router.get('/:id', CardController.getCardById);
router.delete('/:id', verifyToken, CardController.removeCardById);
router.patch('/:id', verifyToken, CardController.updateCard);


module.exports = router;
