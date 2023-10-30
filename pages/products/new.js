// import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <div className="px-8 py-8 border rounded">
        <div className="mb-4">
          <h1 className="font-bold text-xl">New Product</h1>
          <p className="text-gray-400 font-medium">Enter details for the new product</p>
        </div>
        <ProductForm />
      </div>
    </Layout>
  );
}
