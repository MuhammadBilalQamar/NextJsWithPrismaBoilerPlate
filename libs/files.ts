import axios from 'axios';
import { Observable } from 'zen-observable-ts';
import { File as FileType } from '@prisma/client';

// Usage:
// const uploadToClient = async (event: any) => {
//   if (event.target.files && event.target.files[0]) {
//     uploadToServer(event.target.files[0]).subscribe((progress) => {});
//   }
// };
export const uploadToServer = (
  file: File
): Observable<{ progress: number; data?: FileType }> => {
  return new Observable<{ progress: number; data?: FileType }>((subscribe) => {
    const body = new FormData();
    body.append('file', file);

    axios
      .request({
        method: 'post',
        url: '/api/file',
        data: body,
        onUploadProgress: (p) => {
          subscribe.next({ progress: p.loaded / p.total! });
        },
      })
      .then((data) => {
        subscribe.next({ progress: 1 });
        subscribe.next({ progress: 1, data: data.data });
        subscribe.complete();
      });
  });
};
