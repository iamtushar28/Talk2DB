'use client'
import { useState } from "react";
import { MdZoomOutMap } from "react-icons/md";

export default function ZigZagSteps({ steps }) {
    const [viewerImage, setViewerImage] = useState(null);

    return (
        <div className="w-full">

            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`h-96 w-full mt-10 px-2 md:px-4 flex gap-6 md:gap-0 flex-col items-center justify-center md:flex-row ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                        }`}
                >

                    {/* Text */}
                    <div className={`w-full md:w-[45%] ${index % 2 !== 0 ? "md:pl-8" : "md:pr-8"}`}>
                        <div className="w-fit px-2 py-[1px] mb-1 text-xs font-semibold border border-gray-200 rounded-3xl">
                            <p>{step.shortTitle}</p>
                        </div>
                        <h2 className="text-2xl font-semibold">{step.title}</h2>
                        <p className="text-gray-400">{step.subtitle}</p>
                    </div>

                    {/* Image box */}
                    <div
                        className="h-72 w-full md:w-[45%] rounded-xl border border-gray-100 p-[2px] shadow-lg md:shadow-xl relative cursor-pointer"
                        onClick={() => setViewerImage(step.image)}
                    >
                        <div className="relative w-full h-full overflow-hidden rounded-xl">
                            <img
                                src={step.image}
                                alt="Step Visual"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <MdZoomOutMap className="text-4xl text-purple-500 absolute inset-0 m-auto" />
                    </div>

                </div>
            ))}

            {/* Image Viewer Overlay */}
            {viewerImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-2 md:p-10"
                    onClick={() => setViewerImage(null)}
                >
                    <div className="relative w-full max-w-5xl h-auto md:h-[80vh] p-[1px] md:p-1 rounded-xl">
                        <img
                            src={viewerImage}
                            alt="Full View"
                            className="w-full h-full object-fit rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
