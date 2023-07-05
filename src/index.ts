import express, {Request, Response} from 'express';
const app = express();
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const port = 3500;
import path from "path";

app.use(cors({
    credentials: true
}));

app.use(express.static('public'));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) =>{
    res.sendFile('index.html', {root: 'public'})
});

const server = http.createServer(app);
server.listen(port, () =>{
    console.log(`server is running on http://localhost:${port}`)
});
