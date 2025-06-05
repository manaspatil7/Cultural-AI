import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ReactCompareSlider } from "react-compare-slider";
import { API_ENDPOINTS } from "../config/api";

interface CaseStudy {
  name: string;
  currentImage: string;
  futureImage: string;
  impact: string;
  measures: string;
  status: string;
  riskData: { year: number; risk: number }[];
  factors: { factor: string; value: number }[];
}

const ClimateImpact: React.FC = () => {
  const [artifactName, setArtifactName] = useState<string>("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatedData, setSimulatedData] = useState<{
    riskTimeline: { year: number; risk: number }[];
    factors: { factor: string; value: number }[];
  } | null>(null);
  
  const analysisRef = useRef<HTMLDivElement>(null);

  // Add effect to scroll to analysis when it's available
  useEffect(() => {
    if (analysis && analysisRef.current) {
      analysisRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [analysis]);

  const caseStudies: CaseStudy[] = [
    {
      name: "Taj Mahal, India",
      currentImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523",
      futureImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sepia=50",
      impact: "Air pollution and acid rain are yellowing the marble surface. Extreme temperature fluctuations are causing thermal stress and micro-cracks.",
      measures: "Installation of air purifiers and implementation of strict pollution control in surrounding areas.",
      status: "Moderate Risk",
      riskData: [
        { year: 2000, risk: 20 },
        { year: 2010, risk: 35 },
        { year: 2020, risk: 50 },
        { year: 2030, risk: 65 },
      ],
      factors: [
        { factor: "Pollution", value: 85 },
        { factor: "Temperature", value: 75 },
        { factor: "Humidity", value: 60 },
      ]
    },
    {
      name: "Venice Historical Center, Italy",
      currentImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9",
      futureImage: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sepia=50",
      impact: "Increasing frequency of acqua alta (high water) events and rising sea levels are accelerating the deterioration of building foundations.",
      measures: "MOSE barrier system implementation and continuous monitoring of structural integrity.",
      status: "Critical Risk",
      riskData: [
        { year: 2000, risk: 40 },
        { year: 2010, risk: 55 },
        { year: 2020, risk: 70 },
        { year: 2030, risk: 85 },
      ],
      factors: [
        { factor: "Sea Level", value: 90 },
        { factor: "Humidity", value: 80 },
        { factor: "Salinity", value: 75 },
      ]
    },
  ];

  const fetchClimateImpact = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setSimulatedData(null);

    try {
      const response = await axios.post(API_ENDPOINTS.climateImpact, {
        artifactName,
      });

      if (response.data.analysis) {
        const cleanedAnalysis = response.data.analysis.replace(/\*/g, "");
        setAnalysis(cleanedAnalysis);
        
        // Simulate data extraction from analysis
        setSimulatedData({
          riskTimeline: [
            { year: 2023, risk: 40 },
            { year: 2030, risk: 55 },
            { year: 2040, risk: 70 },
            { year: 2050, risk: 85 },
          ],
          factors: [
            { factor: 'Temperature', value: 80 },
            { factor: 'Humidity', value: 65 },
            { factor: 'Pollution', value: 90 },
          ]
        });
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

    const sections: { title: string; content: string }[] = [];
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

  const getRiskColor = (status: string) => {
    const colors = {
      'High Risk': 'bg-orange-100 text-orange-800 border-orange-200',
      'Moderate Risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Critical Risk': 'bg-red-100 text-red-800 border-red-200',
      'Normal Risk': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const RiskMeter = ({ value }: { value: number }) => (
    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 via-yellow-500 to-red-600 transition-all duration-500" 
        style={{ width: `${value}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
        {value}% Risk Level
      </div>
    </div>
  );

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 pt-20 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-serif mb-6">
              Climate Impact Forecaster
            </h1>
            <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto">
              Predictive analytics for cultural heritage preservation against climate change
            </p>
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                className="w-full px-6 py-4 rounded-lg bg-stone-800 text-white placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter cultural heritage site or artifact..."
                value={artifactName}
                onChange={(e) => setArtifactName(e.target.value)}
              />
              <button
                onClick={fetchClimateImpact}
                className={`mt-4 w-full py-3 rounded-lg transition-all ${
                  loading ? 'bg-amber-800 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600'
                } text-white font-medium`}
                disabled={loading || !artifactName.trim()}
              >
                {loading ? 'Analyzing...' : 'Assess Preservation Risks'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Case Studies Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">
            Historical Preservation Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <ReactCompareSlider
                    itemOne={<img src={study.currentImage} className="w-full h-48 object-cover" />}
                    itemTwo={<img src={study.futureImage} className="w-full h-48 object-cover" />}
                    className="rounded-lg"
                  />
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 border ${getRiskColor(study.status)}`}>
                    {study.status}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{study.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 mb-2">Climate Impact:</h4>
                      <p className="text-stone-600 text-sm">{study.impact}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-stone-800 mb-2">Protective Measures:</h4>
                      <p className="text-stone-600 text-sm">{study.measures}</p>
                    </div>
                    <div className="mt-4">
                      <BarChart width={300} height={150} data={study.riskData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="risk" fill="#e11d48" />
                      </BarChart>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Analysis Section */}
        {analysis && (
          <section className="mb-20" ref={analysisRef}>
            <h2 className="text-3xl font-serif text-stone-800 mb-8 text-center">
              Analysis for {artifactName}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Text Analysis */}
              <div className="space-y-6">
                {parseAnalysis(analysis).map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-amber-700">{section.title}</h3>
                    <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Data Visualizations */}
              <div className="space-y-8">
                {simulatedData && (
                  <>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold mb-4">Risk Projection Timeline</h3>
                      <RiskMeter value={75} />
                      <LineChart
                        width={500}
                        height={300}
                        data={simulatedData.riskTimeline}
                        className="mt-6"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="risk" 
                          stroke="#e11d48"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <h3 className="text-xl font-semibold mb-4">Primary Threat Factors</h3>
                      <BarChart
                        width={500}
                        height={300}
                        data={simulatedData.factors}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="factor" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="value" 
                          fill="#059669"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Comparison */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Projected Impact Visualization</h3>
              <ReactCompareSlider
                itemOne={<img src={caseStudies[0].currentImage} className="w-full h-96 object-cover" />}
                itemTwo={<img src={caseStudies[0].futureImage} className="w-full h-96 object-cover" />}
                className="rounded-lg border-4 border-white"
              />
              <p className="text-sm text-stone-500 mt-3 text-center">
                Drag to compare current state with 2050 climate impact projection
              </p>
            </div>
          </section>
        )}

        {/* Error Handling */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClimateImpact;

