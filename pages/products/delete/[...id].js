import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push("/products");
  }
  async function deleteProduct() {
    try {
      const response = await axios.delete("/api/products?id=" + id);
      if (response) {
        toast.success("Product Deleted successfully", { Duration: 3000 });
        goBack();
      }
    } catch (error) {
      toast.error(`Something went wrong ${error}`, { Duration: 3000 });
    }
  }
  return (
    <Layout>
      <p className="text-center text-lg font-medium mb-4">
        Do you really want to delete &nbsp;&quot;{productInfo?.title}&quot;?
      </p>
      <div className="flex gap-2 justify-center">
        <button onClick={deleteProduct} className="btn-red">
          YES
        </button>
        <button className="btn-default" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}
