require('dotenv').config();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: 'uploads',
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;
var cors = require('cors');
app.use(cors());

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:500000}));
global.InsertModel = require('./OrmModels/InsertModel.js');
global.DeleteModel = require('./OrmModels/DeleteModel.js');
global.UpdateModel = require('./OrmModels/UpdateModel.js');
global.ViewQueryModel = require('./OrmModels/ViewQueryModel.js');
global.InsertOrUpdateModel = require('./OrmModels/InsertOrUpdateModel.js');
global.QueryJSONModel = require('./OrmModels/QueryJSONModel.js');
global.QueryStringModel = require('./OrmModels/QueryStringModel.js');
global.ormContainer = require('./ormContainer')(
    'postgres',
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_HOST,
    process.env.DB_PORT,
);

var swaggerUi = require('swagger-ui-express'),swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', express.Router());

require('./controllers/developerController')(app, upload);
require('./controllers/projectController')(app, upload);
require('./controllers/evaluationController')(app);
require('./controllers/authController')(app);

app.listen(port, () =>console.log(`Example app listening on port ${port}!`));