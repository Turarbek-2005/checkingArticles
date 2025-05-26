import React from "react";
import axios from "axios"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertCircle, Link2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";

export default function Checking() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<null | {
    font: string;
    fontSize: number;
    wordCount: number;
    mistakes: string[];
    brokenLinks: string[];
    hasReferences: true;
    imageCount: number,
    imagesWithCaption: number
  }>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  }

  async function handleUpload() {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/check`, {
      //   method: "POST",
      //   body: formData,
      //   // headers: {
      //   //   "Content-Type": "multipart/form-data",
      //   // },
      // });

      // const data = await response.json();
      const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/check`,
    formData,

  );

  const data = response.data;
      // Используем данные из ответа сервера
      setResult({
        font: data.font || "Не определено",
        fontSize: data.fontSize || 0,
        wordCount: data.wordCount || 0,
        mistakes: Array.isArray(data.mistakes) ? data.mistakes : [],
        brokenLinks: Array.isArray(data.brokenLinks) ? data.brokenLinks : [],
        hasReferences: data.hasReferences || false,
        imageCount: data.imageCount || 0,
        imagesWithCaption: data.imagesWithCaption || 0,
      });

      // Complete the progress bar
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
      }, 400);
    } catch (err) {
      console.error("Ошибка при отправке:", err);
      setIsUploading(false);
    } finally {
      clearInterval(progressInterval);
    }
  }

  return (
    
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Button className="absolute left-10 top-10"><NavLink to="/auth" className="text-xl">Авторизация</NavLink></Button>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Анализатор документов
          </CardTitle>
          <CardDescription className="text-slate-200">
            Загрузите документ для анализа шрифтов, ошибок и ссылок
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-2">
          <div className="mb-6">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                onChange={handleChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="h-12 w-12 text-slate-400 mb-2" />
                <span className="text-lg font-medium text-slate-700">
                  {file ? file.name : "Выберите файл для загрузки"}
                </span>
                <span className="text-sm text-slate-500 mt-1">
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} МБ`
                    : "PDF, DOC, DOCX или TXT до 10МБ"}
                </span>
              </label>
            </div>

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-500 mb-1">
                  <span>Загрузка...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch border-t pt-4">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="mb-4 py-6"
          >
            <Upload className="mr-2 h-5 w-5" /> Загрузить и анализировать
          </Button>

          {result ? (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Результаты анализа:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">Шрифт</div>
                  <div className="font-medium text-slate-800">
                    {result.font}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">Размер шрифта</div>
                  <div className="font-medium text-slate-800">
                    {result.fontSize} pt
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">Количество слов</div>
                  <div className="font-medium text-slate-800">
                    {result.wordCount}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">
                    Наличие литературы
                  </div>
                  <div className="font-medium text-slate-800">
                    {result.hasReferences ? "Есть" : "Нету"}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">Количество рисунков</div>
                  <div className="font-medium text-slate-800">
                    {result.imageCount}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-md border border-slate-200">
                  <div className="text-sm text-slate-500">Количество подписанных рисунков</div>
                  <div className="font-medium text-slate-800">
                    {result.imagesWithCaption}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h4 className="font-medium text-slate-800">Ошибки:</h4>
                </div>

                {result.mistakes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.mistakes.map((mistake, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                      >
                        {mistake}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Ошибок не обнаружено</p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium text-slate-800">
                    Нерабочие ссылки:
                  </h4>
                </div>

                {result.brokenLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.brokenLinks.map((link, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        {link}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Нерабочих ссылок не обнаружено
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-4">
              Загрузите файл для получения результатов анализа
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
