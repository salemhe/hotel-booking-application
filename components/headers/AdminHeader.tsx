"use client"
// import React, { useEffect, useState } from 'react'
 import {
   SidebarTrigger,
 } from "@/components/ui/sidebar"
import { BellDot, ChevronDown } from "lucide-react"
import { getTimeBasedGreeting } from "../../utils/timeGreeting"

// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
function Header() {
   const {timePhrase, greeting} = getTimeBasedGreeting();
//   const [userData, setUserData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const fetchUserData = async (uid: string) => {
  
//     try {
//       setLoading(true);
//       const userDoc = await getDoc(doc(db, "users", uid));
//       if (userDoc.exists()) {
//         setUserData(userDoc.data());
//       } else {
//         console.error("User document does not exist.");
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchUserData(user.uid);
//       } else {
//         setUserData(null);
//       }
//     });
    
//     return () => unsubscribe();
//   }, []);

  return (
   <header className="flex h-20  items-center gap-2 w-full bg-white z-10 border-b border-gray-100  md:pr-64 group-has-data-[collapsible=icon]/sidebar-wrapper:pr-12 transition-[width,height] ease-linear fixed group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
   <div className="flex items-center justify-between gap- px-4 w-full">
     <div className="flex items-center justify-center gap-3">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden md:block">
         <h3 className="font-semibold text-[20px]/[30px] tracking-[0.15px] text-[#0a0a0a]">
            {timePhrase}, Admin
         </h3>
         <p className="font-normal text-[14px]/[21px] tracking-[0.25px] text-[#757575]">
            {greeting}
         </p>
      </div>
     </div>
     <div className="flex  justify-center items-center gap-4">
      <BellDot />
      <div className="flex justify-center items-center gap-4 border-l-2 border-gray-300 px-4">
         <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
            {/* {userData.name?.charAt(0).toUpperCase() || "U"} */}
             W
            </span>
         </div>
         <div className=" ">
            <h3 className="font-semibold text-[16px]/[24px] tracking-[0.5px] text-[#0a0a0a] ">Wejaya Raaj</h3>
            <p className="font-normal text-[14px]/[18px] tracking-[0.4px] text-[0a0a0a]">Admin</p> 
         </div>
         <ChevronDown className="text-[#0a0a0a] w-6 h-6" />
      </div>
     </div>

     
     {/* {loading ? (
          <div className="cursor-pointer border-b p-3 flex items-center justify-between transition-colors mb-4">
            <p>Loading user data...</p>
          </div>
        ) : userData ? (
          <div
            onClick={() => router.push("/profile")}
            className="cursor-pointer  flex items-center justify-between transition-colors "
          >
            {userData.profileImage ? (
              <Image
                src={userData.profileImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full w-10 h-10"
              />
            ) : (
              <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {userData.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p>No user data available.</p>
        )} */}
   </div>
 </header>
  )
}

export default Header