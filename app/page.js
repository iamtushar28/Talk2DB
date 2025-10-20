import Image from "next/image";
import Navbar from "./components/common/Navbar";
import Hero from "./components/common/Hero";
import Result from "./components/common/Result";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <Result /> */}
    </>
  );
}
