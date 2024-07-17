import React, { useCallback, useState } from "react";
import { useDropzone} from "react-dropzone";
import { FaFileUpload } from "react-icons/fa";
import { Button } from "../ui/button";


/**
 * @typedef {Object} FileUploaderProps
 * @property {(files: FileWithPath[]) => void} fieldChange - Function to call when files are dropped.
 * @property {string} [mediaUrl] - Optional media URL for preview.
 */

/**
 * FileUploader component
 * @param {FileUploaderProps} props - Props for the component.
 * @returns {JSX.Element}
 */

//the error may come from here
const FileUploader = ({ fieldChange, mediaUrl }) => {
  const [file, setFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    /**
   * @param {import("react-dropzone").FileWithPath[]} acceptedFiles
   */
    (acceptedFiles) => {
      // Do something with the file
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        //if photo uploaded, show this
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="image"
              className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-top"
            />
          </div>
          <p className="text-center w-full p-4 border-t border-t-dark-4 text-[14px] font-normal leading-[140%]">
            Click or drag photo to replace
          </p>
        </>
      ) : (
        //if no photo upload, show this
        <div className="flex justify-center items-center flex-col p-7 h-80 lg:h-[612px]">
          <FaFileUpload size={100} color="white" />
          <h3 className="text-[16px] text-white font-medium leading-[140%] mb-2 mt-6">
            Drag Photo Here
          </h3>
          <p className="mb-6 text-[14px] text-white font-medium leading-[140%]">
            JPG, JPEG, PNG
          </p>
          <Button className='bg-slate-500'>Select from Computer </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
