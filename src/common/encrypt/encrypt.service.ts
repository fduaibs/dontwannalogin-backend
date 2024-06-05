import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptService {
  constructor(private configService: ConfigService) {}

  async aesEncrypt(dataToEncrypt: string, fixed?: boolean): Promise<string> {
    if (!dataToEncrypt) throw new UnprocessableEntityException('Erro ao criar senha');

    const iv = fixed ? Buffer.from(this.configService.get<string>('CRYPTO_AES_IV')) : randomBytes(16);

    const password = this.configService.get<string>('CRYPTO_AES_PASSWORD');

    const salt = this.configService.get<string>('CRYPTO_AES_SALT');

    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const encryptedData = Buffer.concat([cipher.update(dataToEncrypt), cipher.final()]);

    const encryptedDataAsBase64 = encryptedData.toString('base64');
    const ivAsBase64 = iv.toString('base64');

    return `${encryptedDataAsBase64}.${ivAsBase64}`;
  }

  async aesDecrypt(token: string): Promise<string> {
    if (!token) throw new UnprocessableEntityException('Erro ao validar');

    const [dataToDecryptAsBase64, ivAsBase64] = token.split('.');

    const password = this.configService.get<string>('CRYPTO_AES_PASSWORD');

    const salt = this.configService.get<string>('CRYPTO_AES_SALT');

    const ivAsBuffer = Buffer.from(ivAsBase64, 'base64');

    const encryptedDataAsBuffer = Buffer.from(dataToDecryptAsBase64, 'base64');

    const key = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    const decipher = createDecipheriv('aes-256-ctr', key, ivAsBuffer);

    const decryptedData = Buffer.concat([decipher.update(encryptedDataAsBuffer), decipher.final()]);

    return decryptedData.toString('utf-8');
  }

  async bCryptHash(plainText: string): Promise<string> {
    const saltOrRounds = Number(this.configService.get<number>('BCRYPT_ROUNDS'));

    if (!plainText || !saltOrRounds) throw new UnprocessableEntityException('Erro ao criar senha');

    const hash = await bcrypt.hash(plainText, saltOrRounds);

    return hash;
  }

  async bCryptMatch(plainText: string, hash: string): Promise<boolean> {
    if (!plainText || !hash) throw new UnprocessableEntityException('Erro ao validar senha');

    const isMatch = await bcrypt.compare(plainText, hash);

    return isMatch;
  }
}
