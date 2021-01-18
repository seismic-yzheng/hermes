export async function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}
