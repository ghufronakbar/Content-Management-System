import axios, { AxiosError } from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { ResUploadApi } from "~/models/response/upload";
import { cn } from "~/utils/cn";
import { optToast } from "~/utils/toast";

interface Props {
  className?: string;
  image?: string | null;
  onChangeImage?: (image: string | null) => void;
}

export const UploadImage: React.FC<Props> = ({
  className,
  image,
  onChangeImage,
}) => {
  const onImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append("images", file);
        formData.append("indexs", "[1]");

        toast("Uploading...", {
          ...optToast,
          type: "info",
          position: "bottom-right",
        });
        const res = await axios.post<ResUploadApi[]>("/api/images", formData);
        onChangeImage?.(res.data[0].secureUrl);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data || "Something went wrong", {
          ...optToast,
          type: "error",
          position: "bottom-right",
        });
      } else if (error instanceof Error) {
        toast(error.message, {
          ...optToast,
          type: "error",
          position: "bottom-right",
        });
      } else {
        toast("Something went wrong", {
          ...optToast,
          type: "error",
          position: "bottom-right",
        });
      }
    }
  };
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 h-40 transition-all overflow-hidden",
        className
      )}
      onClick={() => document.getElementById("image")?.click()}
    >
      <input
        className="hidden"
        type="file"
        accept="image/*"
        id="image"
        onChange={onImageSelected}
      />
      {image ? (
        <Image
          src={image}
          alt=""
          className="w-full h-full object-cover rounded-md"
          width={600}
          height={400}
        />
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <p className="text-gray-500">Upload a file</p>
        </>
      )}
    </div>
  );
};
