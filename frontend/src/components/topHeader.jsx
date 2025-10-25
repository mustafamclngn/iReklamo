import React from "react";

const TopHeader = () => {
  return (
    <header className="font-[Montserrat,sans-serif]">
      <div className="bg-[#ECECEC] border-b border-[#e2e2e2] py-3">
      <div className="max-w-[1591px] mx-auto px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">
              The Official Website of the City Government of Iligan
            </span>
            <img
              src="/phflagicon.png"
              className="h-5"
              alt="Philippine Flag"
              loading="lazy"
            />
          </div>

          <div className="flex items-center gap-6">
            <ul className="flex gap-6 text-sm items-center m-0 p-0 list-none">
              <li>
                <a href="#" className="text-[#333] no-underline hover:text-black">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-[#333] no-underline hover:text-black">
                  Departments
                </a>
              </li>
              <li>
                <a href="#" className="text-[#333] no-underline hover:text-black">
                  Barangays
                </a>
              </li>
              <li>
                <a href="#" className="text-[#333] no-underline hover:text-black">
                  Hotline Directory
                </a>
              </li>
              <li>
                <a href="#" className="text-[#333] no-underline hover:text-black">
                  Contact Us
                </a>
              </li>
            </ul>
            
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 bg-[#ECECEC] rounded-full flex items-center justify-center"
            >
              <img
                src="/fbicon.png"
                height="14"
                alt="Facebook"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;