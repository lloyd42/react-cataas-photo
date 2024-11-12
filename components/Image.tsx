"use client";
import React, { CSSProperties, MouseEventHandler, useState } from "react";

const Image = ({
  src,
  alt,
  className,
  style,
  onClick,
  ...rest
}: {
  src: string;
  alt?: string;
  className?: string;
  onClick: MouseEventHandler<HTMLImageElement>;
  style?: CSSProperties;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <img
      src={
        error
          ? "https://placehold.co/400x600?text=Image\n+not+Found"
          : loading
          ? "https://placehold.co/600x400?text=loading..."
          : src
      }
      alt={error ? "Error" : alt}
      loading="lazy"
      className={className}
      style={style}
      onLoad={handleLoad}
      onError={handleError}
      onClick={onClick}
      {...rest}
    />
  );
};

export default Image;
