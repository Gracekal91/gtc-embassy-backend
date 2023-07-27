import './types/index'
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const port = 3500;
import path from "path";
import logger from "./config/logger";
import dbConnection from "./config/dbConnection";
import router from './router'



//Connect to the database
dbConnection();

//load environments variables


app.use(cors({
    credentials: true
}));

app.use(express.static('public'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', router());
//Landing page
app.get('/', (req: Request, res: Response) =>{
    logger.info('access home page successfully')
    res.sendFile('index.html', {root: 'public'})
});


//Handle 404 - match any other routes except the defined ones
app.get('*', (req: Request, res: Response) =>{
    logger.debug('page not found')
    res.sendFile('404.html', {root: 'public'})
});

const server = http.createServer(app);
server.listen(port, () =>{
    console.log(`server is running on http://localhost:${port}`)
});


