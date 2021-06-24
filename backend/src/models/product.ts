import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Category from './category';

export interface ProductAttributes {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string;
}

/*
  We have to declare the ProductCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
export interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'id'> {}

export interface ProductInstance
  extends Model<ProductAttributes, ProductCreationAttributes>,
    ProductAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Product = sequelize.define<ProductInstance>('Product', {
  id: {
    allowNull: false,
    autoIncrement: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.UUID
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING
  }
});

Category.hasMany(Product, {
  sourceKey: 'id',
  foreignKey: 'categoryId',
  as: 'products' // this determines the name in `associations`!
});

Product.belongsTo(Category, {
  targetKey: 'id',
  as: 'category'
});

export default Product;
