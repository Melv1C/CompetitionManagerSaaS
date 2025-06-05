import { TokenData$ } from "@competition-manager/schemas";
import { jwtDecode } from "jwt-decode";


export const decodeToken = (token: string) => {
    const decoded = jwtDecode(token);
    const tokenParsed = TokenData$.safeParse(decoded);
    if (tokenParsed.success) {
        return tokenParsed.data;
    }
    return 'NOT_LOGGED';
};