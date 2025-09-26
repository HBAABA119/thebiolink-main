import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  width?: number;
  height?: number;
  showText?: boolean;
  className?: string;
  href?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 40,
  showText = true,
  className = '',
  href = '/',
}) => {
  const logoSrc = showText ? '/logo.svg' : '/favicon.svg';
  const logoAlt = 'LinkSpark Logo';
  
  const logoElement = (
    <Image 
      src={logoSrc} 
      alt={logoAlt} 
      width={width} 
      height={height} 
      priority 
      className={className}
    />
  );

  // If href is provided, wrap the logo in a Link component
  if (href) {
    return (
      <Link href={href}>
        {logoElement}
      </Link>
    );
  }

  // Otherwise, just return the logo
  return logoElement;
};

export default Logo;