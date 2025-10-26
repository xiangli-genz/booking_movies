const router = require("express").Router();

const contactController = require("../../controllers/admin/contact.controller");

router.get("/list", contactController.list);

// single delete (move to trash)
router.patch('/delete/:id', contactController.deletePatch);

// bulk actions (expects { type: 'delete', ids: [...] })
router.patch('/change-multi', contactController.changeMultiPatch);

module.exports = router;