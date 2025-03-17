"use client";

import { Feature, Information } from "@prisma/client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdClose, MdSave } from "react-icons/md";
import { toast } from "react-toastify";
import DashboardLayout from "~/components/material/DashboardLayout";
import { UploadImage } from "~/components/material/UploadImage";
import { ResUploadApi } from "~/models/response/upload";
import { optToast } from "~/utils/toast";

const InformationPage = () => {
  const {
    onImageChangeFeat,
    features,
    formFeature,
    information,
    onChangeFeature,
    onChangeInfo,
    isOpen,
    onClickFeature,
    onClickNew,
    onClose,
    onSubmit,
    onImageChangeInfo,
    onSave,
  } = useInformation();

  return (
    <DashboardLayout
      title="Information"
      childrenHeader={
        <button
          className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center"
          onClick={onSave}
        >
          <MdSave />
          Save
        </button>
      }
    >
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full md:w-1/3 h-auto p-4 bg-white rounded-lg">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Hero Image</label>
            <UploadImage
              image={information.imageHero}
              onChangeImage={onImageChangeInfo}
              className="h-60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Hero Title</label>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={information.heroTitle}
              onChange={(e) => onChangeInfo(e, "heroTitle")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">
              Hero Subtitle
            </label>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={information.subtitleHero}
              onChange={(e) => onChangeInfo(e, "subtitleHero")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">
              Greet Title
            </label>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={information.greetTitle}
              onChange={(e) => onChangeInfo(e, "greetTitle")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Greet Text</label>
            <textarea
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={information.greetText}
              rows={4}
              onChange={(e) => onChangeInfo(e, "greetText")}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-2/3 h-auto p-4 bg-white rounded-lg">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between mb-4">
              <label className="font-medium text-lg text-black">
                Feature Title
              </label>
              <button
                className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center text-sm"
                onClick={onClickNew}
              >
                Create New
              </button>
            </div>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={information.featureTitle}
              onChange={(e) => onChangeInfo(e, "featureTitle")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 p-4 bg-neutral-50 rounded-lg"
              >
                <div className="flex flex-row justify-between my-2 items-start">
                  <h3 className="font-medium text-xl text-black">
                    {feature.title}
                  </h3>
                  <div className="flex flex-row gap-2">
                    <button
                      className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center text-sm"
                      onClick={() => onClickFeature(feature)}
                    >
                      Edit
                    </button>
                    <button
                      className="w-fit h-fit rounded-lg px-4 py-2 bg-white text-primary drop-shadow-lg hover:bg-primary/20 transition-all flex flex-row gap-2 items-center text-sm"
                      onClick={() => {}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={800}
                  height={800}
                  className="w-full aspect-video rounded-lg object-cover"
                />
                <p className="font-medium text-lg text-neutral-800">
                  {feature.subtitle}
                </p>
                <p className="text-md text-neutral-700">{feature.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ModalFeature
        isOpen={isOpen}
        onChangeFeature={onChangeFeature}
        onClose={onClose}
        formFeature={formFeature}
        onSubmit={onSubmit}
        onImageChangeFeat={onImageChangeFeat}
      />
    </DashboardLayout>
  );
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onChangeFeature: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof FeatureDTO
  ) => void;
  formFeature: FeatureDTO;
  onSubmit: () => void;
  onImageChangeFeat: (src: string | null) => void;
}

const ModalFeature: React.FC<Props> = ({
  isOpen,
  onClose,
  onChangeFeature,
  formFeature,
  onSubmit,
  onImageChangeFeat,
}) => {
  if (!isOpen) return null;

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
        onImageChangeFeat?.(res.data[0].secureUrl);
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
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-4 w-full md:w-1/3 lg:w-1/2 xl:w-1/3 mx-8 h-auto p-4 bg-white rounded-lg max-h-[80vh] overflow-hidden overflow-y-scroll hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 w-full h-auto p-4 bg-white rounded-lg">
          <div className="flex flex-row justify-between">
            <div className="font-semibold text-lg text-black">
              {formFeature.id === "" ? "Create New Feature" : "Edit Feature"}
            </div>
            <MdClose onClick={onClose} className="cursor-pointer" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Hero Image</label>            
            <div
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-300 rounded-md p-2 cursor-pointer hover:bg-gray-100 h-40 transition-all overflow-hidden"
              onClick={() => document.getElementById("imageFeature")?.click()}
            >
              <input
                className="hidden"
                type="file"
                accept="image/*"
                id="imageFeature"
                onChange={onImageSelected}
              />
              {formFeature.image ? (
                <Image
                  src={formFeature.image}
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
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Title</label>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={formFeature.title}
              onChange={(e) => onChangeFeature(e, "title")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Subtitle</label>
            <input
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={formFeature.subtitle}
              onChange={(e) => onChangeFeature(e, "subtitle")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-medium text-lg text-black">Content</label>
            <textarea
              className="bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none"
              value={formFeature.content}
              rows={4}
              onChange={(e) => onChangeFeature(e, "content")}
            />
          </div>
          <button
            className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center text-sm self-center mt-2"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;

interface InformationDTO {
  heroTitle: string;
  subtitleHero: string;
  imageHero: string;
  greetTitle: string;
  greetText: string;
  featureTitle: string;
}

const initInformation: InformationDTO = {
  heroTitle: "Loading...",
  subtitleHero: "Loading...",
  greetTitle: "Loading...",
  greetText: "Loading...",
  featureTitle: "Loading...",
  imageHero: "",
};

interface FeatureDTO {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
}

const initFeature: FeatureDTO = {
  id: "",
  title: "",
  subtitle: "",
  content: "",
  image: "",
};

const useInformation = () => {
  const [information, setInformation] =
    useState<InformationDTO>(initInformation);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [formFeature, setFormFeature] = useState<FeatureDTO>(initFeature);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    const information = await axios.get<Information>("/api/information");
    const features = await axios.get<Feature[]>("/api/feature");
    setInformation(information.data);
    setFeatures(features.data);
  };

  const onChangeInfo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof InformationDTO
  ) => {
    setInformation((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const onChangeFeature = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof FeatureDTO
  ) => {
    setFormFeature((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickFeature = (item: Feature) => {
    setIsOpen(true);
    setFormFeature(item);
  };

  const onClose = () => {
    setIsOpen(false);
    setFormFeature(initFeature);
  };

  const onClickNew = () => {
    setIsOpen(true);
    setFormFeature(initFeature);
  };

  const onImageChangeInfo = (src: string | null) => {
    console.log("INFO IMAGE CHANGE", { src });
    setInformation((prev) => ({
      ...prev,
      imageHero: src || "",
    }));
  };

  const onImageChangeFeat = (src: string | null) => {
    console.log("Image Changed (Feature):", src); // Cek apakah dipanggil
    console.log({ formFeature });
    setFormFeature((prev) => ({
      ...prev,
      image: src || "",
    }));
  };

  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    try {
      if (loading) return;
      Object.values(information).forEach((item) => {
        if (item === "" || !item) {
          throw new Error("All fields are required");
        }
      });
      setLoading(true);
      toast("Saving...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      const res = await axios.post("/api/information", { data: information });
      await fetchData();
      toast(res.data?.toString(), {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
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
    } finally {
      setLoading(false);
    }
  };

  const createNewFeature = async () => {
    try {
      if (loading) return;
      Object.entries(formFeature).forEach(([key, value]) => {
        if (key !== "id" && (value === "" || !value)) {
          throw new Error("All fields are required");
        }
      });
      setLoading(true);
      toast("Saving...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      const res = await axios.post("/api/feature", { data: formFeature });
      await fetchData();

      toast(res.data?.toString(), {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      onClose();
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
    } finally {
      setLoading(false);
    }
  };

  const editFeature = async () => {
    try {
      if (loading) return;
      Object.values(formFeature).forEach((item) => {
        if (item === "" || !item) {
          throw new Error("All fields are required");
        }
      });
      setLoading(true);
      toast("Saving...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      const res = await axios.put(`/api/feature/${formFeature.id}`, {
        data: formFeature,
      });
      await fetchData();
      toast(res.data?.toString(), {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      onClose();
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
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (formFeature.id) {
      editFeature();
    } else {
      createNewFeature();
    }
  };

  return {
    information,
    features,
    formFeature,
    onChangeInfo,
    onChangeFeature,
    onClickFeature,
    isOpen,
    onClose,
    onClickNew,
    onSubmit,
    onImageChangeInfo,
    onImageChangeFeat,
    onSave,
  };
};
