import { httpServerHandler } from 'cloudflare:node';
import app from './app.js';

export default httpServerHandler(app.listen(3000));
