import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path, { dirname, extname, join } from 'path';

import { MultipartFile } from '@fastify/multipart';

import { ErrorCodes, uploadFileConfig } from '@app/config';
import { FileType, ResultType } from '@app/models';

// Get file from request
export async function getFile(part: MultipartFile): Promise<ResultType<FileType>> {
  try {
    // No files provided
    if (!(part.file || part.filename)) {
      return {
        success: false,
        code: ErrorCodes.FILE_NOT_FOUND,
        message: 'No files provided',
      };
    }

    const chunks: Buffer[] = [];

    for await (const chunk of part.file) {
      chunks.push(chunk);
    }
    const file: FileType = {
      filename: part.filename ?? 'unknown',
      buffer: Buffer.concat(chunks),
    };

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return {
        success: false,
        code: validationError.code,
        message: validationError.message,
      };
    }

    return {
      success: true,
      code: 200,
      data: file,
    };
  } catch (error) {
    return {
      success: false,
      code: ErrorCodes.SERVER_ERROR,
      message: 'Upload file errors',
    };
  }
}

// Delete static file
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const filePath = path.join('./public/', fileName);
    console.log(filePath);

    await fs.unlink(filePath);
  } catch (error) {
    throw error;
  }
}

export async function saveLocalFile(file: FileType, uploadDir: string): Promise<ResultType<string>> {
  try {
    const fullUploadDir = join('./public', uploadDir);

    const uniqueFileName = `${Date.now()}_${file.filename}`;
    const fullPath = join(fullUploadDir, uniqueFileName);

    await fs.mkdir(dirname(fullPath), { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const writeStream = createWriteStream(fullPath);
      writeStream.write(file.buffer);
      writeStream.end();
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const filePath = join(uploadDir, uniqueFileName);
    return {
      success: true,
      data: filePath,
      code: 200,
    };
  } catch (error) {
    return {
      success: false,
      code: ErrorCodes.UPLOAD_FILE_ERROR,
      message: 'Upload file errors',
    };
  }
}

export function validateFile(file: FileType): ResultType<void> {
  const fileExt = extname(file.filename).toLowerCase();

  // Check file ext
  if (!uploadFileConfig.allowedExtensions.includes(fileExt)) {
    return {
      success: false,
      code: ErrorCodes.FORMAT_IS_NOT_SUPPORTED,
      message: `File format is not supported. Only accepted: ${uploadFileConfig.allowedExtensions.join(', ')}`,
    };
  }

  // Check file size
  if (file.buffer.length > uploadFileConfig.limits.fieldSize) {
    return {
      success: false,
      code: ErrorCodes.FILE_SIZE_EXCEEDS,
      message: `File size exceeds ${uploadFileConfig.limits.fileSize / (1024 * 1024)}MB`,
    };
  }

  return null; // valid
}
