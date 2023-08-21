import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarsData1692629210189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE cars (
        id SERIAL PRIMARY KEY,
        license_plate VARCHAR(255) NOT NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO cars (license_plate) VALUES ('FL-029-RF'), ('BC18351'), ('AC17361'), ('BH18251'), ('AA30021');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE cars;`);
  }
}
