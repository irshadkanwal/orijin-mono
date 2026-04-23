import * as admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import { Bucket } from '@google-cloud/storage';
import { FileDocument, StorageDocument } from '../v1entities/utis/types';
import { Injectable } from '@nestjs/common';
import UploadDocument from '../v1entities/general/UploadDocument';
// const mimeTypes = require('mimetypes');
@Injectable()
export default class FirebaseStorageProvider {
  storage: admin.storage.Storage;
  bucket: Bucket;

  constructor(app: admin.app.App, bucket: string) {
    this.storage = admin.storage(app);
    this.bucket = this.storage.bucket(bucket);
  }

  uploadJSONFile = async (
    path: string,
    json: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    stateChangeCallback?: Function,
  ): Promise<string> => {
    const file = this.bucket.file(path);
    await file.save(JSON.stringify(json), {
      contentType: 'application/json',
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(), // Add import { v4 as uuidv4 } from 'uuid'; at top
      },
    });

    return this.getPublicUrl(path);
  };

  uploadDocument(
    path: string,
    file: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    stateChangeCallback?: Function,
  ): Promise<FileDocument> {
    throw new Error('Method not implemented.');
  }

  uploadImg(
    filePath: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<Partial<any>> {
    throw new Error('Method not implemented.');
  }

  getPublicUrl = (fullPath: string) => {
    return `https://storage.googleapis.com/${this.bucket.name}/${fullPath}`;
  };

  uploadHTMLReport = async (
    path: string,
    html: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    stateChangeCallback?: Function,
  ): Promise<Partial<StorageDocument>> => {
    try {
      const file = this.bucket.file(path);
      await file.save(html, {
        contentType: 'text/html',
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(), // Add import { v4 as uuidv4 } from 'uuid'; at top
        },
      });

      const doc: Partial<StorageDocument> = {
        storagePath: path,
        publicUrl: this.getPublicUrl(path),
        url: this.getPublicUrl(path),
      };

      return doc;
    } catch (e) {
      console.log('Error in uploadHTMLReport', e);
      throw e;
    }
  };

  uploadFile = async (
    path: string,
    file: any,
    // eslint-disable-next-line @typescript-eslint/ban-types
    stateChangeCallback?: Function,
  ): Promise<string> => {
    const fileRef = this.bucket.file(path);

    await fileRef.save(file, {
      contentType: file.type,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(), // Add import { v4 as uuidv4 } from 'uuid'; at top
      },
    });

    return this.getPublicUrl(path);
  };

  uploadDocumentFromBase64 = async (
    path: string,
    file: UploadDocument,
  ): Promise<FileDocument> => {
    if (file.data) {
      const image = file.data;
      // let mimeType = file.data.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)[1]

      // let fileName = path + mimeTypes.detectExtension(mimeType)

      const fileRef = this.bucket.file(path + file.originalUploadName);
      // let base64EncodedImageString = image.replace(/^data:image\/\w+;base64,/, '')
      // let base64EncodedImageString = image.replace(/^data:\/\w+;base64,/, '')
      const base64EncodedImageString = image.split(',').pop();
      const imageBuffer = new Buffer(base64EncodedImageString, 'base64');

      await fileRef.save(imageBuffer, {
        contentType: file.mimeType,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });

      const doc: FileDocument = {
        size: file.size,
        name: file.name,
        type: file.type,
        storagePath: fileRef.cloudStorageURI.toString(),
        publicUrl: fileRef.publicUrl(),
        url: fileRef.baseUrl,
      };
      return doc;
    }
    throw Error('file is empty');
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  deleteFile = async (path: string, stateChangeCallback?: Function) => {
    try {
      console.log('Deleting file ' + path);
      const fileRef = this.bucket.file(path);
      await fileRef.delete();
    } catch (e) {
      console.log('Problem with delete', e);
      throw e;
    }
  };

  getDownloadUrl = async (path: string): Promise<string> => {
    return this.getPublicUrl(path);
  };
}
