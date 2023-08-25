import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { BookingsModule } from './bookings/bookings.module';

@Module({
    imports: [TypeOrmModule.forRoot(dataSourceOptions), BookingsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
