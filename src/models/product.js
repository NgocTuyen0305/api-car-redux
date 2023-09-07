import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    price: Number,
    images: String,
    persons: Number,
    calendar: Number,
    petrol: String,
    anchor: String,
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true, versionKey: false }
);
productSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productSchema)