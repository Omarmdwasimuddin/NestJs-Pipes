import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MynameController } from './myname/myname.controller';

@Module({
  imports: [],
  controllers: [AppController, MynameController],
  providers: [AppService],
})
export class AppModule {}
