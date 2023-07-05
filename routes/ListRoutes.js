const router = require('express').Router();

const ListController = require('../controllers/ListController');

//middlewares
const verifyToken = require('../helpers/verify-token');

router.post('/create', ListController.create);
router.get('/mylists', verifyToken, ListController.getAllUserCards);
router.delete('/:id', verifyToken, ListController.removeListById);
router.patch('/:id', verifyToken, ListController.updateList);

module.exports = router;
