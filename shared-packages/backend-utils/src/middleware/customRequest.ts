import { Request } from 'express';
import { TokenData } from '@competition-manager/schemas';
import { TFunction } from "i18next";

export interface CustomRequest extends Request {
    t: TFunction<"translation", undefined>;
    user?: TokenData;
}