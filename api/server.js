import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express'
import { connectDB } from './configs/connectDB.js';
import userRoute from './routes/userRoute.js';
import sellerRoute from './routes/sellerRoute.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js';
import addressRoute from './routes/addressRoute.js';
import orderRoute from './routes/orderRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import { stripeWebhooks } from './controllers/orderController.js';


const app = express()
const port = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// Middlwares
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/user', userRoute);
app.use('/api/seller', sellerRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRoute);
app.use('/api/order', orderRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
