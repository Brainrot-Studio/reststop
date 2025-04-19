const Datastore = require('@seald-io/nedb');
const path = require('node:path');

module.exports = new class Database {
  constructor() {
    if (Database.instance) return Database.instance;

    const dbPath = path.join(__dirname, 'requestHistory.db');
    console.log('DB file at:', dbPath);

    this.history = new Datastore({ filename: dbPath, autoload: true });
    Database.instance = this;
  }

  async addHistory({ req, res }) {
    const _id = Date.now();
    try {
      await this.history.insertAsync({ _id, date: new Date().toISOString(), req, res });
      return true;
    } catch (err) {
      console.error('Failed to add history:', err);
      return false;
    }
  }

  async getHistory() {
    try {
      return await this.history.findAsync({}).sort({ date: -1 });
    } catch (err) {
      console.error('Failed to get history:', err);
      return [];
    }
  }
};