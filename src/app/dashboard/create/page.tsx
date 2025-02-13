"use client";

import { SectionType } from "@prisma/client";
import { FC, useState } from "react";
import { BiPlus, BiSave } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { MdDrafts, MdPublish } from "react-icons/md";
import DashboardLayout from "~/components/material/DashboardLayout";
import { BASE_URL } from "~/constants";
import { useBeforeUnload } from "~/hooks/useBeforeUnload";
import {
  ArticleDTO,
  initArticleDTO,
  initSectionDTO,
  SectionDTO,
} from "~/models/dto/article";
import { cn } from "~/utils/cn";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { optToast } from "~/utils/toast";
import { useRouter } from "next/navigation";
import { formatDate } from "~/utils/formatDate";

const CreateArticle = () => {
  const [form, setForm] = useState<ArticleDTO>(initArticleDTO);
  const [loading, setLoading] = useState<boolean>(false);
  useBeforeUnload();
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof ArticleDTO
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const onChangeSection = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof SectionDTO,
    index: number
  ) => {
    const target = e.target as HTMLInputElement;
    console.log("FILES", target.files);
    if (target.files) {
      console.log("hit");
      setForm((prev) => ({
        ...prev,
        sections: prev.sections.map((section, i) => {
          if (i === index) {
            return {
              ...section,
              picture: target.files?.[0] || null,
              [key]: target.value,
            };
          }
          return section;
        }),
      }));
    }
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) => {
        if (i === index) {
          return {
            ...section,
            [key]: e.target.value,
          };
        }
        return section;
      }),
    }));
  };

  const onChangeTypeSection = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) => {
        if (i === index) {
          return {
            ...section,
            type: e.target.value as SectionType,
          };
        }
        return section;
      }),
    }));
  };

  const createNewSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections.slice(0, index + 1),
        initSectionDTO,
        ...prev.sections.slice(index + 1),
      ],
    }));
  };

  const deleteSection = (index: number) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
    setForm((prev) => ({
      ...prev,
      slug,
    }));
  };

  const isValidSlug = (slug: string): boolean => {
    const regex = /^[a-z0-9-]+$/;
    return regex.test(slug);
  };

  const onSubmit = async (published: boolean) => {
    try {      
      if (form.title.length <= 0) {
        throw new Error("Title is required");
      }
      if (form.slug.length <= 0) {
        throw new Error("Slug is required");
      }
      if (!isValidSlug(form.slug)) {
        throw new Error(
          "Slug takes only lowercase letters, numbers, and hyphens"
        );
      }
      if (form.sections.length <= 0) {
        throw new Error("At least one section is required");
      }
      if (form.sections.some((section) => section.content.length <= 0)) {
        throw new Error("All sections must have content");
      }
      if (loading) return;
      setLoading(true);
      toast("Creating article...", {
        ...optToast,
        type: "info",
        position: "bottom-right",
      });
      await axios.post("/api/article", { ...form, published });
      toast("Article created successfully", {
        ...optToast,
        type: "success",
        position: "bottom-right",
        autoClose: 3000,
      });
      router.push("/dashboard/article");
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast(String(error.response?.data), {
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
      }
    }
  };

  return (
    <DashboardLayout
      title="Create Article"
      childrenHeader={
        <div className="flex gap-4">
          <button
            className="w-fit h-fit rounded-lg px-4 py-2 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all flex flex-row gap-2 items-center"
            onClick={() => onSubmit(true)}
          >
            <MdPublish />
            Publish
          </button>
          <button
            className="w-fit h-fit rounded-lg px-4 py-2 bg-white text-primary drop-shadow-lg hover:bg-primary/20 transition-all flex flex-row gap-2 items-center"
            onClick={() => onSubmit(false)}
          >
            <MdDrafts />
            Save as draft
          </button>
        </div>
      }
    >
      <div className="w-full flex flex-col-reverse md:flex-row gap-8">
        <div className="w-full flex flex-col md:w-1/2 lg:w-2/3 bg-white rounded-lg border-neutral-200 border p-8 gap-4">
          {form.sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <select
                  className="w-fit h-fit rounded-lg px-4 py-2 bg-white text-primary drop-shadow-sm transition-all border"
                  value={section.type}
                  onChange={(e) => onChangeTypeSection(e, index)}
                >
                  {Object.values(SectionType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {form.sections.length > 1 && (
                  <button
                    className="w-fit h-fit rounded-lg px-2 py-1 bg-primary text-white drop-shadow-lg hover:bg-primary/80 transition-all self-end mt-2 flex flex-row gap-2 items-center text-sm"
                    onClick={() => deleteSection(index)}
                  >
                    <IoMdTrash />
                    Delete
                  </button>
                )}
              </div>
              <InputSection
                key={index}
                type={section.type}
                value={section.content}
                onChange={(e) => {
                  onChangeSection(e, "content", index);
                }}
                imageFile={section.picture}
              />

              <button
                className="w-fit h-fit rounded-lg px-4 py-2 bg-white text-primary drop-shadow-lg hover:bg-primary/20 transition-all self-end mt-2 flex flex-row gap-2 items-center"
                onClick={() => createNewSection(index)}
              >
                <BiPlus />
                Add Section
              </button>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 lg:w-1/3 bg-white rounded-lg border-neutral-200 border p-8 h-fit flex flex-col gap-4 overflow-hidden">
          <InputSection
            label="Title"
            type="H4"
            value={form.title}
            onChange={(e) => {
              onChange(e, "title");
            }}
            imageFile={null}
          />
          <InputSection
            label="Slug"
            type="H4"
            value={form.slug}
            onChange={(e) => {
              onChange(e, "slug");
            }}
            buttonClick={generateSlug}
            imageFile={null}
          />
          <span className="text-sm text-neutral-800 max-w-full">
            Link will be {BASE_URL}/article/{form.slug}
          </span>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">Created At</label>
            <p>{formatDate(new Date(), true)}</p>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">Updated At</label>
            <p>{formatDate(new Date(), true)}</p>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">Status</label>
            <div className="w-fit h-fit rounded-lg px-2 py-1 bg-white text-primary drop-shadow-lg transition-all flex flex-row gap-2 items-center text-sm mt-2">
              <BiSave />
              Unsaved
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">Viewers</label>
            <div className="flex flex-row items-center gap-2">
              <BsEye />
              <p>0</p>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <label className="font-medium text-lg text-black">
              Preview Table Of Content
            </label>
            <TableOfContent items={form.sections} />
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
}

const InputSection: FC<Props> = ({
  label,
  type,
  value,
  onChange,
  buttonClick,
}) => {
  let rows = 1;
  let font = "text-lg";
  let isInput = false;

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
        <div className="w-full flex flex-row gap-2 items-center">
          <input
            className={cn(
              "bg-white w-full h-full border border-neutral-200 rounded-lg px-4 py-2 outline-none resize-none",
              font
            )}
            value={value}
            onChange={onChange}
          />
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

interface PropsTOC {
  items: SectionDTO[];
}

const TableOfContent: FC<PropsTOC> = ({ items }) => {
  const H = ["H1", "H2", "H3", "H4", "H5", "H6"];
  const filteredItems = items.filter((item) => H.includes(item.type));

  return (
    <div className="w-full flex flex-col">
      {filteredItems.map((item, index) => (
        <div key={index}>
          <div
            className={cn("text-neutral-700 flex flex-row gap-1 font-medium")}
          >
            <div className="text-primary font-bold">
              #{item.type.slice(1, item.type.length)}
            </div>{" "}
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreateArticle;
