const tourController  = require("../../controllers/client/tour");

app.get('/tours', tourController.list)