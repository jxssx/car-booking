import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bookings1692775466409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Не создаем референс в carId т.к. cars в реальности были бы отдельным сервисом
    await queryRunner.query(`
        CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        car_id INTEGER,
        start_date TIMESTAMP with time zone,
        end_date TIMESTAMP with time zone,
        rental_cost DECIMAL(10, 2)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE bookings;`);
  }
}
