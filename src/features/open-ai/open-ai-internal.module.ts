import { Module } from '@nestjs/common';
import { OpenAIModule } from '../../services/open-ai/open-ai.module';
import { OpenAIController } from './open-ai.controller';

@Module({
  imports: [OpenAIModule.forRoot()],
  controllers: [OpenAIController],
  providers: [],
})
export class OpenAIInternalModule {}
