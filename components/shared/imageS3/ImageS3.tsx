import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFetch } from '../../../libs/useFetch';
import { ImageProps } from 'next/dist/client/image';
import { File } from '@prisma/client';

interface ImageS3Props extends ImageProps {
  file?: File | null;
  style?: any;
}

export default function ImageS3(props: ImageS3Props) {
  const [signedURl, setSignedURl] = useState('/team-avatar.png');
  const [loadImage] = useFetch('/api/s3', '', '', 'POST', false);
  useEffect(() => {
    const loadImageWrapper = async () => {
      try {
        const file = props?.file;
        if (!file) throw new Error('no file');
        const data = await loadImage({ path: file.path }).catch();
        if (!data.url) throw new Error('no file');
        setSignedURl(data.url);
      } catch {
        // empty
      }
    };

    loadImageWrapper().catch();
  }, [props.file]);

  return (
    <Image
      src={signedURl}
      className={props.className}
      alt={'Image'}
      fill={props.fill}
      width={props.width}
      height={props.height}
      style={props.style}
    ></Image>
  );
}
