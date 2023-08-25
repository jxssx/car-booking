import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tariffs1692954251334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE tariffs (
        interval TEXT PRIMARY KEY,
        price INTEGER
    );
    `);

    // В условии последний тариф указан для 18-29 дней, но на следующей строке написано, что максимальный срок аренды - 30 дней.
    // Предположу, что для 30 дня тариф такой же, как для 29.
    await queryRunner.query(`
      INSERT INTO tariffs (interval, price)
      VALUES ('1-4', 1000),
      ('5-9', 950),
      ('10-17', 900),
      ('18-30', 850);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tariffs;`);
  }
}
