'use client';
import React, { useEffect, useState } from 'react';
import { useFetch } from 'libs/useFetch';
import SkeletonCard from './SkeletonCard';

const ImageComponent = ({ signedURl, className }: any) => {
  return (
    <>
      <div className="mr-4">
        <div>
          <img className={className} src={signedURl} />
        </div>
      </div>
    </>
  );
};

const VideoComponent = ({ signedURl, className }: any) => {
  return (
    <>
      <div className="mr-4">
        <div>
          <video
            controls
            className={className}
          >
            <source src={signedURl} type="video/mp4" />
            <source src={signedURl} type="video/ogg" />
            Your browser does not support the video element.
          </video>
        </div>
      </div>
    </>
  );
};

const NormalFileComponent = ({ signedURl, file, onDelete }: any) => {
  return (
    <>
      <a
        href={signedURl}
        download={file.name}
      >
        <div className="mr-4">
          <div className="step-resume-box">
            <img src="/images/join/pdf-icon.png" />
          </div>
          <button type="button" className="btn step-portfolio-del-btn" onClick={onDelete}>Delete</button>
        </div>
      </a>
    </>
  );
};

const MediaComponent = ({ file, onDelete, className }: any) => {
  let [signedURl, setSignedURl] = useState<any>(null);
  const [loadFile] = useFetch('/api/s3', '', '', 'POST', false);
  useEffect(() => {
    if (!signedURl) {
      const loadImageWrapper = async (file: any) => {
        try {
          if (!file) throw new Error('no file');
          const data = await loadFile({ path: file.path }).catch();
          if (!data.url) throw new Error('no file');
          setSignedURl(data.url);
        } catch {
          setSignedURl('/images/no-images.svg');
        }
      };
      loadImageWrapper(file).catch();
    }
  }, [signedURl, file]);

  return (
    <>
      {!signedURl ? (
        <SkeletonCard className={className} stips={3}
        />
      ) : file?.type.includes('image') ? (
        <div>
          <ImageComponent
            signedURl={signedURl}
            onDelete={onDelete}
            className={className}
          />
        </div>
      ) : file?.type.includes('video') ? (
        <div>
          <VideoComponent
            signedURl={signedURl}
            className={className}
          />
        </div>
      ) : file ? (
        <div>
          <NormalFileComponent
            signedURl={signedURl}
            file={file}
            onDelete={onDelete}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const MediaComponentMemo = React.memo(MediaComponent, (a, b) => {
  return a?.file?.path == b?.file?.path;
});

export default MediaComponentMemo;