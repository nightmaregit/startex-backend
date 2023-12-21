const  express  = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./route');
const router = require('./routes/index.js');
const multer = require('multer');
const path = require('path');
const db = require ("./config/Database.js");
const dotenv = require("dotenv");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize");

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

dotenv.config();

const PORT = 3102
const app = express();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


app.use(session({
    secret:process.env.SESS_SECRET,
    resave: false,
    store: store,
    saveUninitialized: true,
    cookie:{
        secure: 'auto'
    }
}));

const bisa = {
    credentials: true,
    origin: "http://localhost:5173",
    allowedHeaders : "Content-Type",
    methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus:200,
    
};
app.use(cors(bisa));
app.use(express.json());
app.use(bodyParser.json());
app.use(router);
app.use(route);



//  store.sync();

app.listen(PORT,()=>console.log(`server is running http://localhost:${PORT}`));