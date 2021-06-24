import { Sequelize } from 'sequelize';

import createController from './createController';
import * as validators from '../validators/product';
import Product from '../models/product';

export const create = createController(
  async (_req, res) => {
    const { inputBody } = res.locals;

    const product = await Product.create({
      name: inputBody.name,
      price: inputBody.price,
      image: inputBody.image,
      categoryId: inputBody.categoryId
    });
    res.json({ message: 'Product created successfully.', product });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.create
    },
    inputs: ['name', 'price', 'image', 'categoryId']
  }
);

export const update = createController(
  async (req, res) => {
    const { id } = req.params;
    const { inputBody } = res.locals;

    await Product.update(
      { name: inputBody.name, price: inputBody.price },
      { where: { id } }
    );

    const updatedProduct = await Product.findByPk(id);

    res.json({ product: updatedProduct });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.update
    },
    inputs: ['name', 'price']
  }
);

export const list = createController(
  async (req, res) => {
    const { page: rawPage, itemsPerPage: rawItemsPerPage } = req.query;
    const {
      sort: rawSortBy,
      order: rawOrder,
      category: rawCategory
    } = req.query;

    let page = 1;
    let itemsPerPage = 10;
    let sortBy = 'createdAt';
    let order = 'ASC';
    let category: string | undefined = undefined;

    if (typeof rawPage === 'string') {
      page = parseInt(rawPage);
    }
    if (typeof rawItemsPerPage === 'string') {
      itemsPerPage = parseInt(rawItemsPerPage);
    }
    if (typeof rawSortBy === 'string') {
      sortBy = rawSortBy;
    }
    if (typeof rawOrder === 'string') {
      order = rawOrder.toLowerCase() === 'a' ? 'ASC' : 'DESC';
    }
    if (typeof rawCategory === 'string' && rawCategory !== '') {
      category = rawCategory;
    }

    console.log(sortBy, order);
    let query: { [key: string]: any } = {};

    if (category) {
      query['categoryId'] = category;
    }

    const products = await Product.findAll({
      where: query,
      order: [[Sequelize.literal(sortBy), order]],
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage
    });

    const totalProducts = await Product.count({ where: query });

    res.json({
      page,
      itemsPerPage,
      products,
      lastPage: Math.ceil(totalProducts / itemsPerPage)
    });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.list
    }
  }
);

export const remove = createController(
  async (req, res) => {
    const { id } = req.params;

    await Product.destroy({ where: { id } });

    res.json({ message: 'Product deleted successfully.', product: { id } });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.remove
    }
  }
);
