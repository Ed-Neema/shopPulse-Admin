import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import toast from "react-hot-toast";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    try {
      fetchCategories();
    } catch (error) {
      toast.error(`Something went wrong ${error}`, { Duration: 3000 });
    }
  }, []);
  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    if (!name) return toast.error("Please enter a name", { Duration: 3000 });
    if (!properties.length)
      return toast.error("Please enter at least one property", {
        Duration: 3000,
      });

    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","), //creates an array of values from the comma separated string
      })),
    };
    if (editedCategory) {
      try {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
        setEditedCategory(null);
        toast.success("Category Updated successfully", { Duration: 3000 });
      } catch (error) {
        toast.error(`Something went wrong ${error}`, { Duration: 3000 });
      }
    } else {
      try {
        await axios.post("/api/categories", data);
        toast.success("Category Added successfully", { Duration: 3000 });
      } catch (error) {
        toast.error(`Something went wrong ${error}`, { Duration: 3000 });
      }
    }
    //reset the form
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","), //creates a comma separated string from the array of values
      }))
    );
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#e02424",
        reverseButtons: true,
      })
      .then(async (result) => {
        try {
          if (result.isConfirmed) {
            const { _id } = category;
            await axios.delete("/api/categories?_id=" + _id);
            fetchCategories();
            toast.success("Category Deleted!", { Duration: 3000 });
          }
        } catch (error) {
          toast.error(`Something went wrong ${error}`, { Duration: 3000 });
        }
      });
  }
  //when add new property button is clicked
  //   clicking the "Add new property" button, a new property object is added to the properties array. This object has a name and values property. The name property is used to store the name of the property (example: color) and the values property is used to store the values of the property (example: red, blue, green). The values property is a string of comma-separated values. This is done so that we can easily convert it to an array of values when we need to save the category.
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }
  //   updates the name attribute of the property at the specified index with the new name newName.
  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  //   updates the values attribute of the property at the specified index with the new values newValues
  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  //   removes the property at the specified index from the properties array.
  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label className="text-base font-semibold text-primary">
        {editedCategory
          ? `Edit category: ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form className="mt-4" onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        {/* properties */}
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default  text-sm my-2"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                  placeholder="property name (example: color)"
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  type="button"
                  className="btn-red"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      <div className="border border-gray-200 w-full my-8" />
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="btn-default mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className="btn-red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
