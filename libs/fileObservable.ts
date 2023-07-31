import axios from 'axios';
import { Observable } from 'zen-observable-ts';
import { File as FileType } from '@prisma/client';

// Usage:
// const uploadToClient = async (event: any) => {
//   if (event.target.files && event.target.files[0]) {
//     uploadToAWS(event.target.files[0]).subscribe((progress) => {});
//   }
// };
export const uploadToAWS = (
  file: File
): Observable<{ progress: number; data?: FileType }> => {
  return new Observable<{ progress: number; data?: FileType }>((subscribe) => {
    // Generate key for file
    const key = `${new Date().getTime()}_${file.name}`;

    // Get signed url for file
    const payload: any = { key };
    let getSignedUrlResponse: any;

    axios
      .request({
        method: 'post',
        url: '/api/getPostUrl',
        data: payload,
      })
      .then((res) => {
        if (res) {
          getSignedUrlResponse = res.data;
          if (getSignedUrlResponse) {
            const signedUrl = getSignedUrlResponse.url;
            const headers = getSignedUrlResponse.data;

            // Create the form data
            let formBody = new FormData();

            Object.entries(headers).forEach((item: any) => {
              formBody.append(item[0], item[1]);
            });

            // sequence of file should be in the last otherwise it will cause an issue
            formBody.append('file', file);

            axios
              .request({
                method: 'post',
                url: signedUrl,
                data: formBody,
                onUploadProgress: (p) => {
                  subscribe.next({ progress: p.loaded / p.total! });
                },
              })
              .then((data) => {
                if (data.status === 204) {
                  subscribe.next({ progress: 1 });
                  const fileObject = {
                    path: key,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                  };
                  subscribe.next({ progress: 1, data: fileObject });
                  subscribe.complete();
                } else {
                  subscribe.error('something went wrong in file uploading');
                }
              })
              .catch((err) => {
                subscribe.error(`${JSON.stringify(err)}`);
              });
          }
        }
      })
      .catch((err) => {
        subscribe.error(`${JSON.stringify(err)}`);
      });
  });
};