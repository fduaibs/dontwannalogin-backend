import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { SummarizeResponseInterface } from './interfaces/open-ai-response.interface';

@Injectable()
export class OpenAIService {
  constructor(@Inject('OPEN_AI_API_TOKEN') private readonly openAIApi: OpenAI) {}

  private endMessage = '\n\nMe responda somente o texto. Caso o texto tenha tópicos ou bullet points, mantenha a estrutura.';
  private model = 'gpt-3.5-turbo';

  async summarize(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Resuma o texto a seguir: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async highlight(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Destaque pontos importantes do texto a seguir: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async rearrange(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Reorganize as informações do texto a seguir em uma ordem mais coerente: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async explain(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Inclua definições ou explicações adicionais no texto a seguir: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async questionize(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Crie perguntas e respostas de revisão com base no texto a seguir: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async topify(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Transforme o texto a seguir em uma lista de tópicos ou bullet points: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }

  async fix(text: string): Promise<SummarizeResponseInterface> {
    const completion = await this.openAIApi.chat.completions.create({
      messages: [{ role: 'system', content: `Corrija os erros gramaticais e de ortografia no texto a seguir: ${text}${this.endMessage}` }],
      model: this.model,
    });

    return { text: completion.choices[0].message.content };
  }
}
