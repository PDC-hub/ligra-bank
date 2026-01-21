/* src/LocalFileService.js */
const LocalFileService = {
  storageKey: 'ligra_bank_data',

  async init() {
    // kept for API compatibility
    return;
  },

  async load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('LocalFileService.load error', err);
      return null;
    }
  },

  async save(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('LocalFileService.save error', err);
      throw err;
    }
  },

  async clear() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (err) {
      console.error('LocalFileService.clear error', err);
    }
  }
};

export default LocalFileService;