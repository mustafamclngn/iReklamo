import React from "react";
import DirectoryLayout from "./directoryLayout";

const HotlinePage = () => {
  const hotlines = {
    offices: [
      {
        id: 1,
        name: "ILIGAN CITY RISK REDUCTION MANAGEMENT",
        contact: "221 - 8459",
      },
      {
        id: 2,
        name: "CIVIL SERVICE",
        contact: "09777202406",
      },
      {
        id: 3,
        name: "ILIGAN CITY FIRE DEPARTMENT CENTRAL OFFICE",
        contact: "160 / 221-9055 / 221-9056",
      },
      {
        id: 4,
        name: "BANTAY BATA",
        contact: "163",
      },
      {
        id: 5,
        name: "ILIGAN LIGHT AND POWER INCORPORATED",
        contact: "221 - 5708 / 223 - 1188 / 221 - 5709 / 222 - 2777",
      },
      {
        id: 6,
        name: "TRAFFIC DIVISION K9 UNIT TAMBO",
        contact: "222 - 6275 / 199",
      },
      {
        id: 7,
        name: "PDEA TIPANOY",
        contact: "225 - 3216",
      },
      {
        id: 8,
        name: "TRAFFIC DIVISION",
        contact: "222 - 6275 / 119",
      },
      {
        id: 9,
        name: "NBI",
        contact: "223 -2359",
      },
    ],
    policeStations: [
      {
        id: 10,
        name: "ILIGAN CITY POLICE OFFICE",
        contact: "0917-712-7411 / 0998-955-3538 / 221-6699 / 167",
      },
      {
        id: 11,
        name: "ILIGAN CITY POLICE STATION 2 - NUNUCAN",
        contact: "0917-725-2854 / 0998-598-7008 / 165",
      },
      {
        id: 12,
        name: "ILIGAN CITY POLICE STATION 4 - TUBOD",
        contact: "0935-484-7972 / 224-4088 / 162",
      },
      {
        id: 13,
        name: "ILIGAN CITY POLICE STATION 6",
        contact: "0927-383-2181",
      },
      {
        id: 14,
        name: "ILIGAN CITY PNP HEADQUARTERS",
        contact: "221 - 6699 / 166",
      },
      {
        id: 15,
        name: "ILIGAN CITY POLICE STATION 1 - TAMBO",
        contact: "0917-166-3440 / 221-9315 / 911",
      },
      {
        id: 16,
        name: "ILIGAN CITY POLICE STATION 3 - TAG-IBO",
        contact: "0935-432-0803 / 225-2091 / 168",
      },
      {
        id: 17,
        name: "ILIGAN CITY POLICE STATION 5 - POBLACION",
        contact: "0965-539-0808 / 225-5505 / 166",
      },
      {
        id: 18,
        name: "ILIGAN CITY MOBILE FORCE COMPANY",
        contact: "0955-901-6880",
      },
      {
        id: 19,
        name: "PNP CRIME LABORATORY TIPANOY",
        contact: "221 - 0499",
      },
    ],
    hospitals: [
      {
        id: 20,
        name: "DR. UY HOSPITAL INC.",
        contact: "225 - 4530",
      },
      {
        id: 21,
        name: "E&R HOSPITAL",
        contact: "223 - 4246",
      },
      {
        id: 22,
        name: "ADVENTIST MEDICAL CENTER",
        contact: "221 - 3636",
      },
      {
        id: 23,
        name: "ST. ANTHONY MATERNITY'S AND CHILD",
        contact: "221 - 5748",
      },
      {
        id: 24,
        name: "ST MARY'S MATERNITY & CHILDREN'S HOSPITAL",
        contact: "221 - 3210",
      },
      {
        id: 25,
        name: "ILIGAN CITY HOSPITAL GTLMH",
        contact: "223 - 0602",
      },
      {
        id: 26,
        name: "ILIGAN MEDICAL CENTER",
        contact: "221 - 4661",
      },
      {
        id: 27,
        name: "MERCY COMMUNITY HOSPITALS INC.",
        contact: "221 - 3762",
      },
      {
        id: 28,
        name: "ILIGAN CITY AMBULANCE GTLMH",
        contact: "221-0081 / 221-6775",
      },
    ],
    cdrrmo: [
      {
        id: 29,
        name: "HOTLINE",
        contact: "811 / 812 / 221 - 8459",
      },
      {
        id: 30,
        name: "COMMUNICATION",
        contact: "221-9055 / 221-9056",
      },
      {
        id: 31,
        name: "MOBILE",
        contact: "0997-726-2692 / 0929-466-5777",
      },
      {
        id: 32,
        name: "ILIGAN CITY RISK DISASTER COORDINATING COUNCIL",
        contact: "225 - 3215",
      },
    ],
  };

  const HotlineCard = ({ hotline }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-lg transition-transform duration-300 overflow-hidden border border-gray-300 relative hover:scale-105">
      <div className="flex items-center">
        <div className="w-40 h-40 flex-shrink-0 bg-teal-500 flex items-center justify-center p-6">
          <img
            src="/images/telephone.png"
            alt="Telephone"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1 p-6">
          <h3 className="font-black text-xl mb-2">{hotline.name}</h3>
          <p className="text-teal-500 text-lg font-bold">{hotline.contact}</p>
        </div>
      </div>
    </div>
  );

  return (
    <DirectoryLayout>
      <div className="space-y-12">
        <div>
          <h2 className="text-4xl font-bold mb-8">Offices</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotlines.offices.map((hotline) => (
              <HotlineCard key={hotline.id} hotline={hotline} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-8">
            Iligan City Police Stations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotlines.policeStations.map((hotline) => (
              <HotlineCard key={hotline.id} hotline={hotline} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-8">Hospitals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotlines.hospitals.map((hotline) => (
              <HotlineCard key={hotline.id} hotline={hotline} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-8">CDRRMO Iligan City</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotlines.cdrrmo.map((hotline) => (
              <HotlineCard key={hotline.id} hotline={hotline} />
            ))}
          </div>
        </div>
      </div>
    </DirectoryLayout>
  );
};

export default HotlinePage;
