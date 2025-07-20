export function generateEncodedToken(email, expiresInMinutes) {
    const expiry = Date.now() + expiresInMinutes * 60 * 1000;
    const payload = {
        email: email,
        exp: expiry
    };
    const json = JSON.stringify(payload);
    const encoded = btoa(json);
    return encoded;
}

export function decodeToken(encodedToken) {
    try {
        const json = atob(encodedToken); 
        const data = JSON.parse(json);
        return data;
    } catch (e) {
        return null;
    }
}

export function isTokenExpired(token) {
    const data = decodeToken(token);
    if (!data || !data.exp) return true;
    return Date.now() > data.exp;
}
