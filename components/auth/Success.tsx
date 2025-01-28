"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="bg-[#979797] w-full h-screen flex items-center justify-center">
      <div className="w-[95vw] bg-white h-[95vh] rounded-lg overflow-auto flex flex-col py-8">
        <Link
          href="/"
          className="font-medium text-4xl leading-[54px] mb-4 md:mb-[31px] mt-1 text-center"
        >
          LOGO
        </Link>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center text-center max-w-sm space-y-6">
            <div className="relative">
              <div>
                <svg
                  className="size-[100px]"
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M80.7808 7.96925C86.075 3.39282 93.925 3.39282 99.2192 7.96925C102.975 11.2159 108.162 12.2477 112.874 10.6854C119.517 8.48338 126.769 11.4874 129.909 17.7415C132.137 22.1784 136.534 25.1165 141.486 25.4766C148.465 25.9841 154.016 31.5348 154.523 38.5144C154.884 43.466 157.822 47.8632 162.258 50.0908C168.513 53.2307 171.517 60.4831 169.315 67.1256C167.752 71.8381 168.784 77.0249 172.031 80.7808C176.607 86.075 176.607 93.925 172.031 99.2192C168.784 102.975 167.752 108.162 169.315 112.874C171.517 119.517 168.513 126.769 162.258 129.909C157.822 132.137 154.884 136.534 154.523 141.486C154.016 148.465 148.465 154.016 141.486 154.523C136.534 154.884 132.137 157.822 129.909 162.258C126.769 168.513 119.517 171.517 112.874 169.315C108.162 167.752 102.975 168.784 99.2192 172.031C93.925 176.607 86.075 176.607 80.7808 172.031C77.0249 168.784 71.8381 167.752 67.1256 169.315C60.4831 171.517 53.2307 168.513 50.0908 162.258C47.8632 157.822 43.466 154.884 38.5144 154.523C31.5348 154.016 25.9841 148.465 25.4766 141.486C25.1165 136.534 22.1784 132.137 17.7415 129.909C11.4874 126.769 8.48338 119.517 10.6854 112.874C12.2477 108.162 11.2159 102.975 7.96925 99.2192C3.39282 93.925 3.39282 86.075 7.96925 80.7808C11.2159 77.0249 12.2477 71.8381 10.6854 67.1256C8.48338 60.4831 11.4874 53.2307 17.7415 50.0908C22.1784 47.8632 25.1165 43.466 25.4766 38.5145C25.9841 31.5348 31.5348 25.9841 38.5145 25.4766C43.466 25.1165 47.8632 22.1784 50.0908 17.7415C53.2307 11.4874 60.4831 8.48338 67.1256 10.6854C71.8381 12.2477 77.0249 11.2159 80.7808 7.96925Z"
                    fill="#0C0C0C"
                  />
                  <g filter="url(#filter0_d)">
                    <circle cx="90" cy="90" r="64.6734" fill="white" />
                  </g>
                  <mask
                    id="mask0"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="40"
                    y="40"
                    width="101"
                    height="101"
                  >
                    <rect
                      x="40"
                      y="40"
                      width="100.877"
                      height="100.877"
                      fill="#D9D9D9"
                    />
                  </mask>
                  <g mask="url(#mask0)">
                    <path
                      d="M84.1476 109.367L113.78 79.7342L107.896 73.8497L84.1476 97.5978L72.1684 85.6187L66.2839 91.5032L84.1476 109.367ZM90.0321 132.064C84.2176 132.064 78.7535 130.961 73.6396 128.754C68.5257 126.547 64.0773 123.553 60.2944 119.77C56.5115 115.987 53.5167 111.538 51.31 106.425C49.1033 101.311 48 95.8465 48 90.0321C48 84.2176 49.1033 78.7535 51.31 73.6396C53.5167 68.5257 56.5115 64.0773 60.2944 60.2944C64.0773 56.5115 68.5257 53.5167 73.6396 51.31C78.7535 49.1033 84.2176 48 90.0321 48C95.8465 48 101.311 49.1033 106.425 51.31C111.538 53.5167 115.987 56.5115 119.77 60.2944C123.553 64.0773 126.547 68.5257 128.754 73.6396C130.961 78.7535 132.064 84.2176 132.064 90.0321C132.064 95.8465 130.961 101.311 128.754 106.425C126.547 111.538 123.553 115.987 119.77 119.77C115.987 123.553 111.538 126.547 106.425 128.754C101.311 130.961 95.8465 132.064 90.0321 132.064ZM90.0321 123.658C99.4192 123.658 107.37 120.4 113.885 113.885C120.4 107.37 123.658 99.4192 123.658 90.0321C123.658 80.6449 120.4 72.6938 113.885 66.1789C107.37 59.6639 99.4192 56.4064 90.0321 56.4064C80.6449 56.4064 72.6938 59.6639 66.1789 66.1789C59.6639 72.6938 56.4064 80.6449 56.4064 90.0321C56.4064 99.4192 59.6639 107.37 66.1789 113.885C72.6938 120.4 80.6449 123.658 90.0321 123.658Z"
                      fill="#43D649"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d"
                      x="21.7086"
                      y="25.3267"
                      width="136.583"
                      height="136.583"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="3.61809" />
                      <feGaussianBlur stdDeviation="1.80905" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">
                Account created successfully!
              </h1>
              <p className="text-muted-foreground">
                Welcome aboard! Start your success journey with SimpleFlow!
              </p>
            </div>

            <Button
              className="w-full bg-black text-white hover:bg-black/90 mt-[20px]"
              size="lg"
              onClick={() => {
                if (type === "vendor") {
                  router.push("/vendorDashboard");
                } else {
                  router.push("/userDashboard");
                }
              }}
            >
              Let&apos;s Start!
            </Button>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
