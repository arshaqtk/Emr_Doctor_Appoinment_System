import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    });
});
 