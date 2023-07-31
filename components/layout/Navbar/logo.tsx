
import React from 'react';

type LogoProps = {
  className?: string;
  src?: string | '';
  alt?: string | 'Logo here';
}

const Logo = ({ className, src, alt }: LogoProps) => (<img className={className} src={src} alt={alt} />);

export default Logo;
