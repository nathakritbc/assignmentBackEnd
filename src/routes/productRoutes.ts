import express from "express";
import {
  createItem,
  findAllItems,
  findItemById,
  updateItemById,
  removeItemById,
} from "../controllers/productController";

const router = express.Router();

router.post("/", createItem);
router.get("/", findAllItems);
router.get("/:id", findItemById);
router.put("/:id", updateItemById);
router.delete("/:id", removeItemById);

export default router;
