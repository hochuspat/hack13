import { useState } from 'react';
import dynamic from 'next/dynamic';
import mammoth from 'mammoth';
import 'react-quill/dist/quill.snow.css'; 
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const ReactQuill = dynamic(import('react-quill'), {
  ssr: false,
});

export default function EditorPage() {
  const [editorContent, setEditorContent] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (!file) return;
  
    const reader = new FileReader();
  
    if (file.type === "application/pdf") {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
  
      reader.onload = async (event) => {
        try {
          const pdf = await pdfjsLib.getDocument(event.target.result).promise;
          let text = "";
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ");
          }
          
          setEditorContent(text);
        } catch (error) {
          console.error("Error reading PDF:", error);
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      reader.onload = (event) => {
        mammoth.convertToHtml({ arrayBuffer: event.target.result })
          .then(displayResult)
          .catch(handleError);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const displayResult = (result) => {
    setEditorContent(result.value);
  };
  
  const handleError = (error) => {
    console.error("Error converting DOCX:", error);
  };
 

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".docx,.pdf" />
      <ReactQuill value={editorContent} onChange={setEditorContent} />
    </div>
  );
}
