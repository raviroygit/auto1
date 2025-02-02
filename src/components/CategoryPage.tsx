/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  addCategory,
  addSubCategory,
  getCategories,
  updateCategory,
  updateSubCategory,
} from "../apis/api";

interface Category {
  id: string;
  name: string;
  prompt: string;
}

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  prompt: string;
}

export default function CategoryPage() {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | any>(
    null
  );
  const [categoryPrompt, setCategoryPrompt] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    SubCategory | any
  >(null);
  const [subCategoryPrompt, setSubCategoryPrompt] = useState("");

  // State for new category/subcategory
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPrompt, setNewCategoryPrompt] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState("");
  const [newSubCategoryPrompt, setNewSubCategoryPrompt] = useState("");

  // Dynamic categories and subcategories state
  const [categories, setCategories] = useState<Category[]>([]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories.categories);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const category: any = categories.find((c: any) => c._id === categoryId);
    if (category) {
      setSubCategories(category?.subCategories);
      setSelectedCategory(category);
      setCategoryPrompt(category.prompt);
      setSelectedSubCategory(null);
      setSubCategoryPrompt("");
    }
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    const category: any = categories.find(
      (c: any) => c._id === selectedCategory._id
    );
    const subCategory = category?.subCategories.find(
      (sc: any) => sc?._id === subCategoryId
    );
    if (subCategory) {
      setSelectedSubCategory(subCategory);
      setSubCategoryPrompt(subCategory.prompt);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: newCategoryName.trim(),
      prompt: newCategoryPrompt.trim(),
    };

    setCategories([...categories, newCategory]);
    setShowAddCategoryModal(false);
    setNewCategoryName("");
    setNewCategoryPrompt("");

    await addCategory(newCategoryName.trim(), newCategoryPrompt.trim());
    await fetchCategories();
    alert("category added successfully");
  };

  const handleAddSubCategory = async () => {
    if (
      !selectedCategory ||
      !newSubCategoryName.trim()
    ) {
      alert("Please fill in all fields and select a category");
      return;
    }

    const newSubCategory: SubCategory = {
      id: (subCategories.length + 1).toString(),
      name: newSubCategoryName.trim(),
      categoryId: selectedCategory._id,
      prompt: newSubCategoryPrompt.trim(),
    };

    setSubCategories([...subCategories, newSubCategory]);
    setShowAddSubCategoryModal(false);
    setNewSubCategoryName("");
    setNewSubCategoryPrompt("");
    await addSubCategory(
      newSubCategoryName.trim(),
      newSubCategoryPrompt.trim(),
      selectedCategory._id
    );
    await fetchCategories();
    alert("Sub category added successfully");
  };

  const handleSaveCategory = async () => {
    if (selectedCategory) {
      const updatedCategories = categories.map((cat: any) =>
        cat._id === selectedCategory._id
          ? { ...cat, prompt: categoryPrompt }
          : cat
      );
      setCategories(updatedCategories);
      await updateCategory(selectedCategory._id, categoryPrompt);
      alert("Category updated successfully!");
    }
  };

  const handleSaveSubCategory =async () => {
    if (selectedSubCategory) {
      const updatedSubCategories = subCategories.map((subCat: any) =>
        subCat._id === selectedSubCategory?._id
          ? { ...subCat, prompt: subCategoryPrompt }
          : subCat
      );
      setSubCategories(updatedSubCategories);
      await updateSubCategory(selectedSubCategory?._id,subCategoryPrompt)
      alert("Subcategory updated successfully!");
    }
  };

  const resetModals = () => {
    setNewCategoryName("");
    setNewCategoryPrompt("");
    setNewSubCategoryName("");
    setNewSubCategoryPrompt("");
  };

  return (
    <div className=" w-full flex min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="w-[75%] p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            UPDATE CATEGORY
          </h1>

          <div className="space-y-6">
            {/* Category Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <button
                onClick={() => {
                  resetModals();
                  setShowAddCategoryModal(true);
                }}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add New Category
              </button>

              <div className="flex gap-4 mb-4">
                <select
                  value={selectedCategory?._id || ""}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveCategory}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  SAVE
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Prompt
                </label>
                <textarea
                  value={categoryPrompt}
                  onChange={(e) => setCategoryPrompt(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category prompt here..."
                />
              </div>
            </div>

            {/* Sub-Category Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category Name
              </label>
              <button
                onClick={() => {
                  resetModals();
                  setShowAddSubCategoryModal(true);
                }}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add New Subcategory
              </button>

              <div className="flex gap-4 mb-4">
                <select
                  value={selectedSubCategory?._id || ""}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Subcategory</option>
                  {subCategories
                    .filter(
                      (subCat) =>
                        selectedCategory &&
                        subCat.categoryId === selectedCategory._id
                    )
                    .map((subCat: any) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleSaveSubCategory}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  SAVE
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Category Prompt
                </label>
                <textarea
                  value={subCategoryPrompt}
                  onChange={(e) => setSubCategoryPrompt(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subcategory prompt here..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-[50%] p-8 bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Category
          </h2>
          <select
            value={selectedCategory?._id || ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Sub-Category List
          </h2>
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <div className="space-y-3">
              {subCategories
                .filter(
                  (subCat) =>
                    !selectedCategory ||
                    subCat.categoryId === selectedCategory._id
                )
                .map((subCat: any) => (
                  <div
                    key={subCat._id}
                    className={`bg-gray-50 rounded-lg shadow-sm p-4 cursor-pointer transition-all duration-200 ${
                      selectedSubCategory?._id === subCat._id
                        ? "border-2 border-blue-500 bg-blue-50"
                        : "border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                    onClick={() => handleSubCategoryChange(subCat._id)}
                  >
                    <p className="font-medium text-gray-800">{subCat.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Category</h2>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter new category name"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <textarea
                  value={newCategoryPrompt}
                  onChange={(e) => setNewCategoryPrompt(e.target.value)}
                  placeholder="Enter category prompt"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Sub Category</h2>
              <button
                onClick={() => setShowAddSubCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-white rounded-lg mb-4">
              <select
                value={selectedCategory?._id || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder="Enter new Sub category name"
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <textarea
                  value={newSubCategoryPrompt}
                  onChange={(e) => setNewSubCategoryPrompt(e.target.value)}
                  placeholder="Enter Sub category prompt"
                  rows={4}
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddSubCategoryModal(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
