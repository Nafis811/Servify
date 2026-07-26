// Clean up CLOUDINARY_URL if it is not a valid cloudinary:// protocol
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith("cloudinary://")) {
  delete process.env.CLOUDINARY_URL;
}

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadToCloudinary(
  fileData: string,
  folder = "servify/ktp"
): Promise<string> {
  if (!fileData) {
    throw new Error("File data is required for upload");
  }

  // If already an HTTP/HTTPS URL, return it directly
  if (fileData.startsWith("http://") || fileData.startsWith("https://")) {
    return fileData;
  }

  if (isConfigured) {
    try {
      const result = await cloudinary.uploader.upload(fileData, {
        folder,
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to data URL:", error);
    }
  }

  // Fallback: If Cloudinary keys are not set, return data URL directly so app stays functional
  return fileData;
}
