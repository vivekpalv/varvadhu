import jwt, { Secret } from 'jsonwebtoken';
import { APP } from './constants';

const JWT_SECRET: Secret = APP.JWT_SECRET as Secret;
const JWT_EXPIRATION: number = APP.JWT_EXPIRATION;

export const signToken = (id: string, roles: string[]): string => {
    const token = jwt.sign({id: id, roles: roles}, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    return token;
};

export const extractRoles = (token: string): string[] => {
    const decoded = jwt.verify(token, JWT_SECRET) as { roles: string[] };
    return decoded.roles;
};

export const extractId = (token: string): string => {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
}