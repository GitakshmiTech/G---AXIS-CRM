//===========================================================================================
//    LOCAL DOCUMENT PREVIEW AND DOWNLOAD HELPERS
// ===========================================================================================

/** Open a selected local image or PDF in a browser tab. */
export const previewLocalDocument = (file) => {
  const objectUrl = URL.createObjectURL(file);
  const previewWindow = window.open(objectUrl, '_blank');
  if (!previewWindow) {
    URL.revokeObjectURL(objectUrl);
    throw new Error('Allow pop-ups to preview this document.');
  }
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 300000);
};

/** Download a selected local document before it is uploaded. */
export const downloadLocalDocument = (file) => {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = file.name || 'lead-document';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
