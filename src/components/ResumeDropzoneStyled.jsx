import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, CheckCircle, Trash2 } from 'lucide-react';

const ResumeDropzoneStyled = ({ onFileSelected, defaultFile }) => {
  const [file, setFile] = useState(defaultFile || null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        onFileSelected(uploadedFile);
      }
    },
    [onFileSelected]
  );

  const removeFile = () => {
    setFile(null);
    onFileSelected(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 2 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-slate-800 font-semibold">
        <FileText className="w-4 h-4" />
        Upload Resume <span className="text-red-500">*</span>
      </label>

        <div
  {...getRootProps()}
  role="button"
  tabIndex={0}
  aria-label="Resume upload area"
  className={`rounded-lg border-2 border-dashed p-4 text-center transition bg-white/70 ${
    isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
  }`}
>

        <input {...getInputProps()} />
        {!file ? (
          <p className="text-sm text-gray-600">
            Drag & drop a resume here, or click to select
          </p>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <p className="text-green-600 text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Selected: <span className="text-green-700 font-bold underline">{file.name}</span>
            </p>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 text-xs flex items-center gap-1 hover:underline"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDropzoneStyled;
