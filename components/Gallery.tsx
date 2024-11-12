"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import Image from "./Image";
import { useTagStore } from "@/store";

const InfiniteScroll = dynamic(() => import("react-infinite-scroll-component"));
const Masonry = dynamic(() => import("react-masonry-css"));

type CatInfo = {
  _id: string;
  mimetype: string;
  size: number;
  tags: string[];
};

type ItemInfo = {
  id: string;
  src: string;
  tags: string[];
};

function isPageVerticallyScrollable(): boolean {
  return (
    document.body.scrollHeight > window.innerHeight ||
    document.documentElement.scrollHeight > window.innerHeight
  );
}

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const breakpointColumnsObj = {
  default: 4,
  1000: 3,
  700: 2,
  500: 1,
};

export default function Gallery() {
  const [images, setImages] = useState<ItemInfo[]>([]);
  const [page, setPage] = useState(1);

  const [index, setIndex] = useState(-1);

  const tags = useTagStore((state) => state.tags);

  const fetchImages = () => {
    return fetch(
      `https://cataas.com/api/cats?${
        tags.length > 0 ? "tags=" + tags.join(",") + "&" : ""
      }skip=${page}&limit=20`
    ).then(async (response) => {
      const data = (await response.json()) as CatInfo[];
      const images = data.map((cat) => ({
        id: cat._id,
        src: "https://cataas.com/cat/" + cat._id,
        tags: cat.tags,
      }));
      setImages((prevImages) => [...prevImages, ...images]);
      setPage((prevPage) => prevPage + 1);
    });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    setImages([]);
    setPage(1);
    fetchImages();
  }, [tags]);

  return (
    <InfiniteScroll
      dataLength={images.length}
      next={fetchImages}
      hasMore={true}
      loader={<h4>Loading...</h4>}
    >
      <Lightbox
        slides={images}
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        // enable optional lightbox plugins
        plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
      />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {images.length > 0 ? (
          images.map((image, index) => {
            return (
              <div
                className="flex flex-col rounded-md overflow-hidden"
                key={image.id + index}
              >
                <div className="w-full overflow-hidden flex-1">
                  <Image
                    src={image.src}
                    alt={image.tags.join(";")}
                    className="cursor-pointer origin-center object-cover transition ease delay-150 hover:scale-[1.1]"
                    onClick={() => setIndex(index)}
                  />
                </div>
                <p className="bg-slate-800 p-2 flex justify-center items-center">
                  {image.tags.join("; ")}
                </p>
              </div>
            );
          })
        ) : (
          <div>No cat.</div>
        )}
      </Masonry>
    </InfiniteScroll>
  );
}
