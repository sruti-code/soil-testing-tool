
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, PieChart, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GrainSizeTest = () => {
  const [totalMass, setTotalMass] = useState('');
  const [sieve4, setSieve4] = useState('');
  const [sieve10, setSieve10] = useState('');
  const [sieve40, setSieve40] = useState('');
  const [sieve200, setSieve200] = useState('');
  const [results, setResults] = useState(null);

  const calculateGrainSize = () => {
    const total = parseFloat(totalMass);
    const s4 = parseFloat(sieve4) || 0;
    const s10 = parseFloat(sieve10) || 0;
    const s40 = parseFloat(sieve40) || 0;
    const s200 = parseFloat(sieve200) || 0;

    if (isNaN(total) || total <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid total mass.",
        variant: "destructive",
      });
      return;
    }

    // Calculate cumulative mass retained and percentages (IS 2720 Part 4)
    const cumMass4 = s4;
    const cumMass10 = s4 + s10;
    const cumMass40 = s4 + s10 + s40;
    const cumMass200 = s4 + s10 + s40 + s200;

    const cumPercent4 = (cumMass4 / total) * 100;
    const cumPercent10 = (cumMass10 / total) * 100;
    const cumPercent40 = (cumMass40 / total) * 100;
    const cumPercent200 = (cumMass200 / total) * 100;

    // Calculate percentage passing (IS 1498 classification)
    const passing4 = 100 - cumPercent4;
    const passing10 = 100 - cumPercent10;
    const passing40 = 100 - cumPercent40;
    const passing200 = 100 - cumPercent200;

    // Grain size distribution based on IS 1498
    const gravel = cumPercent4; // > 4.75mm
    const coarseSand = cumPercent10 - cumPercent4; // 4.75mm to 2mm
    const mediumSand = cumPercent40 - cumPercent10; // 2mm to 0.425mm
    const fineSand = cumPercent200 - cumPercent40; // 0.425mm to 0.075mm
    const fines = 100 - cumPercent200; // < 0.075mm

    // Calculate characteristic grain sizes for gradation analysis
    const d60 = interpolateD(60, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);
    const d30 = interpolateD(30, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);
    const d10 = interpolateD(10, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);

    // Uniformity coefficient and coefficient of gradation (IS 1498)
    const Cu = d10 > 0 ? d60 / d10 : 0;
    const Cc = (d10 > 0 && d60 > 0) ? (d30 * d30) / (d60 * d10) : 0;

    // Soil classification based on IS 1498
    let classification = '';
    let gradation = '';
    
    if (gravel > 50) {
      classification = 'Gravel (G)';
      if (Cu >= 4 && Cc >= 1 && Cc <= 3) {
        gradation = 'Well Graded (GW)';
      } else {
        gradation = 'Poorly Graded (GP)';
      }
    } else if ((coarseSand + mediumSand + fineSand) > 50) {
      classification = 'Sand (S)';
      if (Cu >= 6 && Cc >= 1 && Cc <= 3) {
        gradation = 'Well Graded (SW)';
      } else {
        gradation = 'Poorly Graded (SP)';
      }
    } else {
      classification = 'Fine-grained (M/C)';
      gradation = 'Requires Plasticity Tests';
    }

    // Generate chart data for grain size distribution
    const chartData = [
      { name: 'Gravel', percentage: parseFloat(gravel.toFixed(1)), color: '#8b5a2b' },
      { name: 'Coarse Sand', percentage: parseFloat(coarseSand.toFixed(1)), color: '#d4a574' },
      { name: 'Medium Sand', percentage: parseFloat(mediumSand.toFixed(1)), color: '#f4d03f' },
      { name: 'Fine Sand', percentage: parseFloat(fineSand.toFixed(1)), color: '#f7dc6f' },
      { name: 'Fines', percentage: parseFloat(fines.toFixed(1)), color: '#85929e' }
    ];

    setResults({
      gravel: gravel.toFixed(1),
      coarseSand: coarseSand.toFixed(1),
      mediumSand: mediumSand.toFixed(1),
      fineSand: fineSand.toFixed(1),
      fines: fines.toFixed(1),
      Cu: Cu.toFixed(2),
      Cc: Cc.toFixed(2),
      d60: d60.toFixed(3),
      d30: d30.toFixed(3),
      d10: d10.toFixed(3),
      classification,
      gradation,
      chartData,
      calculations: {
        formula: 'Cu = D₆₀/D₁₀, Cc = (D₃₀)²/(D₆₀×D₁₀)',
        values: `Cu = ${d60.toFixed(3)}/${d10.toFixed(3)}, Cc = (${d30.toFixed(3)})²/(${d60.toFixed(3)}×${d10.toFixed(3)})`,
        result: `Cu = ${Cu.toFixed(2)}, Cc = ${Cc.toFixed(2)}`
      }
    });

    toast({
      title: "Grain Size Analysis Complete",
      description: `Primary classification: ${classification}`,
    });
  };

  // Helper function to interpolate particle sizes from sieve analysis
  const interpolateD = (percent, passings, sizes) => {
    if (percent >= passings[0]) return sizes[0];
    if (percent <= passings[passings.length - 1]) return sizes[sizes.length - 1];
    
    for (let i = 0; i < passings.length - 1; i++) {
      if (percent <= passings[i] && percent >= passings[i + 1]) {
        const ratio = (percent - passings[i + 1]) / (passings[i] - passings[i + 1]);
        return sizes[i + 1] + ratio * (sizes[i] - sizes[i + 1]);
      }
    }
    return sizes[sizes.length - 1];
  };

  const resetForm = () => {
    setTotalMass('');
    setSieve4('');
    setSieve10('');
    setSieve40('');
    setSieve200('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-800">
            <Layers className="h-5 w-5 mr-2" />
            Grain Size Distribution Analysis
          </CardTitle>
          <CardDescription className="text-emerald-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 4) - 1985: Grain size analysis by sieve method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-emerald-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-emerald-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-emerald-700">
                  {/* Sieve Stack */}
                  <g>
                    {/* Sieve #4 (4.75mm) */}
                    <rect x="40" y="15" width="100" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="45" y="12" fontSize="8" fill="currentColor">#4 (4.75mm)</text>
                    <pattern id="mesh4" patternUnits="userSpaceOnUse" width="3" height="3">
                      <rect width="3" height="3" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                    <rect x="42" y="17" width="96" height="4" fill="url(#mesh4)"/>
                    
                    {/* Sieve #10 (2.0mm) */}
                    <rect x="40" y="28" width="100" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="45" y="25" fontSize="8" fill="currentColor">#10 (2.0mm)</text>
                    <pattern id="mesh10" patternUnits="userSpaceOnUse" width="2" height="2">
                      <rect width="2" height="2" fill="none" stroke="currentColor" strokeWidth="0.3"/>
                    </pattern>
                    <rect x="42" y="30" width="96" height="4" fill="url(#mesh10)"/>
                    
                    {/* Sieve #40 (0.425mm) */}
                    <rect x="40" y="41" width="100" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="45" y="38" fontSize="8" fill="currentColor">#40 (0.425mm)</text>
                    <pattern id="mesh40" patternUnits="userSpaceOnUse" width="1.5" height="1.5">
                      <rect width="1.5" height="1.5" fill="none" stroke="currentColor" strokeWidth="0.2"/>
                    </pattern>
                    <rect x="42" y="43" width="96" height="4" fill="url(#mesh40)"/>
                    
                    {/* Sieve #200 (0.075mm) */}
                    <rect x="40" y="54" width="100" height="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <text x="45" y="51" fontSize="8" fill="currentColor">#200 (0.075mm)</text>
                    <pattern id="mesh200" patternUnits="userSpaceOnUse" width="1" height="1">
                      <rect width="1" height="1" fill="none" stroke="currentColor" strokeWidth="0.1"/>
                    </pattern>
                    <rect x="42" y="56" width="96" height="4" fill="url(#mesh200)"/>
                    
                    {/* Pan */}
                    <rect x="40" y="67" width="100" height="8" fill="#f0f0f0" stroke="currentColor" strokeWidth="1"/>
                    <text x="45" y="64" fontSize="8" fill="currentColor">Pan</text>
                  </g>
                  
                  {/* Particles representation */}
                  <g>
                    {/* Large particles (gravel) */}
                    <circle cx="50" cy="19" r="2" fill="#8b5a2b"/>
                    <circle cx="55" cy="19" r="1.5" fill="#8b5a2b"/>
                    <text x="60" y="22" fontSize="6" fill="currentColor">Gravel</text>
                    
                    {/* Medium particles (sand) */}
                    <circle cx="50" cy="32" r="1" fill="#d4a574"/>
                    <circle cx="53" cy="32" r="0.8" fill="#d4a574"/>
                    <circle cx="56" cy="32" r="0.6" fill="#d4a574"/>
                    <text x="60" y="35" fontSize="6" fill="currentColor">Sand</text>
                    
                    {/* Fine particles */}
                    <circle cx="50" cy="45" r="0.5" fill="#f4d03f"/>
                    <circle cx="52" cy="45" r="0.4" fill="#f4d03f"/>
                    <circle cx="54" cy="45" r="0.3" fill="#f4d03f"/>
                    <text x="58" y="48" fontSize="6" fill="currentColor">Fine Sand</text>
                    
                    {/* Very fine particles (silt/clay) */}
                    <rect x="50" y="70" width="20" height="3" fill="#85929e" opacity="0.7"/>
                    <text x="75" y="73" fontSize="6" fill="currentColor">Fines</text>
                  </g>
                  
                  {/* Arrows showing separation */}
                  <g>
                    <path d="M30 30 L35 30" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)"/>
                    <path d="M30 45 L35 45" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)"/>
                    <path d="M30 60 L35 60" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)"/>
                    
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                      </marker>
                    </defs>
                  </g>
                  
                  <text x="90" y="110" fontSize="8" fill="currentColor" textAnchor="middle">Sieve Analysis Setup</text>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-800 mb-2">Test Description</h3>
                <p className="text-sm text-emerald-700">
                  Sieve analysis determines the particle size distribution of coarse-grained soils. 
                  The test involves passing soil through a series of sieves with progressively smaller 
                  openings and measuring the mass retained on each sieve to classify the soil.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMass" className="text-emerald-700 font-medium">
              Total Sample Mass (g)
            </Label>
            <Input
              id="totalMass"
              type="number"
              placeholder="Enter total mass"
              value={totalMass}
              onChange={(e) => setTotalMass(e.target.value)}
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sieve4" className="text-emerald-700 font-medium">
                Sieve #4 (4.75mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve4"
                type="number"
                placeholder="0"
                value={sieve4}
                onChange={(e) => setSieve4(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve10" className="text-emerald-700 font-medium">
                Sieve #10 (2.0mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve10"
                type="number"
                placeholder="0"
                value={sieve10}
                onChange={(e) => setSieve10(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve40" className="text-emerald-700 font-medium">
                Sieve #40 (0.425mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve40"
                type="number"
                placeholder="0"
                value={sieve40}
                onChange={(e) => setSieve40(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve200" className="text-emerald-700 font-medium">
                Sieve #200 (0.075mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve200"
                type="number"
                placeholder="0"
                value={sieve200}
                onChange={(e) => setSieve200(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateGrainSize} className="bg-emerald-600 hover:bg-emerald-700">
              Analyze Distribution
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-emerald-300 text-emerald-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Grain Size Distribution Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-700">Calculation Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-600 space-y-2 text-sm opacity-70">
                <p><strong>Formula:</strong> {results.calculations.formula}</p>
                <p><strong>Substituting values:</strong> {results.calculations.values}</p>
                <p><strong>Result:</strong> {results.calculations.result}</p>
                <p className="text-xs mt-2">Cu = Uniformity coefficient, Cc = Coefficient of gradation</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-rose-800 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Grain Size Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-rose-700 mb-2">Particle Distribution:</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Gravel ({'>'}4.75mm):</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.gravel}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Coarse Sand:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.coarseSand}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Medium Sand:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.mediumSand}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Fine Sand:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.fineSand}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Fines ({'<'}0.075mm):</span>
                    <Badge className="bg-rose-600 text-white">
                      {results.fines}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-rose-700 mb-2">Gradation Parameters:</h4>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">D₆₀:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.d60} mm
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">D₃₀:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.d30} mm
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">D₁₀:</span>
                    <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                      {results.d10} mm
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Cᵤ:</span>
                    <Badge className="bg-rose-600 text-white">
                      {results.Cu}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-rose-700">Cᶜ:</span>
                    <Badge className="bg-rose-600 text-white">
                      {results.Cc}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-rose-700 block mb-1">Classification:</span>
                    <Badge variant="outline" className="border-rose-400 text-rose-700 mb-2">
                      {results.classification}
                    </Badge>
                    <Badge variant="outline" className="border-rose-400 text-rose-700 ml-2">
                      {results.gradation}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GrainSizeTest;
