const mongoose = require("mongoose");
const toaster = require("../services/toaster");

const shortcutSchema = new mongoose.Schema({
  keys: { type: String, required: true, unique: true },
  countPressed: { type: Number, required: true, default: 1 },
  gesture: { type: String, required: false, default: null }
});

const gestureSchema = new mongoose.Schema({
  direction: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  bindTo: { type: String, required: false }
});

let hookHandler = null;
let gestureHandler = null;

shortcutSchema.post("save", async function callback(doc) {
  return hookHandler && (await hookHandler(doc));
});

shortcutSchema.post("findOneAndUpdate", async function callback(doc) {
  return hookHandler && (await hookHandler(doc));
});

gestureSchema.post(
  "save",
  async doc => gestureHandler && (await gestureHandler())
);
gestureSchema.post(
  "findOneAndUpdate",
  async doc => gestureHandler && (await gestureHandler())
);

const ShortcutModel = mongoose.model("Shortcut", shortcutSchema);
const GestureModel = mongoose.model("Gesture", gestureSchema);

const save = async model => new ShortcutModel(model).save();
const saveGesture = async model => new GestureModel(model).save();

const getShortcutById = async id => ShortcutModel.findOne({ _id: id });

const getAllShortcutsDescending = async () =>
  ShortcutModel.find({}, { _id: 0, keys: 1, countPressed: 1, gesture: 1 }).sort(
    {
      countPressed: -1
    }
  );

const getGestures = async () => GestureModel.find({});

const increaseCountByOne = async keys =>
  ShortcutModel.findOneAndUpdate(
    { keys },
    { $inc: { countPressed: 1 } },
    { upsert: true, setDefaultsOnInsert: true, useFindAndModify: false }
  );

const bindShortcut = async (direction, keys) =>
  ShortcutModel.findOneAndUpdate(
    { keys },
    { gesture: direction },
    { upsert: true, setDefaultsOnInsert: true, useFindAndModify: false }
  );

const unbindShortcut = async direction =>
  ShortcutModel.findOneAndUpdate(
    { gesture: direction },
    { gesture: null },
    { upsert: true, setDefaultsOnInsert: true, useFindAndModify: false }
  );

const bindGesture = async (direction, keys) =>
  GestureModel.findOneAndUpdate(
    { direction },
    { bindTo: keys },
    { upsert: true, setDefaultsOnInsert: true, useFindAndModify: false }
  );

module.exports = {
  save,
  getShortcutById,
  increaseCountByOne,
  getAllShortcutsDescending,
  saveGesture,
  getGestures,
  bindGesture,
  bindShortcut,
  unbindShortcut,

  attachNewShortcutsEmitter: emitter => {
    hookHandler = async function(doc, next) {
      const shortcuts = await getAllShortcutsDescending();
      console.log(shortcuts);
      emitter(
        shortcuts.map(({ _doc: { countPressed, keys, gesture } }) => ({
          countPressed,
          keys,
          gesture
        }))
      );
      doc && (doc.countPressed + 1) % 5 === 0 && toaster.notify()
    };
  },

  attachNewGesturesEmitter: emitter => {
    hookHandler = async function(doc, next) {
      const gestures = await getGestures();
      console.log(gestures);
      emitter(
        gestures.map(({ _doc: { direction, description, bindTo } }) => ({
          direction,
          description,
          bindTo
        }))
      );
    };
  },

  shortcutSchema,
  gestureSchema
};
