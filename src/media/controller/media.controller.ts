import { createUploader } from 'bufferbus';
import busboy from 'busboy';
import { Request, Response } from 'express';
import { Readable } from 'stream';

export const uploadToFirebase = createUploader({
    platform: 'firebase',
    config: {
        bucket: process.env.FIREBASE_STORAGE_BUCKET as string,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
        privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
        projectId: process.env.FIREBASE_PROJECT_ID as string,
    },
});

export const handleFile = async (req: Request, res: Response) => {
    try {
        const { fileStream, fileName, mimeType } = await new Promise<{
            fileStream: Readable;
            fileName: string;
            mimeType: string;
        }>((resolve, reject) => {
            const bb = busboy({ headers: req.headers });

            bb.on('file', (name, file, info) => {
                resolve({
                    fileStream: file,
                    fileName: info.filename,
                    mimeType: info.mimeType,
                });
            });

            bb.on('error', (err) => reject(err));
            req.pipe(bb);
        });

        console.log('Uploading file to Firebase:', fileName);

        // const fileExtension = fileName.split(".").pop() || "bin"; // Default to .bin if no extension

        const timestamp = new Date().getTime();

        const formattedFileName = `EX_TS_AUTH_${timestamp}_${fileName.replace(/\s+/g, '_')}`;

        const fileUrl = await uploadToFirebase({
            fileName: formattedFileName,
            data: fileStream,
            mimeType,
        });

        console.log('File uploaded successfully:', fileUrl);

        res.status(200).json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: formattedFileName,
        });
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).json({
            message: 'Something went wrong',
            error: err instanceof Error ? err.message : err,
        });
    }
};
