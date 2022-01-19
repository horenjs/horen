/**
 * test the string is email or not
 * @param s email string be validated
 * @param opts allowDot: if allow . in the name
 * @returns boolean
 */
export default function isEmail(s: string, opts?: {
    allowDot: boolean;
}): boolean;
