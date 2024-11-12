"use client";
import Gallery from "@/components/Gallery";
import SearchPanel from "@/components/SearchPanel";
import { useState } from "react";

export default function Home() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const openPanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <main>
      <div className="flex justify-center items-center">
        <h1 className="text-5xl">Cataas</h1>
      </div>
      <br />
      <br />
      <Gallery />
      <button
        className="fixed bottom-[30px] right-[30px] bg-white rounded-full w-[50px] h-[50px] cursor-pointer flex justify-center items-center text-[24px] shadow-lg z-100"
        onClick={openPanel}
      >
        🔍
      </button>
      <SearchPanel show={isPanelOpen} onClose={closePanel} />
    </main>
  );
}
