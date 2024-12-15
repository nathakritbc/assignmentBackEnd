import { Product } from "../models/productModel";
import { ProductDto } from "../dtos/productDto";
import { UUID } from "crypto-js";
import { Op } from "sequelize";

const createItem = async (dto: any) => {
  try {
    const result = await Product.create(dto);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findAllItems = async (query: any = {}) => {
  try {
    // การค้นหาจาก query params ที่ส่งมา
    let where = {
      ...query,
    };

    // การค้นหาจากฟิลด์ทั้งหมดตาม search term
    if (query.search) {
      const searchTerm = query.search.trim();
      delete query.search;
      delete where.search;
      const attributes = Object.keys(Product.rawAttributes);

      // สร้าง condition ที่ใช้ LIKE กับทุกฟิลด์
      const whereCondition = {
        [Op.or]: attributes.map((attribute) => ({
          [attribute]: {
            [Op.like]: `%${searchTerm}%`,
          },
        })),
      };

      where = {
        ...where,
        ...whereCondition,
      };
    }

    const results = await Product.findAll({
      order: [["price", "asc"]],
      where,
    });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findItemById = async (id: UUID) => {
  try {
    const result = await Product.findByPk(id);
    if (!result) {
      throw new Error("product not found");
    }
    return result.dataValues;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateItemById = async (id: UUID, dto: ProductDto) => {
  try {
    let item = await Product.findByPk(id);
    if (!item) {
      throw new Error("product not found");
    }

    const payload: ProductDto = {
      ...item,
      ...dto,
    };

    await Product.update(payload, {
      where: {
        id,
      },
    });

    item = await Product.findByPk(id);

    return item?.dataValues;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const removeItemById = async (id: UUID) => {
  try {
    const item = await Product.findByPk(id);
    if (!item) {
      throw new Error("product not found");
    }

    const result = await Product.destroy({
      where: {
        id,
      },
    });

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const ProductService = {
  createItem,
  findAllItems,
  findItemById,
  updateItemById,
  removeItemById,
};
export default ProductService;
