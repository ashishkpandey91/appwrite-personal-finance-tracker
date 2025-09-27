const _CONF = {
  APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
  APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  APPWRITE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  APPWRITE_BUCKET_ID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
  TINYMCE_API_KEY: import.meta.env.VITE_TINYMCE_API_KEY,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
};

// export default conf;

const CONF = {
  get: (key: keyof typeof _CONF): string => {
    const value = _CONF[key];

    if (!value) {
      console.error(`Environment variable ${key} not found`);
    }

    return value;
  },
};

Object.freeze(CONF);
export default CONF;
