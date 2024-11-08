import Gallery from "@/components/Gallery";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center">
        <h1 className="text-5xl">Cataas</h1>
      </div>
      <br />
      <br />
      <Gallery />
    </main>
  );
}
