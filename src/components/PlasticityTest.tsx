
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertCircle, BarChart3, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const PlasticityTest = () => {
  const [liquidLimit, setLiquidLimit] = useState('');
  const [plasticLimit, setPlasticLimit] = useState('');
  const [results, setResults] = useState(null);

  const calculatePlasticity = () => {
    const LL = parseFloat(liquidLimit);
    const PL = parseFloat(plasticLimit);

    if (isNaN(LL) || isNaN(PL)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for both limits.",
        variant: "destructive",
      });
      return;
    }

    if (LL <= PL) {
      toast({
        title: "Invalid Values",
        description: "Liquid limit must be greater than plastic limit.",
        variant: "destructive",
      });
      return;
    }

    const plasticityIndex = LL - PL;
    let soilClassification = '';
    let activityLevel = '';

    // Soil classification based on plasticity (IS 1498-1970)
    if (plasticityIndex < 7) {
      soilClassification = 'Non-plastic (NP)';
      activityLevel = 'Inactive';
    } else if (plasticityIndex >= 7 && plasticityIndex < 17) {
      soilClassification = 'Low Plasticity (CL/ML)';
      activityLevel = 'Inactive to Normal';
    } else if (plasticityIndex >= 17 && plasticityIndex < 35) {
      soilClassification = 'Medium Plasticity (CI)';
      activityLevel = 'Normal';
    } else {
      soilClassification = 'High Plasticity (CH)';
      activityLevel = 'Active';
    }

    // Generate plasticity chart data points
    const chartData = [];
    const commonSoils = [
      { name: 'Your Sample', LL: LL, PI: plasticityIndex, color: '#ef4444' },
      { name: 'Typical Clay', LL: 45, PI: 25, color: '#3b82f6' },
      { name: 'Silty Clay', LL: 35, PI: 15, color: '#10b981' },
      { name: 'High Plastic Clay', LL: 70, PI: 45, color: '#f59e0b' }
    ];

    // A-line data for plasticity chart
    const aLineData = [];
    for (let ll = 0; ll <= 100; ll += 10) {
      const pi = 0.73 * (ll - 20);
      if (pi > 0) {
        aLineData.push({ LL: ll, PI: pi });
      }
    }

    setResults({
      plasticityIndex: plasticityIndex.toFixed(2),
      soilClassification,
      activityLevel,
      liquidLimit: LL.toFixed(1),
      plasticLimit: PL.toFixed(1),
      chartData: commonSoils,
      aLineData,
      calculations: {
        formula: 'PI = LL - PL',
        values: `PI = ${LL} - ${PL}`,
        result: `PI = ${plasticityIndex.toFixed(2)}%`
      }
    });

    toast({
      title: "Calculation Complete",
      description: `Plasticity Index: ${plasticityIndex.toFixed(2)}%`,
    });
  };

  const resetForm = () => {
    setLiquidLimit('');
    setPlasticLimit('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Calculator className="h-5 w-5 mr-2" />
            Atterberg Limits - Plasticity Test
          </CardTitle>
          <CardDescription className="text-blue-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 5) - 1985: Determination of liquid and plastic limit (ASTM D4318)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Image */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <img 
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Plasticity test laboratory setup"
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Test Description</h3>
                <p className="text-sm text-blue-700">
                  The Atterberg limits test determines the water content boundaries of fine-grained soils. 
                  The liquid limit (LL) is the water content at which soil changes from liquid to plastic state, 
                  and plastic limit (PL) is where it changes from plastic to semi-solid state.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liquidLimit" className="text-blue-700 font-medium">
                Liquid Limit (LL) %
              </Label>
              <Input
                id="liquidLimit"
                type="number"
                placeholder="Enter liquid limit"
                value={liquidLimit}
                onChange={(e) => setLiquidLimit(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plasticLimit" className="text-blue-700 font-medium">
                Plastic Limit (PL) %
              </Label>
              <Input
                id="plasticLimit"
                type="number"
                placeholder="Enter plastic limit"
                value={plasticLimit}
                onChange={(e) => setPlasticLimit(e.target.value)}
                className="border-blue-200 focus:border-blue-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculatePlasticity} className="bg-blue-600 hover:bg-blue-700">
              Calculate Plasticity
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-blue-300 text-blue-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-indigo-800 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Plasticity Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="LL" 
                    domain={[0, 100]}
                    label={{ value: 'Liquid Limit (%)', position: 'insideBottom', offset: -10 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="PI" 
                    domain={[0, 60]}
                    label={{ value: 'Plasticity Index (%)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Line data={results.aLineData} type="monotone" dataKey="PI" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" />
                  <Scatter data={results.chartData} fill="#3b82f6" />
                </ScatterChart>
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

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Liquid Limit:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.liquidLimit}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Plastic Limit:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.plasticLimit}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Plasticity Index:</span>
                    <Badge className="bg-green-600 text-white">
                      {results.plasticityIndex}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-green-700 block mb-1">Soil Classification:</span>
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {results.soilClassification}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-green-700 block mb-1">Activity Level:</span>
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {results.activityLevel}
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

export default PlasticityTest;
