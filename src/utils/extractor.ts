export const clodinaryPublicId = (cloudinaryUrl: string): string | null => {
  try {
    // Example: extract after '/upload/' and before the file extension
    const parts = cloudinaryUrl.split("/upload/");
    if (parts.length < 2) return null;

    
    const pathWithVersionAndFile = parts[1]; // Get the path part after upload/

    // Remove version and extension
    const segments = pathWithVersionAndFile.split("/"); // ['v1751266733', 'uploads', 'website.png']
    const versionIndex = segments[0].startsWith("v") ? 1 : 0; // if version present, skip it

    const publicPathSegments = segments.slice(versionIndex);
    const filename = publicPathSegments.pop(); // 'website.png'
    const filenameWithoutExt = filename?.substring(0, filename.lastIndexOf(".")) || "";

    return [...publicPathSegments, filenameWithoutExt].join("/");
  } catch {
    return null;
  }
};
