import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GridLoader } from "@/components/Spinner";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    try {
      setIsLoading(true);
      axios.get("/api/products").then((response) => {
        setProducts(response.data);
      });
      setIsLoading(false);
    } catch (error) {
      toast.error(`Something went wrong ${error}`, { Duration: 3000 });
    }
  }, []);
  // console.log(products)
  return (
    <Layout>
      <Link className="btn-primary whitespace-nowrap" href={"/products/new"}>
        Add new product
      </Link>
      {isLoading ? (
        <div className="h-24 flex items-center">
          <GridLoader />
        </div>
      ) : (
        <table className="basic mt-4 min-h-fit overflow-auto">
          <thead>
            <tr className="font-semibold">
              <td>Product name</td>
              <td>Description</td>
              <td>Price</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {products.map((product) => (
              <tr key={product._id} className="border-b border-b-gray-100">
                <td>{product.title}</td>
                <td className="truncate line-clamp-2 w-72">
                  {product.description}
                </td>
                <td>${product.price}</td>
                <td className="gap-2">
                  <Link
                    className="btn-default my-1  w-24 flex items-center justify-center"
                    href={"/products/edit/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                      <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    className="btn-red  w-24 flex items-center justify-center"
                    href={"/products/delete/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
