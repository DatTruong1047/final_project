export const uploadFileConfig = {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100 * 1024, // Max field value size 100kb
    fields: 10,
    files: 5,
    fileSize: 5 * 1024 * 1024,
  },
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  uploadUserDir: 'media/users',
  uploadProductDir: 'media/products',
};
