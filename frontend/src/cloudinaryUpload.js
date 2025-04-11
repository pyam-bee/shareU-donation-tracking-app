export async function uploadPdfToCloudinary(file) {
  // Use environment variables or fallback to hardcoded values if needed
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'react_unsigned_upload';
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dnbzulstw';

  console.log('Cloudinary config:', { uploadPreset, cloudName });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'pdfs');

    // Change from /auto/upload to just /upload
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Cloudinary error details:', errorData);
      throw new Error(`Cloudinary upload failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Full error in uploadPdfToCloudinary:', error);
    throw error; // Rethrow with original stack trace
  }
}