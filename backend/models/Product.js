import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: [Number], enum: [40,41,42,43,44,45], required: true },
  colors: { type: [String], enum: ["red","black","blue","white"], required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    }
  ],
  category: {
  type: String,
enum: [
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Reebok",
  "Asics",
  "New Balance",

]
,
  required: true
},
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
