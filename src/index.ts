import './types/index'
import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
const port = 3500;
import path from "path";
import logger from "./config/logger";
import dbConnection from "./config/dbConnection";
import router from './router'
import session from "express-session";


//Connect to the database
dbConnection();

//load environments variables

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
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


