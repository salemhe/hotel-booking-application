This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash--- a/README.md
+++ b/README.md
@@
- This is a Next.js project bootstrapped with create-next-app.
+ # SUPREME Hotel Booking Application
+
+ This is a Next.js 14 application for hotel booking (forked from `salemhe/hotel-booking-application`).
+ 
+ ## Getting Started
+ 
+ ### 1) Install
+ ```bash
+ pnpm install # or npm install / yarn
+ ```
+ 
+ ### 2) Run dev
+ ```bash
+ pnpm dev
+ ```
+ 
+ The app runs at http://localhost:3000
+ 
+ ## Tech
+ - Next.js 14 (App Router)
+ - TypeScript
+ - Tailwind CSS
+ 
+ ## Contributing
+ - Use a single ESLint config (see below).
+ - Run `pnpm lint` and `pnpm typecheck` before pushing.
+ 
+ ## License
+ MIT
@@
- import React from "react"; import { FiSearch, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
- 
- const SearchSection = () => { return (
-         <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
-           <FiCalendar className="min-w-[20px] h-5 text-text-secondary" />
-           <input
-             type="date"
-             className="w-full focus:outline-none text-text-primary text-sm sm:text-base"
-           />
-         </div>
-         <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
-           <FiClock className="min-w-[20px] h-5 text-text-secondary" />
-           <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
-             <option>12:00 PM</option>
-             <option>12:30 PM</option>
-             <option>1:00 PM</option>
-             {/* Add more time options */}
-           </select>
-         </div>
-         <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
-           <FiUsers className="min-w-[20px] h-5 text-text-secondary" />
-           <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
-             <option>2 People</option>
-             <option>3 People</option>
-             <option>4 People</option>
-             {/* Add more party size options */}
-           </select>
-         </div>
-         <div className="flex items-center justify-center sm:justify-end w-full">
-           <button className="w-full sm:w-auto bg-primary flex justify-center items-center gap-2 rounded-full text-white px-6 py-3 sm:py-2 bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:bg-green-600 transition-colors">
-             <FiSearch className="w-5 h-5" />
-             <span className="text-sm sm:text-base">Search</span>
-           </button>
-         </div>
-       </div>
-     </div>
- 
- ); };
- 
- export default SearchSection;

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


import React from "react";
import { FiSearch, FiCalendar, FiClock, FiUsers } from "react-icons/fi";

const SearchSection = () => {
  return (
    <div className="bg-white z-50 absolute top-35 w-[90%] mx-auto left-0 right-0 rounded-2xl sm:rounded-full shadow-lg p-4 sm:p-2 justify-center mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiSearch className="min-w-[20px] h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Location, Restaurant, or Cuisine"
            className="w-full focus:outline-none text-text-primary text-sm sm:text-base"
          />
        </div>

        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiCalendar className="min-w-[20px] h-5 text-text-secondary" />
          <input
            type="date"
            className="w-full focus:outline-none text-text-primary text-sm sm:text-base"
          />
        </div>

        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiClock className="min-w-[20px] h-5 text-text-secondary" />
          <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
            <option>12:00 PM</option>
            <option>12:30 PM</option>
            <option>1:00 PM</option>
            {/* Add more time options */}
          </select>
        </div>

        <div className="flex items-center space-x-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
          <FiUsers className="min-w-[20px] h-5 text-text-secondary" />
          <select className="w-full focus:outline-none text-text-primary bg-transparent text-sm sm:text-base">
            <option>2 People</option>
            <option>3 People</option>
            <option>4 People</option>
            {/* Add more party size options */}
          </select>
        </div>
        
        <div className="flex items-center justify-center sm:justify-end w-full">
          <button className="w-full sm:w-auto bg-primary flex justify-center items-center gap-2 rounded-full text-white px-6 py-3 sm:py-2 bg-gradient-to-b from-[#0A6C6D] to-[#08577C] hover:bg-green-600 transition-colors">
            <FiSearch className="w-5 h-5" />
            <span className="text-sm sm:text-base">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
