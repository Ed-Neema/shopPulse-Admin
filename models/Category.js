import mongoose, { model, models, Schema } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Types.ObjectId, ref: "Category" },
  properties: [{ type: Object }],
});

export const Category = models?.Category || model("Category", CategorySchema);

/**
 * The parent field is defined as a mongoose.Types.ObjectId type, which is a unique identifier for a document in a MongoDB database. This field is used to create a hierarchical structure for the categories, where a category can have a parent category. The ref property specifies the name of the model that this field refers to, in this case, the "Category" model.
 *
 */
