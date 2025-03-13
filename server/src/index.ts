import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
import './app';
import { server } from "./utils/Socket"; // Import `server`
import { connectDB } from "./db/connectDb";

// Start the server after successful DB connection
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Error connecting to the database: ${err.message}`);
    process.exit(1);
  });
