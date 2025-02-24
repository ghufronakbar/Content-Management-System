import { NextRequest, NextResponse } from "next/server";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import cloudinary from "~/config/cloudinary";

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse };

const uploadToCloudinary = (
  fileUri: string,
  fileName: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: "auto",
        filename_override: fileName,
        folder: "socio/article",
        use_filename: true,
      })
      .then((result) => {
        resolve({ success: true, result });
      })
      .catch((error) => {
        reject({ success: false, error });
      });
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.getAll("images") as File[];
    const indexs = formData.get("indexs") as string;
    const parsedIndexs = JSON.parse(indexs) as number[];

    if (typeof parsedIndexs !== "object") {
      return NextResponse.json("Invalid format", {
        status: 400,
      });
    }

    if (!Array.isArray(parsedIndexs)) {
      return NextResponse.json("Invalid format", {
        status: 400,
      });
    }

    if (!parsedIndexs.every((index) => typeof index === "number")) {
      return NextResponse.json("Invalid format", {
        status: 400,
      });
    }

    if (parsedIndexs.length !== images.length) {
      return NextResponse.json("Invalid format", {
        status: 400,
      });
    }

    if (images.length === 0) {
      return NextResponse.json("At least one image is required", {
        status: 400,
      });
    }

    const uploadPromises = images.map(async (image) => {
      const fileBuffer = await image.arrayBuffer();
      const mimeType = image.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
      return uploadToCloudinary(fileUri, image.name);
    });

    const results = await Promise.all(uploadPromises);
    if (results.length !== images.length) {
      return NextResponse.json("Internal server error", {
        status: 500,
      });
    }
    const successfulUploads = results.filter(
      (res) => res.success && res.result
    );

    if (successfulUploads.length > 0) {
      const urls = successfulUploads
        .map((upload, i) => {
          if (upload.success) {
            return {
              secureUrl: upload.result?.secure_url || "",
              index: parsedIndexs[i],
            };
          }
        })
        .filter(Boolean);
      return NextResponse.json(urls);
    }

    return NextResponse.json("Internal server error", {
      status: 500,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong, please try again later", {
      status: 500,
    });
  }
}
