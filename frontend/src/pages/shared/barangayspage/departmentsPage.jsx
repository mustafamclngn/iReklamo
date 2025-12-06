import React from "react";
import DirectoryLayout from "./directoryLayout";

const DepartmentsPage = () => {
  const departments = {
    socialServices: [
      {
        id: 1,
        name: "Iligan City Sports Office (ICSO)",
        logo: "/images/departments/1.png",
        head: "OIC Head - Karl Badelles",
        contact: "citysports@iligan.gov.ph",
      },
      {
        id: 2,
        name: "Iligan City Drug Treatment and Rehabilitation Center (ICDTRC)",
        logo: "/images/departments/2.png",
        head: "Head - Maricar Y. Go",
        contact: "0926 778 8300 / icdtrc@iligan.gov.ph",
      },
      {
        id: 3,
        name: "Local School Board",
        logo: "/images/iligancityseal.png",
        head: "Head - Jennifer P. Densing",
        contact: "09955242205",
      },
      {
        id: 4,
        name: "Iligan City Waterworks Systems (ICWS)",
        logo: "/images/departments/4.png",
        head: "OIC Head - Engr. Jaime C. Sato",
        contact: "228-3288 / 221-4810 / icws@iligan.gov.ph",
      },
      {
        id: 5,
        name: "City Environment Management Office (CEMO)",
        logo: "/images/iligancityseal.png",
        head: "Head - EnP Virgilio B. Encabo, JD",
        contact: "222-8211 / 09154633775 / cenro@iligan.gov.ph",
      },
      {
        id: 6,
        name: "City Disaster Risk Reduction and Management Office (CDRRMO)",
        logo: "/images/departments/6.png",
        head: "Head - Armien P. Alorro, MSSW",
        contact: "221-8459 / 09177160826",
      },
      {
        id: 7,
        name: "City Registrar's Office",
        logo: "/images/departments/7.png",
        head: "Head - Atty. Yussif Don Justin F. Martil, REB",
        contact: "221-4308 / 09569322306 / ccro@iligan.gov.ph",
      },
      {
        id: 8,
        name: "Iligan City Gender and Development Office (GAD)",
        logo: "/images/departments/8.png",
        head: "Head - Al-Azenereeh R. Madale",
        contact: "223-8091 / 09171428080 / gad@iligan.gov.ph",
      },
      {
        id: 9,
        name: "Public Order Safety, Security & Command Center",
        logo: "/images/departments/9.png",
        head: "Head - P/LTCOL ADONIS L. MUTYA (Ret)",
        contact: "posscc@iligan.gov.ph",
      },
      {
        id: 10,
        name: "Sangguniang Panglungsod",
        logo: "/images/departments/10.png",
        head: "Head - Hon. Marianito D. Alemania",
        contact:
          "0917-777-5397 / sp.secretariat@iligan.gov.ph / cvmo@iligan.gov.ph",
      },
      {
        id: 11,
        name: "Iligan City Anti-Drug Abuse Council (CMO - ICADAC)",
        logo: "/images/departments/11.png",
        head: "OIC Head - Rowel C. Rubio",
        contact: "222-0670 / icadac@iligan.gov.ph",
      },
      {
        id: 12,
        name: "Gregorio T. Lluch Memorial Hospital",
        logo: "/images/departments/12.png",
        head: "Head - Dr. Richillo C. Daguman,MD, FPOA, MPSM",
        contact: "221-6775 / 0926-111-0698 / gtlmh@iligan.gov.ph",
      },
      {
        id: 13,
        name: "Civil Security Unit (CSU)",
        logo: "/images/departments/13.png",
        head: "OIC Head - Antolin V. Alcudia Jr., CSSP",
      },
      {
        id: 14,
        name: "City Social Welfare and Development Council (CSWD)",
        logo: "/images/departments/14.png",
        head: "OIC Head - Evelyn S. Madrio",
        contact: "224-4311 / 09153213396 / cswd@iligan.gov.ph",
      },
      {
        id: 15,
        name: "Office of the Senior Citizen Affairs (OSCA)",
        logo: "/images/iligancityseal.png",
        head: "OIC Head - Elmer Marcella",
        contact: "09553385109",
      },
      {
        id: 16,
        name: "City Health Office (CHO)",
        logo: "/images/departments/16.png",
        head: "Head - Dr. Glenn L. Manarpaac",
        contact: "09176411627 / 221-7646 / cho@iligan.gov.ph",
      },
    ],
    publicAdministration: [
      {
        id: 17,
        name: "Barangay Affairs Office (BAO)",
        logo: "/images/departments/17.png",
        head: "Head - Marlon Clapano",
        contact: "09152828354 / 223-9615",
      },
      {
        id: 18,
        name: "City Information Office (CIO)",
        logo: "/images/departments/18.png",
        head: "Head - Alfredo B. Paradela III",
        contact: "+0632228115 / +0632228115",
      },
      {
        id: 19,
        name: "Information and Communications Technology Center (ICTC)",
        logo: "/images/iligancityseal.png",
        head: "OIC Head - Nouvell Krish Aehmery A. Lagapa",
        contact: "228-1405",
      },
      {
        id: 20,
        name: "City Planning And Development Office (CPDO)",
        logo: "/images/departments/20.png",
        head: "Head - Enp. Elsa M. Maquiling",
        contact: "221-5388 / cpdo@iligan.gov.ph",
      },
      {
        id: 21,
        name: "City Human Resource Management Office (CHRMO)",
        logo: "/images/departments/21.png",
        head: "OIC Head - Ceferino V. Sanchez, Jr.",
        contact: "221-0595 / 09178945611 / chrmo@iligan.gov.ph",
      },
      {
        id: 22,
        name: "City Legal Office (CLO)",
        logo: "/images/iligancityseal.png",
        head: "Head - Atty. Roberto C. Padilla",
        contact: "221-3818 / clo@iligan.gov.ph",
      },
      {
        id: 23,
        name: "City General Services Office (CGSO)",
        logo: "/images/departments/23.png",
        head: "Head - Mila A. Rodrigo",
        contact: "221-4341 / 09171272823 / cgso@iligan.gov.ph",
      },
    ],
    infrastructure: [
      {
        id: 24,
        name: "Office Of The City Building Official (OCBO)",
        logo: "/images/iligancityseal.png",
        head: "Head - Engr. Leonardo D. Hamoy",
        contact: "09177151563 / 222-6384",
      },
      {
        id: 25,
        name: "City Engineer's Office (CEO)",
        logo: "/images/departments/24.png",
        head: "Head - Engr. Leonor T. Actub",
        contact: "221-4645 / 09159859637 / ceo@iligan.gov.ph",
      },
    ],
  };

  const DepartmentCard = ({ department }) => (
    <div className="bg-gray-200 rounded-xl shadow-lg hover:shadow-lg transition-transform duration-300 overflow-hidden border border-gray-300 relative hover:scale-105 p-6">
      <div className="flex items-start gap-4">
        <div className="w-24 h-24 flex-shrink-0">
          <img
            src={department.logo}
            alt={`${department.name} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-black text-2xl mb-2">{department.name}</h3>
          {department.head && (
            <p className="text-xl text-black mb-1">{department.head}</p>
          )}
          {department.contact && (
            <p className="text-xl text-black font-semibold mb-1">
              {department.contact}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <DirectoryLayout>
      <div className="space-y-12">
        <div>
          <h2 className="text-4xl font-bold mb-8">Social Services</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.socialServices.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-8">Public Administration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.publicAdministration.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-bold mb-8">Infrastructure</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departments.infrastructure.map((dept) => (
              <DepartmentCard key={dept.id} department={dept} />
            ))}
          </div>
        </div>
      </div>
    </DirectoryLayout>
  );
};

export default DepartmentsPage;
