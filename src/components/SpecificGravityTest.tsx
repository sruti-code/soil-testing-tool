
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, BarChart3 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SpecificGravityTest = () => {
  const [soilMass, setSoilMass] = useState('');
  const [pycnometerMass, setPycnometerMass] = useState('');
  const [pycnometerWaterMass, setPycnometerWaterMass] = useState('');
  const [pycnometerSoilWaterMass, setPycnometerSoilWaterMass] = useState('');
  const [temperature, setTemperature] = useState('20');
  const [results, setResults] = useState(null);

  const calculateSpecificGravity = () => {
    const Ms = parseFloat(soilMass);
    const Mp = parseFloat(pycnometerMass);
    const Mpw = parseFloat(pycnometerWaterMass);
    const Mpsw = parseFloat(pycnometerSoilWaterMass);
    const T = parseFloat(temperature);

    if (isNaN(Ms) || isNaN(Mp) || isNaN(Mpw) || isNaN(Mpsw)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all mass measurements.",
        variant: "destructive",
      });
      return;
    }

    // Temperature correction factor for water density
    const tempCorrection = 1 - ((T - 20) * 0.0002);
    
    // Calculate specific gravity
    const Gs = (Ms * tempCorrection) / (Ms + Mpw - Mpsw);
    
    // Water mass displaced by soil
    const waterDisplaced = Ms + Mpw - Mpsw;
    
    // Volume of soil solids
    const volumeSolids = waterDisplaced / 1.0; // assuming water density = 1 g/cm³
    
    // Density of soil solids
    const densitySolids = Ms / volumeSolids;

    // Generate comparison chart data
    const chartData = [
      { material: 'Quartz', gravity: 2.65, color: '#8884d8' },
      { material: 'Clay Minerals', gravity: 2.70, color: '#82ca9d' },
      { material: 'Your Sample', gravity: parseFloat(Gs.toFixed(2)), color: '#ffc658' },
      { material: 'Organic Matter', gravity: 1.50, color: '#ff7c7c' },
      { material: 'Iron Oxide', gravity: 3.80, color: '#8dd1e1' }
    ];

    // Soil classification based on specific gravity
    let mineralComposition = '';
    if (Gs > 3.0) {
      mineralComposition = 'Heavy minerals (iron oxides, heavy metals)';
    } else if (Gs > 2.8) {
      mineralComposition = 'Clay minerals dominant';
    } else if (Gs > 2.6) {
      mineralComposition = 'Quartz/Feldspar dominant';
    } else if (Gs > 2.0) {
      mineralComposition = 'Mixed minerals with organics';
    } else {
      mineralComposition = 'High organic content';
    }

    setResults({
      specificGravity: Gs.toFixed(3),
      densitySolids: densitySolids.toFixed(2),
      volumeSolids: volumeSolids.toFixed(2),
      waterDisplaced: waterDisplaced.toFixed(2),
      mineralComposition,
      chartData,
      calculations: {
        formula: 'Gs = (Ms × K) / (Ms + Mpw - Mpsw)',
        values: `Gs = (${Ms} × ${tempCorrection.toFixed(4)}) / (${Ms} + ${Mpw} - ${Mpsw})`,
        result: `Gs = ${Gs.toFixed(3)}`
      }
    });

    toast({
      title: "Specific Gravity Analysis Complete",
      description: `Specific gravity: ${Gs.toFixed(3)}`,
    });
  };

  const resetForm = () => {
    setSoilMass('');
    setPycnometerMass('');
    setPycnometerWaterMass('');
    setPycnometerSoilWaterMass('');
    setTemperature('20');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center text-amber-800">
            <Thermometer className="h-5 w-5 mr-2" />
            Specific Gravity Test (Pycnometer Method)
          </CardTitle>
          <CardDescription className="text-amber-600">
            Determine specific gravity of soil solids using pycnometer (ASTM D854)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilMass" className="text-amber-700 font-medium">
                Mass of Dry Soil (g)
              </Label>
              <Input
                id="soilMass"
                type="number"
                placeholder="Enter soil mass"
                value={soilMass}
                onChange={(e) => setSoilMass(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pycnometerMass" className="text-amber-700 font-medium">
                Mass of Empty Pycnometer (g)
              </Label>
              <Input
                id="pycnometerMass"
                type="number"
                placeholder="Enter pycnometer mass"
                value={pycnometerMass}
                onChange={(e) => setPycnometerMass(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pycnometerWaterMass" className="text-amber-700 font-medium">
                Mass of Pycnometer + Water (g)
              </Label>
              <Input
                id="pycnometerWaterMass"
                type="number"
                placeholder="Enter total mass"
                value={pycnometerWaterMass}
                onChange={(e) => setPycnometerWaterMass(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pycnometerSoilWaterMass" className="text-amber-700 font-medium">
                Mass of Pycnometer + Soil + Water (g)
              </Label>
              <Input
                id="pycnometerSoilWaterMass"
                type="number"
                placeholder="Enter total mass"
                value={pycnometerSoilWaterMass}
                onChange={(e) => setPycnometerSoilWaterMass(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-amber-700 font-medium">
                Test Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                placeholder="20"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="border-amber-200 focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateSpecificGravity} className="bg-amber-600 hover:bg-amber-700">
              Calculate Specific Gravity
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-amber-300 text-amber-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Specific Gravity Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="material" angle={-45} textAnchor="end" height={80} />
                  <YAxis label={{ value: 'Specific Gravity', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="gravity" fill="#f59e0b" />
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
                <p className="text-xs mt-2">K = Temperature correction factor</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-green-800">Specific Gravity Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Specific Gravity (Gs):</span>
                    <Badge className="bg-green-600 text-white">
                      {results.specificGravity}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Density of Solids:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.densitySolids} g/cm³
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Volume of Solids:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.volumeSolids} cm³
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Water Displaced:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.waterDisplaced} g
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-green-700 block mb-1">Mineral Composition:</span>
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {results.mineralComposition}
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

export default SpecificGravityTest;
