/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Building2, ListChecks, Package, Star, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  deleteFileById,
  generateResponse,
  getCategories,
  getFileBySubCategoryId,
  updateSubCategory,
  uploadFiles,
} from "../apis/api";

interface FileItem {
  name: string;
  _id: string;
}

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

interface TestOutput {
  request_id: string;
  data: {
    category_name: string;
    subcategory_name: string;
    user_input: {
      title: string;
      company_name: string;
      description: string;
      features: string;
      attributes: Array<{ [key: string]: string }>;
      reviews: string[];
    };
  };
}

function LoadingState() {
  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent className=" flex justify-center items-center">
        Please wait while generating result
        <div className="flex justify-center items-center bg-gray-100">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ManageSamples() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompt, setPrompt] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [unUploadedFiles, setUnUploadedFiles] = useState<any>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    SubCategory | any
  >(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | any>(
    null
  );
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [testOutput, setTestOutput] = useState<TestOutput>({
    request_id: "Enter request id",
    data: {
      category_name: "Enter Category name",
      subcategory_name: "Enter sub-Category name",
      user_input: {
        title: "Enter Title",
        company_name: "Enter company name",
        description: "This is the description of the scrapped data",
        features: "we will have features here that we found from scrapped data",
        attributes: [
          { key1: "value1" },
          { key2: "value2" },
          { key3: "value3" },
          { key4: "value4" },
        ],
        reviews: [
          "user review 1",
          "user review 2",
          "user review 3",
          "user review 4",
          "user review 5",
          "user review 6",
          "user review 7",
        ],
      },
    },
  });
  const [isGenerating, setIsGenerating] = useState<boolean | false>(false);
  const [resData, setResData] = useState<any>(null);

  // Update testOutput when category or subcategory changes
  useEffect(() => {
    setTestOutput((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        category_name: selectedCategory?.name || "Enter category",
        subcategory_name: selectedSubCategory?.name || "Enter sub category",
      },
    }));
  }, [selectedCategory, selectedSubCategory]);

  const fetchCategories = async () => {
    const categories = await getCategories();
    setCategories(categories.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    await updateSubCategory(selectedSubCategory?._id, prompt);
    alert("sub category prompt updated successfully");
    // Handle save logic
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: any = e.target.files;
    console.log("files", files[0]);
    if (files) {
      const newFiles = Array.from(files).map((file: any) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
      }));
      setUploadedFiles([...unUploadedFiles, ...newFiles]);
      setUnUploadedFiles([...unUploadedFiles, files[0]]);
    }
  };

  const handleCancel = () => {};

  const handleUploadFiles = async () => {
    await uploadFiles(unUploadedFiles, selectedSubCategory._id);
    const files = await getFileBySubCategoryId(selectedSubCategory._id);
    console.log("files", files.files);
    setUploadedFiles(files.files);
    alert("File uploaded successfully");
  };

  const handleDeleteFile = async (fileId: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file._id !== fileId));

    await deleteFileById(fileId);
    alert("File Delete successfully");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const res = await generateResponse(testOutput);
    setResData(res);
    setIsGenerating(false);
  };

  const handleTestOutputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      const newValue = JSON.parse(e.target.value);
      setTestOutput(newValue);
    } catch (error: any) {
      // If JSON is invalid, don't update the state
      console.error("Invalid JSON format", error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category: any = categories.find((c: any) => c._id === categoryId);
    if (category) {
      setSubCategories(category?.subCategories);
      setSelectedCategory(category);
      setSelectedSubCategory(null);
    }
  };

  const handleSubCategoryChange = async (subCategoryId: string) => {
    const category: any = categories.find(
      (c: any) => c._id === selectedCategory._id
    );
    const subCategory = category?.subCategories.find(
      (sc: any) => sc?._id === subCategoryId
    );
    console.log(subCategoryId, "subCategory", subCategory);
    if (subCategory) {
      const files = await getFileBySubCategoryId(subCategoryId);
      setUploadedFiles(files.files);
      setSelectedSubCategory(subCategory);
      setPrompt(subCategory.prompt);
    }
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* Left Column - 75% */}
      <div className="w-[60%] p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            INGEST GOLDEN SAMPLES
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <select
                value={selectedCategory?._id}
                onChange={(e: any) => handleCategoryChange(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat?._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Sub-Category
              </label>
              <select
                value={selectedSubCategory?._id}
                onChange={(e: any) => handleSubCategoryChange(e.target.value)}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subcategory</option>
                {selectedCategory &&
                  subCategories?.map((subCat: any) => (
                    <option key={subCat.id} value={subCat?._id}>
                      {subCat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub-Category Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter subcategory prompt here..."
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              SAVE
            </button>

            {/* Available Files Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-[150px] flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Available Files
              </h2>
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {uploadedFiles?.map((file: any) => (
                    <div
                      key={file?._id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <span className="text-gray-700 w-[300px]">
                        {file?.name}
                      </span>
                      <button
                        onClick={() => handleDeleteFile(file?._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-gray-50 p-4 rounded-md text-center border-2 border-dashed border-gray-300">
                <p className="text-gray-600">
                  SELECT FILES (.doc, .docx, .pdf and .txt are allowed)
                </p>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf,.txt"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="mt-2 inline-block cursor-pointer text-blue-600 hover:text-blue-800"
                >
                  Choose files
                </label>
              </div>
            </div>

            <div className="flex justify-start space-x-4 mt-4">
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                CANCEL
              </button>
              <button
                onClick={handleUploadFiles}
                style={{ backgroundColor: "#6F42C1" }}
                className=" text-white px-6 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - 25% */}
      <div className="w-[40%] p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            TEST OUTPUT
          </h2>
          <textarea
            value={JSON.stringify(testOutput, null, 2)}
            onChange={handleTestOutputChange}
            className="w-full h-[300px] font-mono text-sm bg-gray-50 border border-gray-200 rounded-md p-4 mb-4"
          />
          <button
            disabled={isGenerating}
            onClick={handleGenerate}
            style={{ backgroundColor: isGenerating ? "gray" : "green" }}
            className="w-full text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>
        {/* {resData.data.category_name} */}
        {resData && !isGenerating ? (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{resData?.data?.category_name}</span>
                <span>/</span>
                <span>{resData?.data?.subcategory_name}</span>
              </nav>

              {/* Main Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h1 className="text-3xl font-bold tracking-tight">
                        {resData?.data?.user_input?.title}
                      </h1>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        <span>{resData?.data?.user_input?.company_name}</span>
                      </div>
                    </div>
                    <Badge className="text-sm">
                      {resData?.data?.subcategory_name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Description */}
                  <div>
                    <p className="text-lg text-muted-foreground">
                      {resData?.data?.user_input?.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Features */}
                  {resData.data?.user_input?.features && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <ListChecks className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Key Features</h2>
                      </div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resData.data?.user_input &&
                          Array.isArray(resData.data?.user_input?.features) &&
                          resData.data?.user_input?.features?.map(
                            (feature: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <Package className="h-4 w-4 text-primary" />
                                <span>{feature.trim()}</span>
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                  )}

                  <Separator />

                  {/* Attributes */}
                  {testOutput?.data?.user_input?.attributes && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Specifications</h2>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">
                              Attribute
                            </TableHead>
                            <TableHead>Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {/* {JSON.stringify(testOutput.data.user_input.attributes)} */}
                          {/* {testOutput.data.user_input.attributes?.map(
                            (attribute: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {JSON.stringify(attribute.name)}
                                </TableCell>
                                <TableCell>
                                  {typeof attribute.value === "object"
                                    ? JSON.stringify(attribute.value, null, 2) // Convert object to a string
                                    : attribute.value || "N/A"}
                                </TableCell>
                              </TableRow>
                            )
                          )} */}

                          {testOutput.data.user_input.attributes.map((attribute, index) => {
                            // Extract the key and value from the attribute object
                            const [key, value] = Object.entries(attribute)[0];
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  {key}
                                </TableCell>
                                <TableCell>
                                  {value}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <Separator />

                  {/* Reviews */}
                  <></>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        Customer Reviews
                      </h2>
                    </div>
                    {/* {resData.data?.user_input?.reviews?.length > 0 ? ( */}
                    <div className="space-y-4">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-muted-foreground">
                            {resData.data?.user_input?.reviews}
                          </p>
                        </CardContent>
                      </Card>
                      {/* {resData.data?.user_input?.reviews?.map(
                          (review: string, index: number) => (
                            <Card key={index}>
                              <CardContent className="pt-6">
                                <p className="text-muted-foreground">
                                  {review}
                                </p>
                              </CardContent>
                            </Card>
                          )
                        )} */}
                    </div>
                    {/* ) : (
                      <p className="text-muted-foreground">No reviews yet.</p>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          isGenerating && (
            <div className="min-h-screen bg-gray-50 p-6">
              <div className="max-w-4xl mx-auto space-y-8">
                <LoadingState />
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
