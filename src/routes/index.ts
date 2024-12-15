import productRoutes from "../routes/productRoutes";
import authRoutes from "../routes/authRoutes";
import auth from "../middlewares/auth";

export const apiV1 = "/api/v1";

export default (app: any) => {
  app.use(`${apiV1}/products`, auth, productRoutes); 
  app.use(`${apiV1}/auth`, authRoutes);
};
