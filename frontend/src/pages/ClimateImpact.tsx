import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaLeaf, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

const ClimateImpact: React.FC = () => {
  const [artifactName, setArtifactName] = useState<string>("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const caseStudies = [
    
    {
      name: "Taj Mahal, India",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3",
      impact: "Air pollution and acid rain are yellowing the marble surface. Extreme temperature fluctuations are causing thermal stress and micro-cracks.",
      measures: "Installation of air purifiers and implementation of strict pollution control in surrounding areas.",
      status: "Moderate Risk"
    },
    {
      name: "Venice Historical Center, Italy",
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3",
      impact: "Increasing frequency of acqua alta (high water) events and rising sea levels are accelerating the deterioration of building foundations.",
      measures: "MOSE barrier system implementation and continuous monitoring of structural integrity.",
      status: "Critical Risk"
    },
    {
      name: "Angkor Wat, Cambodia",
      image: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcTPFRTMROSGjNn89TE9zt-00ZcGywGZaQZWu4p3KI8x7SW4UBltxvgGCpnnWs-Hlpl0Tn-EeFyYJC2npu0DKoxUdw1j38Z8OZkddOfA0g",
      impact: "Increased rainfall and humidity are promoting biological growth on stone surfaces. Groundwater changes are affecting structural stability.",
      measures: "Advanced drainage systems and biological growth treatment protocols.",
      status: "Normal Risk"
    },
  ];

  const fetchClimateImpact = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post("http://localhost:5001/climate-impact", {
        artifactName,
      });

      console.log(artifactName);

      if (response.data.analysis) {
        const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
        setAnalysis(cleanedAnalysis);
      } else {
        setError("No analysis available. Please try again.");
      }
    } catch (err: any) {
      console.error("Error fetching climate impact:", err.message);
      setError("Failed to fetch climate impact analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseAnalysis = (analysis: string | null) => {
    if (!analysis) return [];

    const sanitizedResult = analysis.replace(/\*/g, "");
    const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

    const sections: { title: string, content: string }[] = [];
    let currentTitle = "";
    let currentContent = "";

    lines.forEach((line) => {
      if (line.includes(":")) {
        if (currentTitle) {
          sections.push({ title: currentTitle, content: currentContent });
        }
        const [key, ...valueParts] = line.split(":");
        currentTitle = key.trim();
        currentContent = valueParts.join(":").trim();
      } else {
        currentContent += `\n${line.trim()}`;
      }
    });

    if (currentTitle) {
      sections.push({ title: currentTitle, content: currentContent });
    }

    return sections;
  };

  const structuredAnalysis = parseAnalysis(analysis);

  const getRiskColor = (status: string) => {
    const colors = {
      'High Risk': 'bg-orange-100 text-orange-800 border-orange-200',
      'Moderate Risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Critical Risk': 'bg-red-100 text-red-800 border-red-200',
      'Normal Risk': 'bg-green-100 text-black-800 border-purple-200'
    };
    return colors[status as keyof typeof colors] || 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-6 animate__animated animate__fadeIn">
              Climate Impact Forecasting
            </h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Predict risk and protect cultural artifacts against environmental damage.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-stone-800 mb-4">Notable Case Studies</h2>
            <p className="text-lg text-stone-600">
              Examining climate impact on significant historical sites and artifacts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-serif text-white">{study.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 border ${getRiskColor(study.status)}`}>
                    {study.status}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 mb-2">Climate Impact:</h4>
                      <p className="text-stone-600 text-sm">{study.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 mb-2">Protective Measures:</h4>
                      <p className="text-stone-600 text-sm">{study.measures}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">Climate Impact Analysis</h1>

        {/* Input Section */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="artifactName" className="block font-medium mb-2">
            Enter Artifact Name:
          </label>
          <input
            type="text"
            id="artifactName"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            placeholder="e.g., Taj Mahal"
            value={artifactName}
            onChange={(e) => setArtifactName(e.target.value)}
          />
          <button
            onClick={fetchClimateImpact}
            className="w-full text-white py-2 rounded-lg bg-amber-700 hover:bg-amber-800"
            disabled={loading || !artifactName.trim()}
          >
            {loading ? "Fetching..." : "Get Climate Impact Analysis"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {/* Analysis Section with Animation */}
        <div className="mt-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
          {structuredAnalysis.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-700 flex items-center">
                {section.title}
              </h2>
              <div className="p-4 bg-white text-lg rounded-lg shadow-sm">
                <p className="whitespace-pre-line">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClimateImpact;










// workingg

// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaLeaf, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

// const ClimateImpact: React.FC = () => {
//   const [artifactName, setArtifactName] = useState<string>("");
//   const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchClimateImpact = async () => {
//     setLoading(true);
//     setError(null);
//     setAnalysis(null);

//     try {
//       const response = await axios.post("http://localhost:5001/climate-impact", {
//         artifactName,
//       });

//       console.log(artifactName);

//       if (response.data.analysis) {
//         const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
//         setAnalysis(cleanedAnalysis);


//       } else {
//         setError("No analysis available. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching climate impact:", err.message);
//       setError("Failed to fetch climate impact analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseAnalysis = (analysis: string | null) => {
//     if (!analysis) return [];

//     const sanitizedResult = analysis.replace(/\*/g, "");
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     const sections: { title: string, content: string }[] = [];
//     let currentTitle = "";
//     let currentContent = "";

//     lines.forEach((line) => {
//       if (line.includes(":")) {
//         // Check if line is a title
//         const [key, ...valueParts] = line.split(":");
//         if (currentTitle) {
//           sections.push({ title: currentTitle, content: currentContent });
//         }
//         currentTitle = key.trim();
//         currentContent = valueParts.join(":").trim();
//       } else {
//         currentContent += `\n${line.trim()}`;
//       }
//     });

//     // Push the last section
//     if (currentTitle) {
//       sections.push({ title: currentTitle, content: currentContent });
//     }

//     return sections;
//   };

//   const structuredAnalysis = parseAnalysis(analysis);

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6 animate__animated animate__fadeIn">
//               Climate Impact Forecasting
//             </h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Predict risk and protect cultural artifacts against environmental damage.
//             </p>
//           </div>
//         </div>
//       </section>

//       <div className="p-6 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4 text-center">Climate Impact Analysis</h1>

//         {/* Input Section */}
//         <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//           <label htmlFor="artifactName" className="block font-medium mb-2">
//             Enter Artifact Name:
//           </label>
//           <input
//             type="text"
//             id="artifactName"
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
//             placeholder="e.g., Taj Mahal"
//             value={artifactName}
//             onChange={(e) => setArtifactName(e.target.value)}
//           />
//           <button
//             onClick={fetchClimateImpact}
//             className="w-full text-white py-2 rounded-lg bg-amber-700 hover:bg-amber-800"
//             disabled={loading || !artifactName.trim()}
//           >
//             {loading ? "Fetching..." : "Get Climate Impact Analysis"}
//           </button>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             {error}
//           </div>
//         )}

//         {/* Analysis Section with Animation */}
//         <div className="mt-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
//           {structuredAnalysis.map((section, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -100 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.3 }}
//               className="mb-6"
//             >
//               <h2 className="text-xl font-bold mb-2 text-gray-700 flex items-center">
//                  {section.title}
//               </h2>
//               <div className="p-4 bg-white rounded-lg shadow-sm">
//                 <p className="whitespace-pre-line">{section.content}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClimateImpact;











// nhi chalrha


// import React, { useState } from "react";
// import axios from "axios";
// import { motion } from "framer-motion";
// import { FaLeaf, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

// const ClimateImpact: React.FC = () => {
//   const [artifactName, setArtifactName] = useState<string>("");
//   const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchClimateImpact = async () => {
//     setLoading(true);
//     setError(null);
//     setAnalysis(null);

//     try {
//       const response = await axios.post("http://localhost:5001/climate-impact", {
//         artifactName,
//       });

//       if (response.data.analysis) {
//         const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
//         setAnalysis(cleanedAnalysis);
//       } else {
//         setError("No analysis available. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching climate impact:", err.message);
//       setError("Failed to fetch climate impact analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseAnalysis = (analysis: string | null) => {
//     if (!analysis) return [];

//     const sanitizedResult = analysis.replace(/\*/g, "");
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     const sections: { title: string, content: string }[] = [];
//     let currentTitle = "";
//     let currentContent = "";

//     lines.forEach((line) => {
//       if (line.includes(":")) {
//         // Check if line is a title
//         const [key, ...valueParts] = line.split(":");
//         if (currentTitle) {
//           sections.push({ title: currentTitle, content: currentContent });
//         }
//         currentTitle = key.trim();
//         currentContent = valueParts.join(":").trim();
//       } else {
//         currentContent += `\n${line.trim()}`;
//       }
//     });

//     // Push the last section
//     if (currentTitle) {
//       sections.push({ title: currentTitle, content: currentContent });
//     }

//     return sections;
//   };

//   const structuredAnalysis = parseAnalysis(analysis);

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="bg-stone-900 text-white py-20">
//         <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl font-serif mb-6 animate__animated animate__fadeIn">
//               Climate Impact Forecasting
//             </h1>
//             <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
//               Predict risk and protect cultural artifacts against environmental damage.
//             </p>
//           </div>
//         </div>
//       </section>

//       <div className="p-6 bg-gray-50 min-h-screen">
//         <h1 className="text-2xl font-bold mb-4 text-center">Climate Impact Analysis</h1>

//         {/* Input Section */}
//         <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//           <label htmlFor="artifactName" className="block font-medium mb-2">
//             Enter Artifact Name:
//           </label>
//           <input
//             type="text"
//             id="artifactName"
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
//             placeholder="e.g., Taj Mahal"
//             value={artifactName}
//             onChange={(e) => setArtifactName(e.target.value)}
//           />
//           <button
//             onClick={fetchClimateImpact}
//             className="w-full text-white py-2 rounded-lg bg-amber-700 hover:bg-amber-800"
//             disabled={loading || !artifactName.trim()}
//           >
//             {loading ? "Fetching..." : "Get Climate Impact Analysis"}
//           </button>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//             {error}
//           </div>
//         )}

//         {/* Analysis Section with Animation */}
//         <div className="mt-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
//           {structuredAnalysis.map((section, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: -100 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.3 }}
//               className="mb-6"
//             >
//               <h2 className="text-xl font-bold mb-2 text-gray-700 flex items-center">
//                  {section.title}
//               </h2>
//               <div className="p-4 bg-white rounded-lg shadow-sm">
//                 <p className="whitespace-pre-line">{section.content}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClimateImpact;













// working par ui pe kaam karrhe hia

// import React, { useState } from "react";
// import axios from "axios";

// const ClimateImpact: React.FC = () => {
//   const [artifactName, setArtifactName] = useState<string>("");
//   const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchClimateImpact = async () => {
//     setLoading(true);
//     setError(null);
//     setAnalysis(null);

//     try {
//       const response = await axios.post("http://localhost:5001/climate-impact", {
//         artifactName,
//       });

//       if (response.data.analysis) {
//         const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
//         setAnalysis(cleanedAnalysis);
//       } else {
//         setError("No analysis available. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching climate impact:", err.message);
//       setError("Failed to fetch climate impact analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseAnalysis = (analysis: string | null) => {
//     if (!analysis) return [];

//     const sanitizedResult = analysis.replace(/\*/g, "");
//     const lines = sanitizedResult.split("\n").filter((line) => line.trim() !== "");

//     const sections: { title: string, content: string }[] = [];
//     let currentTitle = "";
//     let currentContent = "";

//     lines.forEach((line) => {
//       if (line.includes(":")) {
//         // Check if line is a title
//         const [key, ...valueParts] = line.split(":");
//         if (currentTitle) {
//           sections.push({ title: currentTitle, content: currentContent });
//         }
//         currentTitle = key.trim();
//         currentContent = valueParts.join(":").trim();
//       } else {
//         currentContent += `\n${line.trim()}`;
//       }
//     });

//     // Push the last section
//     if (currentTitle) {
//       sections.push({ title: currentTitle, content: currentContent });
//     }

//     return sections;
//   };

//   const structuredAnalysis = parseAnalysis(analysis);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4 text-center">Climate Impact Analysis</h1>

//       <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//         <label htmlFor="artifactName" className="block font-medium mb-2">
//           Enter Artifact Name:
//         </label>
//         <input
//           type="text"
//           id="artifactName"
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
//           placeholder="e.g., Taj Mahal"
//           value={artifactName}
//           onChange={(e) => setArtifactName(e.target.value)}
//         />
//         <button
//           onClick={fetchClimateImpact}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//           disabled={loading || !artifactName.trim()}
//         >
//           {loading ? "Fetching..." : "Get Climate Impact Analysis"}
//         </button>
//       </div>

//       {error && (
//         <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {error}
//         </div>
//       )}

//       <div className="mt-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
//         {structuredAnalysis.map((section, index) => (
//           <div key={index} className="mb-6">
//             <h2 className="text-xl font-bold mb-2 text-gray-700">{section.title}</h2>
//             <div className="p-4 bg-white rounded-lg shadow-sm">
//               <p className="whitespace-pre-line">{section.content}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ClimateImpact;












// khali ui hai par response

// import React, { useState } from "react";
// import axios from "axios";

// const ClimateImpact: React.FC = () => {
//   const [artifactName, setArtifactName] = useState<string>("");
//   const [analysis, setAnalysis] = useState<any | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchClimateImpact = async () => {
//     setLoading(true);
//     setError(null);
//     setAnalysis(null);

//     try {
//       const response = await axios.post("http://localhost:5001/climate-impact", {
//         artifactName,
//       });

//       if (response.data.analysis) {
//         const cleanedAnalysis = response.data.analysis.replace(/\*/g, ""); // Clean the response
//         setAnalysis(JSON.parse(cleanedAnalysis)); // Assuming the response is JSON
//       } else {
//         setError("No analysis available. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching climate impact:", err.message);
//       setError("Failed to fetch climate impact analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
//         Climate Impact Analysis
//       </h1>

//       <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//         <label htmlFor="artifactName" className="block font-medium mb-2 text-gray-700">
//           Enter Artifact Name:
//         </label>
//         <input
//           type="text"
//           id="artifactName"
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-300"
//           placeholder="e.g., Taj Mahal"
//           value={artifactName}
//           onChange={(e) => setArtifactName(e.target.value)}
//         />
//         <button
//           onClick={fetchClimateImpact}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
//           disabled={loading || !artifactName.trim()}
//         >
//           {loading ? "Fetching..." : "Get Climate Impact Analysis"}
//         </button>
//       </div>

//       {error && (
//         <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {error}
//         </div>
//       )}

//       {analysis && (
//         <div className="mt-6 max-w-4xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
//           {/* Climatic Conditions */}
//           <div className="mb-6">
//             <h2 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
//               <span className="mr-2">🌍</span> Climatic Conditions
//             </h2>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
//                 <div className="text-2xl text-blue-600">🌡️</div>
//                 <p className="font-medium">Temperature</p>
//                 <p className="text-gray-600">{analysis.temperature}°C</p>
//               </div>
//               <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
//                 <div className="text-2xl text-blue-600">💧</div>
//                 <p className="font-medium">Humidity</p>
//                 <p className="text-gray-600">{analysis.humidity}%</p>
//               </div>
//               <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
//                 <div className="text-2xl text-blue-600">☀️</div>
//                 <p className="font-medium">UV Exposure</p>
//                 <p className="text-gray-600">{analysis.uvExposure}</p>
//               </div>
//               <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
//                 <div className="text-2xl text-blue-600">🍃</div>
//                 <p className="font-medium">Air Quality</p>
//                 <p className="text-gray-600">{analysis.airQuality}</p>
//               </div>
//             </div>
//           </div>

//           {/* Climate Impact Analysis and Risk Assessment */}
//           <div className="mb-6">
//             <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center">
//               <span className="mr-2">📊</span> Climate Impact Analysis and Risk Assessment
//             </h2>
//             <p className="text-gray-700 leading-relaxed">{analysis.riskAssessment}</p>
//           </div>

//           {/* Preventive Care Guidelines */}
//           <div>
//             <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
//               <span className="mr-2">🛡️</span> Preventive Care Guidelines
//             </h2>
//             <p className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-lg">
//               {analysis.preventiveGuidelines}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClimateImpact;











// working but not good ui

// import React, { useState } from "react";
// import axios from "axios";

// const ClimateImpact: React.FC = () => {
//   const [artifactName, setArtifactName] = useState<string>("");
//   const [analysis, setAnalysis] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchClimateImpact = async () => {
//     setLoading(true);
//     setError(null);
//     setAnalysis(null);

//     try {
//       const response = await axios.post("http://localhost:5001/climate-impact", {
//         artifactName,
//       });

//       if (response.data.analysis) {
//         const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
//       setAnalysis(cleanedAnalysis);
//       } else {
//         setError("No analysis available. Please try again.");
//       }
//     } catch (err: any) {
//       console.error("Error fetching climate impact:", err.message);
//       setError("Failed to fetch climate impact analysis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4 text-center">
//         Climate Impact Analysis
//       </h1>

//       <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
//         <label htmlFor="artifactName" className="block font-medium mb-2">
//           Enter Artifact Name:
//         </label>
//         <input
//           type="text"
//           id="artifactName"
//           className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
//           placeholder="e.g., Taj Mahal"
//           value={artifactName}
//           onChange={(e) => setArtifactName(e.target.value)}
//         />
//         <button
//           onClick={fetchClimateImpact}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//           disabled={loading || !artifactName.trim()}
//         >
//           {loading ? "Fetching..." : "Get Climate Impact Analysis"}
//         </button>
//       </div>

//       {error && (
//         <div className="mt-4 max-w-md mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
//           {error}
//         </div>
//       )}

//       {analysis && (
//         <div className="mt-6 max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg shadow-md">
//           <h2 className="text-lg font-bold mb-4">Analysis:</h2>
//           <p className="whitespace-pre-line">{analysis}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClimateImpact;

