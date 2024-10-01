const router = require('express').Router();

const registerController = require('~/controllers/RegisterController');

const { authenticateUser } = require('~/middlewares/authMiddleware');

router.all('*', authenticateUser);

router.get('/', registerController.get);
router.post('/', registerController.create);
router.put('/:id', registerController.update);
router.delete('/:id', registerController.delete);

module.exports = router;
