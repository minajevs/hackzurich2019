const mongoose = require("mongoose");
const { ipcMain } = require("electron");

const shortcutSchema = new mongoose.Schema({
  keys: { type: String, required: true, unique: true },
  countPressed: { type: Number, required: true, default: 1 }
});

let hookHandler = null;

shortcutSchema.post("save", async function callback(doc) {
  return hookHandler && (await hookHandler());
});

shortcutSchema.post("findOneAndUpdate", async function callback(doc) {
  return hookHandler && (await hookHandler());
});

const ShortcutModel = mongoose.model("Shortcut", shortcutSchema);

const save = async model => new ShortcutModel(model).save();

const getShortcutById = async id => ShortcutModel.findOne({ _id: id });

const getAllShortcutsDescending = async () =>
  ShortcutModel.find({}, { _id: 0, keys: 1, countPressed: 1 }).sort({
    countPressed: -1
  });

const increaseCountByOne = async keys =>
  ShortcutModel.findOneAndUpdate(
    { keys },
    { $inc: { countPressed: 1 } },
    { upsert: true, setDefaultsOnInsert: true, useFindAndModify: false }
  );

module.exports = {
  save,
  getShortcutById,
  increaseCountByOne,
  getAllShortcutsDescending,
  attachNewShortcutsEmitter: emitter => {
    hookHandler = async function(doc, next) {
      const shortcuts = await getAllShortcutsDescending();
      console.log(shortcuts);
      emitter(
        shortcuts.map(({ _doc: { countPressed, keys } }) => ({
          countPressed,
          keys
        }))
      );
    };
  },
  shortcutSchema
};
