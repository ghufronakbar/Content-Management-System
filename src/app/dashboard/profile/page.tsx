"use client";

import { SectionType, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";

import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import DashboardLayout from "~/components/material/DashboardLayout";
import { BASE_URL } from "~/constants";
import { cn } from "~/utils/cn";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { optToast } from "~/utils/toast";
import { formatDate } from "~/utils/formatDate";
import { NextPage } from "next";
import Image from "next/image";
import { initProfileDTO, initUser, ProfileDTO } from "~/models/dto/profile";
import useDebounce from "~/hooks/useDebounce";
import { DEFAULT_PROFILE } from "~/constants/image";
import { ResUploadApi } from "~/models/response/upload";

const ProfilePage: NextPage = () => {
  const [form, setForm] = useState<ProfileDTO>(initProfileDTO);
  const [data, setData] = useState<User>(initUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [firstUsername, setFirstUsername] = useState<string>("");
  const [errorUsername, setErrorUsername] = useState<boolean>(false);
  const [loadingUsername, setLoadingUsername] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const response = await axios.get<User>("/api/profile");
      setData(response.data);
      setForm(response.data);
      setFirstUsername(response.data.username);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data, {
          ...optToast,
          type: "error",
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleCheckUsername = async () => {
    try {
      if (form.username === firstUsername) return;
      setLoadingUsername(true);
      const response = await axios.get<{ isExist: boolean }>(
        "/api/profile/check-username",
        {
          params: {
            username: form.username,
          },
        }
      );
      if (response.data.isExist) {
        setErrorUsername(true);
      } else {
        setErrorUsername(false);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data, {
          ...optToast,
          type: "error",
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoadingUsername(false);
    }
  };

  useDebounce(
    () => {
      handleCheckUsername();
    },
    1000,
    [form.username]
  );

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof ProfileDTO
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (form.name.length <= 0) throw new Error("Name is required");
      if (form.username.length <= 0) throw new Error("Username is required");
      if (form.description.length <= 0)
        throw new Error("Description is required");
      if (isDisable) return;
      setLoading(true);
      toast("Saving...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      await axios.put("/api/profile", { data: form });
      toast("Edit profile successfully", {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      setFirstUsername(form.username);
      fetchData();
    } catch (error) {
      setLoading(false);
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

  const deleteProfilePicture = async () => {
    try {
      toast("Deleting...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      setData((prev) => ({ ...prev, image: null }));
      await axios.patch("/api/profile", { data: { image: null } });
      toast("Delete profile picture successfully", {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      fetchData();
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

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("images", file);
    formData.append("indexs", "[1]");
    try {
      toast("Uploading...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
        autoClose: 3000,
      });
      const response = await axios.post<ResUploadApi[]>(
        "/api/images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.patch("/api/profile", {
        data: { image: response.data[0].secureUrl },
      });
      setData((prev) => ({ ...prev, image: response.data[0].secureUrl }));
      toast("Upload profile picture successfully", {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      fetchData();
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

  const isDisable = loading || loadingUsername || errorUsername;

  return (
    <DashboardLayout
      title="Profile"
      childrenHeader={
        <div className="flex gap-4">
          <button
            className={cn(
              "w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center",
              isDisable && "cursor-not-allowed"
            )}
            onClick={onSubmit}
            disabled={isDisable}
          >
            <MdSave />
            Save
          </button>
        </div>
      }
    >
      <div className="w-full flex flex-col-reverse md:flex-row gap-8 justify-center">
        <div className="w-full md:w-1/2 lg:w-2/3 bg-white rounded-lg border-neutral-200 border p-8 h-fit flex flex-col gap-4 overflow-hidden">
          <Image
            src={data.image || DEFAULT_PROFILE}
            alt=""
            width={400}
            height={400}
            className="w-40 h-40 rounded-full object-cover self-center"
          />
          <div className="flex flex-row gap-4 self-center">
            <div
              className="text-sm font-medium text-center self-center cursor-pointer flex flex-row gap-2 items-center"
              onClick={() => document.getElementById("image")?.click()}
            >
              <MdEdit />
              Change profile picture
            </div>
            {data.image && (
              <div
                className="text-sm font-medium text-center self-center cursor-pointer flex flex-row gap-2 items-center"
                onClick={deleteProfilePicture}
              >
                <MdDelete />
                Delete profile picture
              </div>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            id="image"
            onChange={onChangeImage}
          />
          <InputSection
            label="Name"
            type="H4"
            value={form.name}
            onChange={(e) => {
              onChange(e, "name");
            }}
            imageFile={null}
            placeholder="John Doe"
          />
          <InputSection
            label="Username"
            type="H4"
            value={form.username}
            onChange={(e) => {
              setLoadingUsername(true);
              onChange(e, "username");
            }}
            imageFile={null}
            placeholder="johndoe"
            isLoading={loadingUsername}
          />
          {errorUsername && form.username !== "article" && (
            <span className="text-sm text-red-500 max-w-full">
              This username already exists
            </span>
          )}
          {form.username === "article" && (
            <span className="text-sm text-red-500 max-w-full">
              This username is prohibited
            </span>
          )}
          <span className="text-sm text-neutral-800 max-w-full">
            Link will be {BASE_URL}/{form.username}
          </span>

          <InputSection
            label="Bio"
            type="Text"
            value={form.description}
            onChange={(e) => {
              onChange(e, "description");
            }}
            imageFile={null}
            placeholder="Tell us about yourself"
          />
          <InputSection
            label="Email"
            type="H4"
            value={data.email}
            onChange={() => {}}
            imageFile={null}
            placeholder="Email"
            disabled
          />
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">
              Registered At
            </label>
            <p>{formatDate(data.createdAt, true)}</p>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">
              Last Updated At
            </label>
            <p>{formatDate(data.updatedAt, true)}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface Props {
  label?: string;
  type: SectionType;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  buttonClick?: () => void;
  imageFile: File | null;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const InputSection: FC<Props> = ({
  label,
  type,
  value,
  onChange,
  buttonClick,
  placeholder,
  imageFile,
  disabled,
  isLoading,
}) => {
  let rows = 1;
  let isInput = false;
  let font = "text-lg";

  switch (type) {
    case "H1":
      isInput = true;
      font = "text-4xl font-bold";
      break;
    case "H2":
      isInput = true;
      font = "text-3xl font-semibold";
      break;
    case "H3":
      isInput = true;
      font = "text-2xl font-semibold";
      break;
    case "H4":
      isInput = true;
      font = "text-xl font-medium";
      break;
    case "H5":
      isInput = true;
      font = "text-lg font-medium";
      break;
    case "H6":
      isInput = true;
      font = "text-lg font-medium";
      break;
    case "Text":
      rows = 5;
      font = "text-md";
      break;
    case "List":
      rows = 5;
      font = "text-md";
      break;
    case "Number":
      rows = 5;
      font = "text-md";
      break;
    case "Quote":
      isInput = true;
      font = "text-4xl font-neutral-600  font-mono";
      break;
    default:
      isInput = true;
      font = "text-md";
  }

  if (type === "Image") {
    const isUrl = value.startsWith("http://") || value.startsWith("https://");
    return (
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-lg text-black">{label}</label>
        <div className="w-full flex flex-row gap-2 items-center">
          <div
            className={cn(
              "bg-white w-full h-60 border border-neutral-200 rounded-lg px-2 py-2 outline-none flex flex-col items-center justify-center cursor-pointer",
              font
            )}
          >
            {imageFile ? (
              <Image
                src={URL.createObjectURL(imageFile)}
                alt=""
                width={800}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : isUrl ? (
              <Image
                src={value}
                alt=""
                width={800}
                height={400}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : null}
            <input
              className="w-full h-full object-cover rounded-lg"
              type="file"
              accept="image/*"
              id="image"
              onChange={onChange}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isInput) {
    return (
      <div className="w-full flex flex-col gap-2">
        <label className="font-medium text-lg text-black">{label}</label>
        <div className="w-full flex flex-row gap-2 items-center relative">
          <input
            className={cn(
              "bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none",
              font,
              disabled && "bg-neutral-100"
            )}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
          {isLoading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary absolute right-6"></div>
          )}
          {buttonClick && (
            <button
              onClick={buttonClick}
              className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center text-sm"
            >
              Generate
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="font-medium text-lg text-black">{label}</label>
      <textarea
        className={cn(
          "bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none",
          font
        )}
        rows={rows}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default ProfilePage;
