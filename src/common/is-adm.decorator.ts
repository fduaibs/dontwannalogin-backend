import { SetMetadata } from '@nestjs/common';

export const IS_ADM_KEY = 'isAdm';

export const Adm = () => SetMetadata(IS_ADM_KEY, true);
