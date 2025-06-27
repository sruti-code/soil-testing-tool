
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ConsolidationTest = () => {
  const [initialHeight, setInitialHeight] = useState('');
  const [finalHeight, setFinalHeight] = useState('');
  const [initialVoidRatio, setInitialVoidRatio] = useState('');
  const [pressure, setPressure] = useState('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState(null);

  const calculateConsolidation = () => {
    const H0 = parseFloat(initialHeight);
    const Hf = parseFloat(finalHeight);
    const e0 = parseFloat(initialVoidRatio);
    const p = parseFloat(pressure);
    const t = parseFloat(time);

    if (isNaN(H0) || isNaN(Hf) || isNaN(e0) || isNaN(p) || isNaN(t)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all fields.",
        variant: "destructive",
      });
      return;
    }

    // Calculate compression parameters
    const deltaH = H0 - Hf;
    const strain = (deltaH / H0) * 100;
    const compressionRatio = deltaH / H0;
    
    // Calculate final void ratio
    const ef = e0 - (deltaH * (1 + e0)) / H0;
    
    // Calculate coefficient of volume compressibility
    const mv = (e0 - ef) / (p * (1 + e0));
    
    // Estimate coefficient of consolidation (simplified)
    const cv = 0.848 * (H0 * H0) / t; // for 90% consolidation

    // Generate consolidation curve data
    const chartData = [];
    for (let i = 0; i <= 20; i++) {
      const timePoint = (t / 20) * i;
      const settlementRatio = 1 - Math.exp(-(Math.PI * Math.PI * cv * timePoint) / (4 * H0 * H0));
      const settlement = deltaH * settlementRatio;
      chartData.push({
        time: timePoint.toFixed(1),
        settlement: settlement.toFixed(3)
      });
    }

    setResults({
      totalSettlement: deltaH.toFixed(3),
      strain: strain.toFixed(2),
      compressionRatio: compressionRatio.toFixed(4),
      finalVoidRatio: ef.toFixed(3),
      volumeCompressibility: mv.toExponential(3),
      coefficientConsolidation: cv.toFixed(4),
      chartData,
      calculations: {
        formula: 'mv = Δe / (Δp × (1 + e₀))',
        values: `mv = ${(e0 - ef).toFixed(3)} / (${p} × (1 + ${e0}))`,
        result: `mv = ${mv.toExponential(3)} m²/kN`
      }
    });

    toast({
      title: "Consolidation Analysis Complete",
      description: `Total settlement: ${deltaH.toFixed(3)} mm`,
    });
  };

  const resetForm = () => {
    setInitialHeight('');
    setFinalHeight('');
    setInitialVoidRatio('');
    setPressure('');
    setTime('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardHeader>
          <CardTitle className="flex items-center text-violet-800">
            <Target className="h-5 w-5 mr-2" />
            One-Dimensional Consolidation Test
          </CardTitle>
          <CardDescription className="text-violet-600">
            Determine consolidation characteristics and settlement properties (ASTM D2435)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialHeight" className="text-violet-700 font-medium">
                Initial Sample Height (mm)
              </Label>
              <Input
                id="initialHeight"
                type="number"
                placeholder="Enter initial height"
                value={initialHeight}
                onChange={(e) => setInitialHeight(e.target.value)}
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalHeight" className="text-violet-700 font-medium">
                Final Sample Height (mm)
              </Label>
              <Input
                id="finalHeight"
                type="number"
                placeholder="Enter final height"
                value={finalHeight}
                onChange={(e) => setFinalHeight(e.target.value)}
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialVoidRatio" className="text-violet-700 font-medium">
                Initial Void Ratio (e₀)
              </Label>
              <Input
                id="initialVoidRatio"
                type="number"
                step="0.01"
                placeholder="Enter void ratio"
                value={initialVoidRatio}
                onChange={(e) => setInitialVoidRatio(e.target.value)}
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pressure" className="text-violet-700 font-medium">
                Applied Pressure (kPa)
              </Label>
              <Input
                id="pressure"
                type="number"
                placeholder="Enter pressure"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-violet-700 font-medium">
                Time for 90% Consolidation (minutes)
              </Label>
              <Input
                id="time"
                type="number"
                placeholder="Enter time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateConsolidation} className="bg-violet-600 hover:bg-violet-700">
              Analyze Consolidation
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-violet-300 text-violet-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Settlement vs Time Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (min)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Settlement (mm)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="settlement" stroke="#8b5cf6" strokeWidth={2} />
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

          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-indigo-800">Consolidation Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Total Settlement:</span>
                    <Badge className="bg-indigo-600 text-white">
                      {results.totalSettlement} mm
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Strain:</span>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {results.strain}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Final Void Ratio:</span>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {results.finalVoidRatio}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Volume Compressibility:</span>
                    <Badge className="bg-indigo-600 text-white">
                      {results.volumeCompressibility} m²/kN
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-indigo-700">Coefficient of Consolidation:</span>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {results.coefficientConsolidation} mm²/min
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
