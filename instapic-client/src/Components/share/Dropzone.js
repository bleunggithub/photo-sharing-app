import React, { useEffect, useState } from 'react';

import { useDropzone } from 'react-dropzone';

const Dropzone = () => {
  const [instruction, setInstruction] = useState("Drag & drop an image here or Click to select")
  const [filePreview, setFilePreview] = useState("")

  const {getRootProps, getInputProps} = useDropzone({
      accept: 'image/png, image/jpg, image/jpeg, image/gif',
      maxFiles:1,
      onDrop: (acceptedFiles,fileRejections) => {
        if (acceptedFiles.length > 0) {
          setInstruction(`Image Selected: "${acceptedFiles[0].name}"`)
          setFilePreview(URL.createObjectURL(acceptedFiles[0]))
          } else {
            if (fileRejections.length > 0) {
              setInstruction("Only 1 image file (.png/ .jpg/ .jpeg / .gif) is accepted. Please try again.")
            } else {
              setInstruction("An Error has occurred, please try again.")
            }
          }
      }
  });

  useEffect(() => () => {
    return () => URL.revokeObjectURL(filePreview);
  });

  return (
    <div className='dropzone'
      data-testid="dropzone-container"
      style={{
        backgroundImage: `url(${filePreview})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
        <div {...getRootProps({})} direction="column" className="full-w-h-container" data-testid="drop-area">
          <input {...getInputProps()} />
          <h2 className="pl-4 leading-normal text-white">
          <span className="highlightTextDark">{instruction}</span>
          </h2>
        </div>
    </div>
  );
}

export default Dropzone;