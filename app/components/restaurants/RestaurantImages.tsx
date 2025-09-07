// "use client";
// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import Image from "next/image";
// import { cn } from "@/app/lib/utils";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";

// const RestaurantImages = ({
//   images,
//   name
// }: {
//   images: {
//     url: string;
//   }[];
//   name: string;
// }) => {
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const imageStyle = (i: number) => {
//     switch (i) {
//       case 0:
//         return "row-span-5 col-span-2";
//       case 1:
//         return "row-span-2";
//       case 2:
//         return "row-span-3";
//       case 3:
//         return "row-span-3";
//       case 4:
//         return "row-span-2";
//       default:
//         break;
//     }
//   };

//   return (
//     <>
//       <div className="grid md:grid-flow-col gap-2 w-full rounded-xl overflow-clip h-[400px] md:h-[460px] relative">
//         <Button
//           onClick={() => {
//             setCurrentImageIndex(0);
//             setShowImageModal(true);
//           }}
//           className="cursor-pointer absolute bottom-3 right-2 z-10 bg-white text-black rounded-2xl hover:bg-gray-50"
//         >
//           See more photos
//         </Button>
//         {images.slice(0, 5).map((image, i) => (
//           <div key={i} className={`relative ${imageStyle(i)}`}>
//             <Image
//               src={image.url || "/hero-bg.png"}
//               className="object-cover cursor-pointer hover:opacity-80 duration-300"
//               alt={`${name} Image ${i + 1}`}
//               fill
//               onClick={() => {
//                 setCurrentImageIndex(i);
//                 setShowImageModal(true);
//               }}
//             />
//           </div>
//         ))}
//       </div>
//       {showImageModal && (
//         <div
//           className={cn(
//             "fixed inset-0 z-90 flex items-center justify-center p-2 h-screen w-full sm:p-4 backdrop-blur-sm bg-black/80"
//           )}
//         >
//           <button
//             onClick={() => setShowImageModal(false)}
//             className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/80 p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>

//           <div className="relative w-full max-w-7xl aspect-video max-h-[85vh]">
//             <div className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm">
//               Image {currentImageIndex + 1} of {images.length}
//             </div>

//             <div className="relative w-full h-full">
//               <Image
//                 src={images[currentImageIndex].url}
//                 alt={`${name} - Image ${currentImageIndex + 1}`}
//                 fill
//                 className="object-contain"
//                 quality={100}
//                 priority
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
//                 onError={(e) => {
//                   const img = e.target as HTMLImageElement;
//                   img.src = "/assets/fallback-image.jpg";
//                 }}
//               />
//             </div>

//             {images.length > 1 && (
//               <>
//                 {currentImageIndex > 0 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setCurrentImageIndex((prev) =>
//                         prev === 0 ? images.length - 1 : prev - 1
//                       );
//                     }}
//                     className="absolute left-2 sm:left-4 top-1/2 cursor-pointer -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
//                   >
//                     <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                   </button>
//                 )}
//                 {currentImageIndex !== images.length - 1 && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setCurrentImageIndex((prev) =>
//                         prev === images.length - 1 ? 0 : prev + 1
//                       );
//                     }}
//                     className="absolute right-2 sm:right-4 top-1/2 cursor-pointer -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
//                   >
//                     <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default RestaurantImages;


"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const RestaurantImages = ({
  images,
  name,
}: {
  images: {
    url: string;
  }[];
  name: string;
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageStyle = (i: number) => {
    switch (i) {
      case 0:
        return "row-span-5 col-span-2";
      case 1:
        return "row-span-2";
      case 2:
        return "row-span-3";
      case 3:
        return "row-span-3";
      case 4:
        return "row-span-2";
      default:
        break;
    }
  };

  return (
    <>
      {/* ---- MOBILE: SLIDER ---- */}
      <div className="sm:hidden w-full h-[300px]">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
        >
          {images.map((image, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative w-full h-[300px] cursor-pointer"
                onClick={() => {
                  setCurrentImageIndex(i);
                  setShowImageModal(true);
                }}
              >
                <Image
                  src={image.url || "/hero-bg.png"}
                  alt={`${name} Image ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ---- DESKTOP: GRID ---- */}
      <div className="hidden sm:grid md:grid-flow-col gap-2 w-full rounded-xl overflow-clip h-[400px] md:h-[460px] relative">
        <Button
          onClick={() => {
            setCurrentImageIndex(0);
            setShowImageModal(true);
          }}
          className="cursor-pointer absolute bottom-3 right-2 z-10 bg-white text-black rounded-2xl hover:bg-gray-50"
        >
          See more photos
        </Button>
        {images.slice(0, 5).map((image, i) => (
          <div key={i} className={`relative ${imageStyle(i)}`}>
            <Image
              src={image.url || "/hero-bg.png"}
              className="object-cover cursor-pointer hover:opacity-80 duration-300"
              alt={`${name} Image ${i + 1}`}
              fill
              onClick={() => {
                setCurrentImageIndex(i);
                setShowImageModal(true);
              }}
            />
          </div>
        ))}
      </div>

      {/* ---- MODAL (used by both) ---- */}
      {showImageModal && (
        <div
          className={cn(
            "fixed inset-0 z-90 flex items-center justify-center p-2 h-screen w-full sm:p-4 backdrop-blur-sm bg-black/80"
          )}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/80 p-2 hover:bg-white/10 rounded-full transition-colors z-50 cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="relative w-full max-w-7xl aspect-video max-h-[85vh]">
            <div className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm">
              Image {currentImageIndex + 1} of {images.length}
            </div>

            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex].url}
                alt={`${name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                quality={100}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/assets/fallback-image.jpg";
                }}
              />
            </div>

            {images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 cursor-pointer -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                )}
                {currentImageIndex !== images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 cursor-pointer -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RestaurantImages;
