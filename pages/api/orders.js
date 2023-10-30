import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Orders";


export default async function handler(req, res) {
  try {
    await mongooseConnect();
    res.json(await Order.find().sort({ createdAt: -1 }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
