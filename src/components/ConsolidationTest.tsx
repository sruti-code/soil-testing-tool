import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConsolidationTest = () => {
  const [initialVoidRatio, setInitialVoidRatio] = useState('');
  const [initialPressure, setInitialPressure] = useState('');
  const [finalPressure, setFinalPressure] = useState('');
  const [compressionIndex, setCompressionIndex] = useState('');
  const [results, setResults] = useState(null);

  const calculateConsolidation = () => {
    const e0 = parseFloat(initialVoidRatio);
    const p0 = parseFloat(initialPressure);
    const pf = parseFloat(finalPressure);
    const Cc = parseFloat(compressionIndex);

    if (isNaN(e0) || isNaN(p0) || isNaN(pf) || isNaN(Cc)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all parameters.",
        variant: "destructive",
      });
      return;
    }

    // Calculate settlement using IS 8009 Part 1 - 1976
    const deltaE = Cc * Math.log10(pf / p0);
    const finalVoidRatio = e0 - deltaE;
    const settlement = (deltaE / (1 + e0)) * 100; // Settlement in percentage

    // Calculate coefficient of compressibility
    const coeffCompressibility = deltaE / (pf - p0);
    
    // Calculate coefficient of volume compressibility
    const coeffVolumeCompressibility = coeffCompressibility / (1 + e0);

    // Generate e-log p curve
    const chartData = [];
    const pressureRange = Math.max(pf * 2, 1000);
    for (let i = 1; i <= 20; i++) {
      const pressure = (pressureRange / 20) * i;
      const voidRatio = e0 - Cc * Math.log10(pressure / p0);
      if (voidRatio > 0) {
        chartData.push({
          pressure: pressure.toFixed(0),
          voidRatio: Math.max(0, voidRatio).toFixed(3)
        });
      }
    }

    // Soil classification based on compression index (IS 1498)
    let compressibility = '';
    if (Cc < 0.05) {
      compressibility = 'Very Low Compressibility';
    } else if (Cc < 0.1) {
      compressibility = 'Low Compressibility';
    } else if (Cc < 0.3) {
      compressibility = 'Medium Compressibility';
    } else if (Cc < 0.5) {
      compressibility = 'High Compressibility';
    } else {
      compressibility = 'Very High Compressibility';
    }

    setResults({
      finalVoidRatio: finalVoidRatio.toFixed(4),
      settlement: settlement.toFixed(3),
      deltaE: deltaE.toFixed(4),
      coeffCompressibility: coeffCompressibility.toFixed(6),
      coeffVolumeCompressibility: coeffVolumeCompressibility.toFixed(6),
      compressibility,
      chartData,
      calculations: {
        formula: 'Δe = Cc × log₁₀(pf/p₀)',
        values: `Δe = ${Cc} × log₁₀(${pf}/${p0})`,
        result: `Δe = ${deltaE.toFixed(4)}`
      }
    });

    toast({
      title: "Consolidation Analysis Complete",
      description: `Settlement: ${settlement.toFixed(3)}%`,
    });
  };

  const resetForm = () => {
    setInitialVoidRatio('');
    setInitialPressure('');
    setFinalPressure('');
    setCompressionIndex('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-800">
            <Target className="h-5 w-5 mr-2" />
            One Dimensional Consolidation Test
          </CardTitle>
          <CardDescription className="text-teal-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 15) - 1986: Determination of consolidation properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-teal-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-teal-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-teal-600">
                  {/* Consolidometer ring */}
                  <rect x="60" y="50" width="60" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="90" y="45" textAnchor="middle" fontSize="8" fill="currentColor">Consolidometer</text>
                  
                  {/* Soil sample */}
                  <rect x="65" y="60" width="50" height="20" fill="#8B4513" opacity="0.7"/>
                  <text x="90" y="105" textAnchor="middle" fontSize="8" fill="currentColor">Soil Sample</text>
                  
                  {/* Loading system */}
                  <rect x="80" y="20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="90" y="15" textAnchor="middle" fontSize="8" fill="currentColor">Load</text>
                  <line x1="90" y1="40" x2="90" y2="50" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  
                  {/* Dial gauge */}
                  <circle cx="130" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <line x1="130" y1="30" x2="135" y2="25" stroke="currentColor" strokeWidth="1"/>
                  <text x="130" y="50" textAnchor="middle" fontSize="6" fill="currentColor">Dial Gauge</text>
                  
                  {/* Porous stones */}
                  <rect x="70" y="55" width="40" height="3" fill="#ddd" stroke="currentColor" strokeWidth="0.5"/>
                  <rect x="70" y="82" width="40" height="3" fill="#ddd" stroke="currentColor" strokeWidth="0.5"/>
                  <text x="40" y="58" fontSize="6" fill="currentColor">Porous Stone</text>
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-teal-800 mb-2">Test Description</h3>
                <p className="text-sm text-teal-700">
                  The consolidation test determines the compressibility and time-rate of settlement of saturated 
                  fine-grained soils under static loads. The test measures void ratio changes under different 
                  pressure increments to establish the e-log p relationship for settlement calculations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialVoidRatio" className="text-teal-700 font-medium">
                Initial Void Ratio (e₀)
              </Label>
              <Input
                id="initialVoidRatio"
                type="number"
                step="0.01"
                placeholder="Enter initial void ratio"
                value={initialVoidRatio}
                onChange={(e) => setInitialVoidRatio(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialPressure" className="text-teal-700 font-medium">
                Initial Pressure (p₀) kPa
              </Label>
              <Input
                id="initialPressure"
                type="number"
                placeholder="Enter initial pressure"
                value={initialPressure}
                onChange={(e) => setInitialPressure(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalPressure" className="text-teal-700 font-medium">
                Final Pressure (pf) kPa
              </Label>
              <Input
                id="finalPressure"
                type="number"
                placeholder="Enter final pressure"
                value={finalPressure}
                onChange={(e) => setFinalPressure(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compressionIndex" className="text-teal-700 font-medium">
                Compression Index (Cc)
              </Label>
              <Input
                id="compressionIndex"
                type="number"
                step="0.01"
                placeholder="Enter compression index"
                value={compressionIndex}
                onChange={(e) => setCompressionIndex(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateConsolidation} className="bg-teal-600 hover:bg-teal-700">
              Calculate Settlement
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-teal-300 text-teal-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-cyan-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                e - log p Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pressure" label={{ value: 'Pressure (kPa)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Void Ratio (e)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="voidRatio" stroke="#0891b2" strokeWidth={2} />
                </LineChart>
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
                <p className="text-xs mt-2">Settlement % = (Δe / (1 + e₀)) × 100</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-emerald-800">Consolidation Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Final Void Ratio:</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.finalVoidRatio}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Settlement (%):</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.settlement}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Change in Void Ratio:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.deltaE}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Coeff. of Compressiblity:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.coeffCompressibility}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 block mb-1">Compressibility:</span>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700">
                      {results.compressibility}
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

export default ConsolidationTest;
