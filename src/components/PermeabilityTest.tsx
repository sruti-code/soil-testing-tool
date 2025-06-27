
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, TrendingUp } from "lucide-react";
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

    // Darcy's Law: k = (Q * L) / (A * h * t)
    const permeability = (Q * L) / (A * h * t);
    const velocity = Q / A;
    const hydraulicGradient = h / L;

    // Classification
    let classification = '';
    if (permeability > 1e-1) {
      classification = 'Very High Permeability';
    } else if (permeability > 1e-3) {
      classification = 'High Permeability';
    } else if (permeability > 1e-5) {
      classification = 'Medium Permeability';
    } else if (permeability > 1e-7) {
      classification = 'Low Permeability';
    } else {
      classification = 'Very Low Permeability';
    }

    // Generate chart data
    const chartData = [];
    for (let i = 0; i <= 10; i++) {
      const timePoint = (t / 10) * i;
      const flowRate = Q * (i / 10);
      chartData.push({
        time: timePoint.toFixed(1),
        flow: flowRate.toFixed(4)
      });
    }

    setResults({
      permeability: permeability.toExponential(3),
      velocity: velocity.toFixed(6),
      hydraulicGradient: hydraulicGradient.toFixed(4),
      classification,
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
            Permeability Test (Constant Head)
          </CardTitle>
          <CardDescription className="text-cyan-600">
            Determine coefficient of permeability using Darcy's Law (ASTM D2434)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="headDifference" className="text-cyan-700 font-medium">
                Head Difference (cm)
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
                Sample Length (cm)
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
                Cross-sectional Area (cm²)
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
                Discharge Volume (cm³)
              </Label>
              <Input
                id="discharge"
                type="number"
                placeholder="Enter discharge"
                value={discharge}
                onChange={(e) => setDischarge(e.target.value)}
                className="border-cyan-200 focus:border-cyan-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-cyan-700 font-medium">
                Time (seconds)
              </Label>
              <Input
                id="time"
                type="number"
                placeholder="Enter time"
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
                Flow Rate vs Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Flow Rate (cm³/s)', angle: -90, position: 'insideLeft' }} />
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
                      {results.velocity} cm/s
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Hydraulic Gradient:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.hydraulicGradient}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 block mb-1">Classification:</span>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700">
                      {results.classification}
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
