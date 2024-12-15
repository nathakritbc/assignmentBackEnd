import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import { sysDB } from "./config/database";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger.json";

const corsOptions = {
  // origin: "http://192.168.1.30:8080",
};

const app = express();
const port = process.env.PORT || 6060;

// initialize database
sysDB();

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors(corsOptions));
app.use(compression());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// ใช้ Morgan สำหรับการ log
app.use(morgan("combined"));

// initialize swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req: any, res: any) => {
  res.json({ message: "Welcome to JenosizeAssignmentBackEnd application." });
});

// initialize routes
routes(app);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
