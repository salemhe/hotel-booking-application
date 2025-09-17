import { Mail, MapPin, Phone, Star } from "lucide-react";
import ClubInfo from "./ClubInfo";
import BookingForm from "../../BookingForm";
import MapComponent from "../../MapComponent";
import Link from "next/link";
import API from "@/lib/api";
import { Club } from "@/types/clubs";
import Images from "../vendors/Images";
import Images2 from "../vendors/Images2";
import BookingPopup from "../vendors/BookingPopup";
import SaveCopy from "../vendors/ui/SaveCopy";
import Navigation from "../../Navigation";
import Footer from "../../Footer";
const fetchClub = async (
  id: string
): Promise<{
  data: Club[];
}> => {
  try {
    const response = await API.get(`/vendors?vendorId=${id}`);
    const data = await response.data;
    return { data };
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};

const ClubPage = async ({ id }: { id: string }) => {
  const data = await fetchClub(id);
  const club = data.data[0];

  return (
    <>
      <div className="hidden md:block">
        <Navigation />
      </div>
      <main className="mx-auto md:mt-[85px] mb-[160px] md:mb-[16px] md:py-8 max-w-7xl md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <div className="w-full space-y-4 md:space-y-8">
            <div className="col-span-2">
              <div className="w-full space-y-6">
                <Images
                  images={club?.profileImages ?? []}
                  name={club.businessName}
                />
                <Images2
                  images={club?.profileImages ?? []}
                  name={club.businessName}
                />
                <div className="space-y-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                    <div className="flex gap-2 items-center pt-2 md:pt-0 px-4 md:px-0">
                      <h1 className="text-2xl text-[#111827] font-semibold">
                        {club.businessName}{" "}
                      </h1>{" "}
                      <span className="px-2 py-0.5 rounded-full border border-[#37703F] bg-[#D1FAE5] text-xs text-[#37703F]">
                        {" "}
                        {club.specials}
                      </span>
                    </div>
                    <SaveCopy id={id} />
                  </div>
                  <div className="md:flex hidden gap-1 items-center text-xs">
                    <Star className="fill-[#F0AE02] text-[#F0AE02] h-4" />{" "}
                    {club.rating}{" "}
                    <span className="text-[#6B7280]">
                      ({club.reviews.toLocaleString()} reviews)
                    </span>{" "}
                    <span className="size-1 rounded-full bg-black"></span>
                    {/* <span>{club.slots.toLocaleString()} booked</span> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <ClubInfo data={club} />
            </div>
          </div>
          <div className="space-y-8 px-4 md:px-0">
            <div className="p-4 rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] hidden md:block">
              <h2 className="text-[#111827] font-semibold text-xl">
                Reserve your Table
              </h2>
              <BookingForm id={id} />
            </div>
            <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-1">
              <MapComponent address={club.address} />
            </div>
            <div className="max-w-sm w-full p-4 rounded-2xl bg-white space-y-4 text-sm text-gray-800">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-black mt-1" />
                  <p>{club.address}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold w-full text-gray-900 mb-1">
                  Contact Information
                </h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-black mt-1" />
                  <a href={`tel:${club.phone}`} className="hover:underline">
                    {club.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Mail className="w-5 h-5 text-black mt-1" />
                  <a href={`mailto:${club.email}`} className="hover:underline">
                    {club.email}
                  </a>
                </div>
              </div>

              <div>
                <Link
                  href="#"
                  className="text-green-700 font-medium underline hover:text-green-900"
                >
                  Club website
                </Link>
              </div>
            </div>
          </div>
        </div>
        <BookingPopup id={id} />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default ClubPage;
