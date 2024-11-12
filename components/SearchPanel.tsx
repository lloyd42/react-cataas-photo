"use client";
import { useTagStore } from "@/store";
import { useEffect, useState } from "react";

type Tag = {
  type: string;
  list: string[];
};

function classifyByFirstLetter(arr: string[]) {
  const result = new Map<string, string[]>();

  arr.forEach((item) => {
    const firstLetter = item.charAt(0).toUpperCase();
    const type = /^[A-Z]$/.test(firstLetter) ? firstLetter : "?";

    if (!result.get(type)) {
      result.set(type, []);
    }
    const list = result.get(type) as string[];
    list.push(item);
    result.set(type, list);
  });
  const formattedResult = [...result.keys()]
    .map((key) => ({
      type: key,
      list: result.get(key) ?? [],
    }))
    .sort((a, b) => (a.type < b.type ? -1 : 1));

  return formattedResult;
}

const SearchPanel = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  const [tagList, setTagList] = useState<Tag[]>([]);

  const tags = useTagStore((state) => state.tags);
  const setTags = useTagStore((state) => state.setTags);
  const delTags = useTagStore((state) => state.delTags);

  const fetchTags = async () => {
    return await fetch(`https://cataas.com/api/tags`).then(async (response) => {
      const data = (await response.json()) as string[];
      const tagList = classifyByFirstLetter([...new Set(data)]);
      setTagList(tagList);
    });
  };

  useEffect(() => {
    fetchTags();

    document.body.addEventListener("click", (e) => {
      if ((e.target as Node).contains(document.body)) onClose();
    });

    return () => {
      document.body.removeEventListener("click", (e) => {
        if ((e.target as Node).contains(document.body)) onClose();
      });
    };
  }, []);

  useEffect(() => {
    const searchPanel = document.getElementById("search-panel");
    if (show) {
      searchPanel?.classList.add("opacity-100");
      searchPanel?.classList.add("translate-y-[0%]");
    } else {
      // 移除动画类后，等待动画结束再移除 DOM 节点
      setTimeout(() => {
        searchPanel?.classList.remove("opacity-100");
        searchPanel?.classList.remove("translate-y-[0%]");
      }, 300); // 与 CSS 中的 transition 时间一致
    }
  }, [show]);

  return (
    <div
      id="search-panel"
      className={`fixed bottom-5 left-[calc(50%-300px)] z-50 translate-y-[110%] opacity-0 transition-[opacity,transform] ease-in-out duration-300 delay-0 rounded-lg flex flex-col w-[600px] h-[400px] px-12 bg-white text-black`}
    >
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-center py-3 shadow-[0_5px_5px_-5px_rgba(0,0,0,0.3)]">
          {tagList.map(({ type }, index) => {
            return (
              <a
                className="mr-2 last-of-type:mr-0 hover:text-blue-600 underline"
                key={type}
                href={`#${type}`}
              >
                {type}
              </a>
            );
          })}
        </div>

        <div className="overflow-y-scroll no-scrollbar flex-1 py-2">
          {tagList.map(({ type, list }, index) => {
            return (
              <div key={type + index} id={`${type}`} className="flex flex-col">
                <div className="flex justify-center">
                  <b>
                    <h3>{type}</h3>
                  </b>
                </div>
                <div className="flex flex-wrap">
                  {list.map((i, index) => {
                    return (
                      <code
                        key={i + index}
                        className={
                          "mr-2 last-of-type:mr-0 hover:text-blue-600 cursor-pointer " +
                          `${
                            tags.includes(i) ? "text-gray-500 line-through" : ""
                          }`
                        }
                        onClick={() => {
                          const isExist = tags.includes(i);
                          if (!isExist) setTags(i);
                          else delTags(i);
                        }}
                      >
                        {i};
                      </code>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
