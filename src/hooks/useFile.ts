import { FileUploadSelectEvent } from "primereact/fileupload";
import { useState } from "react";

export function useFile() {
  const [size, setSize] = useState(0);

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = size;

    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setSize(_totalSize);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setSize(_totalSize);
  };

  const onTemplateClear = () => {
    setSize(0);
  };

  return {
    size,
    onTemplateClear,
    onTemplateSelect,
    onTemplateUpload,
  };
}
