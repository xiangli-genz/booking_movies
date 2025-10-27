const router = require("express").Router();
const multer = require('multer');

const settingController = require("../../controllers/admin/setting.controller");

const cloudinaryHelper = require("../../helpers/cloudinary.helper");

const upload = multer({ storage: cloudinaryHelper.storage});

router.get("/list", settingController.list);

router.get("/website-info", settingController.websiteInfo);

router.patch(
  '/website-info', 
  upload.fields(
    [
      { name: 'logo', maxCount: 1 },
      { name: 'favicon', maxCount: 1 }
    ]
  ),
  settingController.websiteInfoPatch
)


module.exports = router;