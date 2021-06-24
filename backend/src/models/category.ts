import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index';

export interface CategoryAttributes {
  id: string;
  name: string;
}

/*
  We have to declare the ProductCreationAttributes to
  tell Sequelize and TypeScript that the property id,
  in this case, is optional to be passed at creation time
*/
export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

export interface CategoryInstance
  extends Model<CategoryAttributes, CategoryCreationAttributes>,
    CategoryAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const Category = sequelize.define<CategoryInstance>('Category', {
  id: {
    allowNull: false,
    autoIncrement: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    type: DataTypes.UUID
  },
  name: {
    allowNull: true,
    type: DataTypes.TEXT
  }
});

export default Category;
