
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
          {/* Test Description with Image */}
          <div className="bg-cyan-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <img 
                src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Permeability test setup with constant head permeameter"
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
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
