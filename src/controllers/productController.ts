import ProductService from "../services/productService";
import { ProductSchema, ProductDto } from "../dtos/productDto";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { UUID } from "crypto-js";
import { ApiResponse } from "../types/ApiResponse";

const createItem = async (req: Request, res: Response) => {
  try {
    const id = uuid();
    const payload: ProductDto = {
      id,
      ...req.body,
    };

    // validate input
    const productData: ProductDto = ProductSchema.parse(payload);
    const item: ProductDto = await ProductService.createItem(productData);

    const response: ApiResponse<ProductDto> = {
      status: StatusCodes.CREATED,
      result: item,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.CREATED).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || "create product found",
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

const findAllItems = async (req: Request, res: Response) => {
  try {
    const { query } = req;
    const items = await ProductService.findAllItems(query);
    const response: ApiResponse<ProductDto[]> = {
      status: StatusCodes.OK,
      result: items,
      message: "SUCCESS",
      error: false,
      meta: {
        total_records: items.length,
        page: 1,
        page_size: items.length,
      },
    };
    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || "find  all products found",
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

const findItemById = async (req: Request, res: Response) => {
  const { id }: { id: UUID } = req.params as { id: UUID };
  try {
    const item: ProductDto = await ProductService.findItemById(id);

    const response: ApiResponse<ProductDto> = {
      status: StatusCodes.OK,
      result: item,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || `find  by id ${id} not found`,
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

const updateItemById = async (req: Request, res: Response) => {
  const { id }: { id: UUID } = req.params as { id: UUID };

  try {
    const payload: ProductDto = { ...req.body };
    const item: any = await ProductService.updateItemById(id, payload);
    const response: ApiResponse<ProductDto> = {
      status: StatusCodes.OK,
      result: item,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || `update product by id ${id} not found`,
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

const removeItemById = async (req: Request, res: Response) => {
  const { id }: { id: UUID } = req.params as { id: UUID };
  try {
    await ProductService.removeItemById(id);

    const response: ApiResponse<any> = {
      status: StatusCodes.OK,
      result: `remove product by id ${id} success`,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.OK).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || `remove product by id ${id} not found`,
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

export {
  createItem,
  findAllItems,
  findItemById,
  updateItemById,
  removeItemById,
};
