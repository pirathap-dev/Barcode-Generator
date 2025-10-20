import bcrypt from 'bcrypt';

export function loadUsersFromEnv() {
    const users = new Map();

    // Production users with hashed passwords
    const hashedPairs = (process.env.USERS || '').split(',').filter(Boolean);
    for (const pair of hashedPairs) {
        const [u, hash] = pair.split(':');
        if (u && hash) users.set(u.trim(), { hash: hash.trim() });
    }

    // Dev plaintext users (auto-hashed at boot)
    const plainPairs = (process.env.PLAINTEXT_USERS || '').split(';').filter(Boolean);
    for (const pair of plainPairs) {
        const [u, p] = pair.split(':');
        if (u && p) users.set(u.trim(), { hash: bcrypt.hashSync(p.trim(), 10) });
    }
    return users;
}
