import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, TrendingUp, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PermeabilityTest = () => {
  const [headDifference, setHeadDifference] = useState('');
  const [length, setLength] = useState('');
  const [area, setArea] = useState('');
  const [discharge, setDischarge] = useState('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState(null);

  const calculatePermeability = () => {
    const h = parseFloat(headDifference);
    const L = parseFloat(length);
    const A = parseFloat(area);
    const Q = parseFloat(discharge);
    const t = parseFloat(time);

    if (isNaN(h) || isNaN(L) || isNaN(A) || isNaN(Q) || isNaN(t)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all fields.",
        variant: "destructive",
      });
      return;
    }

    // Darcy's Law: k = (Q × L) / (A × h × t) - IS 2720 Part 17
    const permeability = (Q * L) / (A * h * t);
    const velocity = Q / (A * t); // Seepage velocity
    const hydraulicGradient = h / L; // Hydraulic gradient

    // Permeability classification based on IS 1498
    let classification = '';
    let permeabilityRange = '';
    
    if (permeability > 1e-1) {
      classification = 'Very High Permeability';
      permeabilityRange = 'Gravel, Clean Sand';
    } else if (permeability > 1e-3) {
      classification = 'High Permeability';
      permeabilityRange = 'Clean Sand, Sand-Gravel Mix';
    } else if (permeability > 1e-5) {
      classification = 'Medium Permeability';
      permeabilityRange = 'Fine Sand, Silty Sand';
    } else if (permeability > 1e-7) {
      classification = 'Low Permeability';
      permeabilityRange = 'Silt, Sandy Clay';
    } else if (permeability > 1e-9) {
      classification = 'Very Low Permeability';
      permeabilityRange = 'Clay';
    } else {
      classification = 'Practically Impermeable';
      permeabilityRange = 'Dense Clay';
    }

    // Generate flow rate vs time chart data
    const chartData = [];
    for (let i = 0; i <= 10; i++) {
      const timePoint = (t / 10) * i;
      const cumulativeFlow = (Q * timePoint) / t;
      chartData.push({
        time: timePoint.toFixed(1),
        flow: cumulativeFlow.toFixed(4)
      });
    }

    setResults({
      permeability: permeability.toExponential(3),
      velocity: (velocity * 1000).toFixed(6), // Convert to mm/s
      hydraulicGradient: hydraulicGradient.toFixed(4),
      classification,
      permeabilityRange,
      chartData,
      calculations: {
        formula: 'k = (Q × L) / (A × h × t)',
        values: `k = (${Q} × ${L}) / (${A} × ${h} × ${t})`,
        result: `k = ${permeability.toExponential(3)} cm/s`
      }
    });

    toast({
      title: "Permeability Test Complete",
      description: `Coefficient of permeability: ${permeability.toExponential(3)} cm/s`,
    });
  };

  const resetForm = () => {
    setHeadDifference('');
    setLength('');
    setArea('');
    setDischarge('');
    setTime('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
        <CardHeader>
          <CardTitle className="flex items-center text-cyan-800">
            <Droplets className="h-5 w-5 mr-2" />
            Permeability Test (Constant Head Method)
          </CardTitle>
          <CardDescription className="text-cyan-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 17) - 1986: Determination of permeability by constant head method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-cyan-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-cyan-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-cyan-600">
                  {/* Permeameter cylinder */}
                  <rect x="70" y="30" width="40" height="70" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="90" y="25" textAnchor="middle" fontSize="8" fill="currentColor">Permeameter</text>
                  
                  {/* Soil sample */}
                  <rect x="75" y="50" width="30" height="30" fill="#8B4513" opacity="0.7"/>
                  <text x="90" y="110" textAnchor="middle" fontSize="8" fill="currentColor">Soil Sample</text>
                  
                  {/* Water levels */}
                  <line x1="50" y1="40" x2="70" y2="40" stroke="#4A90E2" strokeWidth="3"/>
                  <line x1="110" y1="70" x2="130" y2="70" stroke="#4A90E2" strokeWidth="3"/>
                  <text x="40" y="45" fontSize="6" fill="currentColor">h1</text>
                  <text x="135" y="75" fontSize="6" fill="currentColor">h2</text>
                  
                  {/* Head difference */}
                  <line x1="45" y1="40" x2="45" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
                  <text x="30" y="55" fontSize="8" fill="currentColor">Δh</text>
                  
                  {/* Flow direction */}
                  <line x1="80" y1="35" x2="95" y2="35" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead)"/>
                  <text x="87" y="30" fontSize="6" fill="currentColor">Flow</text>
                  
                  {/* Measuring cylinder */}
                  <rect x="140" y="70" width="15" height="25" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <text x="147" y="105" textAnchor="middle" fontSize="6" fill="currentColor">Measuring</text>
                  <text x="147" y="115" textAnchor="middle" fontSize="6" fill="currentColor">Cylinder</text>
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-cyan-800 mb-2">Test Description</h3>
                <p className="text-sm text-cyan-700">
                  The constant head permeability test determines the coefficient of permeability using Darcy's law. 
                  Water flows through a soil sample under a constant hydraulic head difference, and the discharge 
                  is measured to calculate the permeability coefficient.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headDifference" className="text-cyan-700 font-medium">
                Head Difference (h) cm
              </Label>
              <Input
                id="headDifference"
                type="number"
                placeholder="Enter head difference"
                value={headDifference}
                onChange={(e) => setHeadDifference(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length" className="text-cyan-700 font-medium">
                Sample Length (L) cm
              </Label>
              <Input
                id="length"
                type="number"
                placeholder="Enter length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area" className="text-cyan-700 font-medium">
                Cross-sectional Area (A) cm²
              </Label>
              <Input
                id="area"
                type="number"
                placeholder="Enter area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discharge" className="text-cyan-700 font-medium">
                Total Discharge (Q) cm³
              </Label>
              <Input
                id="discharge"
                type="number"
                placeholder="Enter discharge volume"
                value={discharge}
                onChange={(e) => setDischarge(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-cyan-700 font-medium">
                Time Duration (t) seconds
              </Label>
              <Input
                id="time"
                type="number"
                placeholder="Enter time duration"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculatePermeability} className="bg-cyan-600 hover:bg-cyan-700">
              Calculate Permeability
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-cyan-300 text-cyan-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Cumulative Flow vs Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Cumulative Flow (cm³)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="flow" stroke="#0ea5e9" strokeWidth={2} />
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
                <p className="text-xs mt-2">Based on Darcy's Law for laminar flow through porous media</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-emerald-800">Permeability Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Coefficient of Permeability:</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.permeability} cm/s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Seepage Velocity:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.velocity} mm/s
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Hydraulic Gradient:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.hydraulicGradient}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-emerald-700 block mb-1">Permeability Classification:</span>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700 mb-2">
                      {results.classification}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 block mb-1">Typical Soil Type:</span>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700">
                      {results.permeabilityRange}
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

export default PermeabilityTest;
