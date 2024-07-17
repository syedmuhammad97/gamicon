import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils";
import { CgProfile } from "react-icons/cg";

/**
 * @typedef {Object} ProfileUploaderProps
 * @property {(files: File[]) => void} fieldChange - Function to handle field changes.
 * @property {string} mediaURL- The URL of the media.
 */

/**
 * ProfileUploader component
 * @param {ProfileUploaderProps} props - The props for the component.
 * @returns {JSX.Element}
 */
const ProfileUploader = ({ fieldChange, mediaURL }) => {
  const [file, setFile] = useState([]);
  const [fileUrl, setFileUrl] = useState(mediaURL);

  /**
   * Handles the file drop event.
   * @param {File[]} acceptedFiles - The accepted files.
   */
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
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
    <div {...getRootProps()}>
      <input {...getInputProps()} className="cursor-pointer" />

      <div className="cursor-pointer flex justify-center items-center gap-4">
        <img
          src={fileUrl || <CgProfile size={24}/>}
          className="h-24 text-white w-24 rounded-full object-cover object-top"
        />
        <p className="text-primary-500 text-[14px] font-normal leading-[140%] md:text-[16px] md:font-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;