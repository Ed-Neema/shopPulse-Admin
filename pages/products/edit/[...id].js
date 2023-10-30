/**
 *  when you create a file with the name [...id].js, it means that you are creating a dynamic route with catch-all routes.

The [] brackets indicate that the id parameter is dynamic, meaning that it can be any value. The ... before the id parameter indicates that it can match multiple segments of a URL.

For example, if you have a URL like /products/edit/1/2/3, the id parameter would be an array containing the values ['1', '2', '3'].

This feature is useful when you have pages that require dynamic routing, such as product pages or blog posts, where the URL structure may vary depending on the content.
 */

import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    try {
      axios.get("/api/products?id=" + id).then((response) => {
        setProductInfo(response.data);
      });
    } catch (error) {
      toast.error(`Something went wrong ${error}`, { Duration: 3000 });
    }
  }, [id]);
  return (
    <Layout>
      <h1 className="font-bold text-xl">Edit product</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </Layout>
  );
}
