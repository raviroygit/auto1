/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  useState } from "react";

import { Card, CardContent, CardHeader } from "./ui/card";

import { Separator } from "./ui/separator";
import {  getCompanyInfo } from "../apis/api";

import { Building2 } from "lucide-react";

export default function CompanyInfo() {

  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean | false>(false);
  const [resData, setResData] = useState<string>("");

  const handleGenerate = async () => {
    try {

      setResData("");

      if(!input){
        alert("Input is required, Please enter or paste your tex!");
        return;
      }
      setIsGenerating(true);
      const result = await getCompanyInfo(input);
      setResData(result);
      setIsGenerating(false);
    } catch (err: any) {
      setIsGenerating(false);
    }
  };

  return (
    <>
   
        <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-3xl w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Extract Company information's
            </h2>
            <textarea
              value={input}
              placeholder="Paste your Text here..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-60 font-mono text-sm bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 resize-none"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={isGenerating}
                onClick={handleGenerate}
                className={`w-full text-white px-4 py-2 rounded-md transition ${
                  isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                }`}
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
            <Separator />
            <Card className="min-h-[40%] max-h-full flex justify-center align-middle flex-col ">
              {isGenerating && !resData ? (
                <>
                  <div className="flex justify-center h-full items-center bg-white">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                <>
                  {resData && (
                    <>
                      <CardHeader className="flex-row font-bold  ">
                        <Building2 className="me-2 w-4" />
                        Company information's
                      </CardHeader>
                      <CardContent>{resData}</CardContent>
                    </>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
    </>
  );
}
