const router = require('express').Router();

const PaymentController = require('~/controllers/PaymentController');

// [GET] /Rating
router.get('/total', PaymentController.getPayments);

module.exports = router;
