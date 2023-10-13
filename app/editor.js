// pages/editor.js
import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // import styles

// Импортируем Quill редактор динамически, так как он использует window
const ReactQuill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function EditorPage() {
  const [content, setContent] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setContent(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <ReactQuill value={content} onChange={setContent} />
    </div>
  );
}
