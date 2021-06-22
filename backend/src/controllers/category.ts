import { Sequelize } from 'sequelize';

import createController from './createController';
import * as validators from '../validators/category';
import Category from '../models/category';

export const create = createController(
  async (_req, res) => {
    const { inputBody } = res.locals;

    const category = await Category.create({ name: inputBody.name });
    res.json({ message: 'Categrory created successfully.', category });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.create
    },
    inputs: ['name']
  }
);

export const update = createController(
  async (req, res) => {
    const { id } = req.params;
    const { inputBody } = res.locals;

    await Category.update({ name: inputBody.name }, { where: { id } });

    const updatedCategory = await Category.findByPk(id);

    res.json({ category: updatedCategory });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.update
    },
    inputs: ['name']
  }
);

export const list = createController(
  async (req, res) => {
    const { page: rawPage, itemsPerPage: rawItemsPerPage } = req.query;
    const { sort: rawSortBy, order: rawOrder } = req.query;

    let page = 1;
    let itemsPerPage = 10;
    let sortBy = 'createdAt';
    let order = 'ASC';
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

    console.log(sortBy, order);
    const query = {};

    const categories = await Category.findAll({
      where: query,
      order: [[Sequelize.literal(sortBy), order]],
      offset: (page - 1) * itemsPerPage,
      limit: itemsPerPage
    });

    const totalCategories = await Category.count({ where: query });

    res.json({
      page,
      itemsPerPage,
      categories,
      lastPage: Math.ceil(totalCategories / itemsPerPage)
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

    await Category.destroy({ where: { id } });

    res.json({ message: 'Categroy deleted successfully.', category: { id } });
  },
  {
    validation: {
      asObject: true,
      throwError: true,
      validators: validators.remove
    }
  }
);
