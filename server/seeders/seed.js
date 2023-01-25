import sequelize from '../config/connection.js';
import { User } from '../models/index.js';

//Import require to ensure importing .json files works in various node versions
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UserSeedData = require('./UserSeedData.json');


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const response = await User.bulkCreate(UserSeedData);

  process.exit(0);
};

seedDatabase();
