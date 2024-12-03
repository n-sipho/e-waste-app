import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { errorMorgan, infoMorgan } from "./middlewares/morgan-middleware";
import { errorHandler } from "./utils/error-handler";
import { router } from "./routes";
import { logger } from "./utils/logger";



const app = express();
const PORT = process.env.PORT || 3000;

app.use(errorMorgan);
app.use(infoMorgan);

app.use(express.json());

app.use('/api', router);

app.use(errorHandler);


app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});