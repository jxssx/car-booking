import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'car-booking',
  entities: [],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;