const { client } = require("../lib/redis");

const getOrSetCache = async (key, fetchFn, options = {}) => {
  const { ttl = 60 } = options;

  try {
    const cached = await client.get(key);
    if (cached) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn(`Redis GET failed for key ${key}:`, err);
  }

  // Fetch fresh data from DB
  const freshData = await fetchFn();

  try {
    await client.setEx(key, ttl, JSON.stringify(freshData));
    console.log(`Cache set for key: ${key} with TTL: ${ttl}s`);
  } catch (err) {
    console.warn(`Redis SET failed for key ${key}:`, err);
  }

  return freshData;
};


const deleteByPattern = async (pattern) => {
  const keys = [];

  for await (const key of client.scanIterator({ MATCH: pattern })) {
    const k = Array.isArray(key) ? key[0] : key;
    if (typeof k === "string" && k) keys.push(k);
  }

  if (!keys.length) {
    console.log(`No valid keys found for pattern: ${pattern}`);
    return;
  }

  console.log(`Deleting ${keys.length} keys:`, keys);
  await client.del(keys);
};

module.exports = {
  getOrSetCache,
  deleteByPattern,
};