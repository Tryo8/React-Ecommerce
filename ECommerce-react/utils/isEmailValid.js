import dns from "dns/promises";

// basic syntax check
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function isEmailValid(email) {
    if (!EMAIL_REGEX.test(email)) return false;

    const domain = email.split("@")[1];

    try {
        const mxRecords = await dns.resolveMx(domain);
        return mxRecords && mxRecords.length > 0;
    } catch {
        return false;
    }
}
