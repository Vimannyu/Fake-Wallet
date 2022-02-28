const express = require('express');

const apiDataController = require('../controllers/apiData');

const router = express.Router();


router.post('/transaction', apiDataController.createTransaction);

router.get('/userview/:transactionId', apiDataController.getTransaction);

module.exports = router;