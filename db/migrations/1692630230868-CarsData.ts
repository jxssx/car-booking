import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarsData1692629210189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(255) NOT NULL,
        license_plate VARCHAR(255) NOT NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO cars (brand, license_plate) VALUES ('Toyota', 'FL-029-RF'), ('Audi', 'BC18351'), ('BMW', 'AC17361'), ('Volkswagen', 'BH18251'), ('Opel', 'AA30021');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE cars;`);
  }
}
