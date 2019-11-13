import { AccessNestedObject } from "./common.util";

export function IsAreaHead(user) {
    return AccessNestedObject(user, 'role', []).includes('head')
}