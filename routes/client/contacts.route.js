const router = require('express').Router();

const contactsController = require("../../controllers/client/contacts.controller");

router.get('/', contactsController.contacts)

module.exports = router;
