const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const memoryDb = {};

const createCollectionFallback = (collectionName) => {
  if (!memoryDb[collectionName]) {
    memoryDb[collectionName] = {};
  }

  return {
    add: async (data) => {
      const id = `mock-${collectionName}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      memoryDb[collectionName][id] = data;
      return { id };
    },
    get: async () => ({
      empty: Object.keys(memoryDb[collectionName]).length === 0,
      forEach: (callback) => {
        Object.entries(memoryDb[collectionName]).forEach(([id, value]) => {
          callback({ id, data: () => value });
        });
      },
    }),
    doc: (id) => ({
      get: async () => {
        const exists = !!memoryDb[collectionName][id];
        return {
          exists,
          id,
          data: () => memoryDb[collectionName][id] || {},
        };
      },
      update: async (updateData) => {
        memoryDb[collectionName][id] = {
          ...(memoryDb[collectionName][id] || {}),
          ...updateData,
        };
      },
      delete: async () => {
        delete memoryDb[collectionName][id];
      },
    }),
  };
};

let db;

try {
  const serviceAccount = require("../serviceAccountKey.json");

  const app = initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase not configured, using in-memory fallback data.");
  db = {
    collection: createCollectionFallback,
  };
}

module.exports = db;
