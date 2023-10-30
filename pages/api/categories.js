import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
    // await isAdminRequest(req, res);

  if (method === "GET") {
    // Category.find().populate("parent") is used to find all categories and populate the parent field with the actual parent category document. This allows for easier access to the parent category's properties without having to make a separate query.
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    try {
      const { name, parentCategory, properties } = req.body;
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
      });
      res.json(categoryDoc);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  if (method === "PUT") {
    const { name, parentCategory, properties, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    try {
      const { _id } = req.query;
      await Category.deleteOne({ _id });
      res.json("ok");
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
