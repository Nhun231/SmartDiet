export function generateEncodedToken(email, expiresInMinutes) {
    const expiry = Date.now() + expiresInMinutes * 60 * 1000; 
    console.log(expiry)
    const payload = {
        email: email,
        exp: expiry
    };
    console.log('payload',payload);
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
        console.log(e)
        return null;
    }
}

export function isTokenExpired(token) {
    const data = decodeToken(token);
    if (!data || !data.exp) return true;
    return Date.now() > data.exp;
}
