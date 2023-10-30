import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import toast from "react-hot-toast";
import {Spinner} from "./Spinner";
import { ReactSortable } from "react-sortablejs";
const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      axios.get("/api/categories").then((result) => {
        setCategories(result.data);
      });
    } catch (error) {
      toast.error(`Something went wrong ${error}`, { Duration: 3000 });
    }
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    if (!title) return toast.error("Please enter a title", { Duration: 3000 });
    if (!description)
      return toast.error("Please enter a description", { Duration: 3000 });
    if (!price) return toast.error("Please enter a price", { Duration: 3000 });
    if (!images.length)
      return toast.error("Please add at least one image", { Duration: 3000 });
    if (!category)
      return toast.error("Please select a category", { Duration: 3000 });

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // if this form is called from edit, then there should be an _id along with other data sent with it
      //update
      try {
        await axios.put("/api/products", { ...data, _id });
        toast.success("Product Updated successfully", { Duration: 3000 });
      } catch (error) {
        toast.error(`Something went wrong ${error}`, { Duration: 3000 });
      }
    } else {
      //create
      try {
        await axios.post("/api/products", data);
        toast.success("Product Added successfully", { Duration: 3000 });
      } catch (error) {
        toast.error(`Something went wrong ${error}`, { Duration: 3000 });
      }
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  //   upload to cloudinary
  async function uploadImages(ev) {
    try {
      const files = ev.target?.files;
      if (files?.length > 0) {
        setIsUploading(true);
        const data = new FormData();
        for (const file of files) {
          data.append("file", file);
        }
        const res = await axios.post("/api/upload", data);
        setImages((oldImages) => {
          return [...oldImages, ...res.data.urls];
        });
        setIsUploading(false);
      }
    } catch (error) {
      setIsUploading(false);
      toast.error(`Error uploading image: ${error}`, { Duration: 3000 });
    }
  }
  //   console.log(images);
  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }
  const propertiesToFill = [];
  //   adding both the properties of the category and its parent categories
  //This code block is a conditional statement that checks if there are categories available and if a category has been selected. If both conditions are true, it retrieves the properties of the selected category and its parent categories and pushes them into the propertiesToFill array.
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo) {
      propertiesToFill.push(...(catInfo.properties || [])); // Ensure catInfo.properties is an array
      while (catInfo.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo.parent._id
        );
        if (parentCat) {
          propertiesToFill.push(...(parentCat.properties || [])); // Ensure parentCat.properties is an array
          catInfo = parentCat;
        } else {
          break; // Exit the loop if parentCat is not found
        }
      }
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        className="rounded-md"
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      {/* category */}

      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {/* properties to fill */}

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0]?.toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

      {/* Photos */}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-md bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="Enter product description"
        className="rounded-md"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        className="rounded-md"
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
};

export default ProductForm;
