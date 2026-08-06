import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Next.js caps Server Action request bodies at 1MB by default - way
      // below our own MAX_FILE_SIZE_BYTES (5MB) check in
      // lib/validations/profile-media.ts. Without this, any photo/document
      // between 1MB and 5MB was rejected by Next.js itself before ever
      // reaching our validation code, with a confusing generic error
      // instead of our friendly "עד 5MB" message. 6mb leaves headroom for
      // multipart/form-data overhead on top of a 5MB file.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
