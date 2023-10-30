import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  // await isAdminRequest(req, res);

  if (method === "GET") {
    try {
      if (req.query?.id) {
        res.json(await Product.findOne({ _id: req.query.id }));
      } else {
        res.json(await Product.find());
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "POST") {
    try {
      const { title, description, price, images, category, properties } =
        req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,
      });
      res.status(201).json(productDoc);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "PUT") {
    try {
      const { title, description, price, images, category, properties, _id } =
        req.body;
      await Product.updateOne(
        { _id },
        { title, description, price, images, category, properties }
      );
      res.json(true);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  if (method === "DELETE") {
    try {
      if (req.query?.id) {
        await Product.deleteOne({ _id: req.query?.id });
        res.json(true);
      }
    } catch (error) {
        res.status(500).json(error);
    }
  }
}
