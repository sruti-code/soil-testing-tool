
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, BarChart3, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SpecificGravityTest = () => {
  const [soilMass, setSoilMass] = useState('');
  const [pycnometerMass, setPycnometerMass] = useState('');
  const [pycnometerWaterMass, setPycnometerWaterMass] = useState('');
  const [pycnometerSoilWaterMass, setPycnometerSoilWaterMass] = useState('');
  const [temperature, setTemperature] = useState('27');
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

    // Temperature correction factor for water density - IS 2720 Part 3/1
    const tempCorrection = 1 - ((T - 27) * 0.0002);
    
    // Calculate specific gravity using IS formula
    const Gs = (Ms * tempCorrection) / (Ms + (Mpw - Mp) - (Mpsw - Mp));
    
    // Water mass in pycnometer
    const waterMass = Mpw - Mp;
    
    // Water mass displaced by soil
    const waterDisplaced = Ms + waterMass - (Mpsw - Mp);
    
    // Volume of soil solids (assuming water density = 1 g/cm³)
    const volumeSolids = waterDisplaced;
    
    // Density of soil solids
    const densitySolids = Ms / volumeSolids;

    // Generate comparison chart data with Indian soil minerals
    const chartData = [
      { material: 'Quartz', gravity: 2.65, color: '#8884d8' },
      { material: 'Feldspar', gravity: 2.56, color: '#82ca9d' },
      { material: 'Your Sample', gravity: parseFloat(Gs.toFixed(2)), color: '#ffc658' },
      { material: 'Montmorillonite', gravity: 2.74, color: '#ff7c7c' },
      { material: 'Kaolinite', gravity: 2.61, color: '#8dd1e1' },
      { material: 'Illite', gravity: 2.79, color: '#d084d0' }
    ];

    // Soil mineral composition based on specific gravity - IS 1498
    let mineralComposition = '';
    let soilOrigin = '';
    
    if (Gs > 3.0) {
      mineralComposition = 'Heavy minerals (magnetite, hematite)';
      soilOrigin = 'Lateritic/Ferruginous soils';
    } else if (Gs > 2.8) {
      mineralComposition = 'Clay minerals (montmorillonite, illite)';
      soilOrigin = 'Black cotton soil/Marine clays';
    } else if (Gs > 2.65) {
      mineralComposition = 'Quartz dominant with clay minerals';
      soilOrigin = 'Alluvial/Residual soils';
    } else if (Gs > 2.5) {
      mineralComposition = 'Feldspar and quartz dominant';
      soilOrigin = 'Weathered granite/gneiss';
    } else {
      mineralComposition = 'High organic content/Peat';
      soilOrigin = 'Organic/Marshy soils';
    }

    setResults({
      specificGravity: Gs.toFixed(3),
      densitySolids: densitySolids.toFixed(2),
      volumeSolids: volumeSolids.toFixed(2),
      waterDisplaced: waterDisplaced.toFixed(2),
      waterMass: waterMass.toFixed(2),
      mineralComposition,
      soilOrigin,
      chartData,
      calculations: {
        formula: 'Gs = (Ms × K) / [Ms + (Mpw - Mp) - (Mpsw - Mp)]',
        values: `Gs = (${Ms} × ${tempCorrection.toFixed(4)}) / [${Ms} + ${waterMass.toFixed(1)} - ${waterDisplaced.toFixed(1)}]`,
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
    setTemperature('27');
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
          <CardDescription className="text-amber-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 3/1) - 1980: Determination of specific gravity of fine grained soils
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Image */}
          <div className="bg-amber-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Pycnometer apparatus for specific gravity determination"
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-2">Test Description</h3>
                <p className="text-sm text-amber-700">
                  The specific gravity test determines the ratio of unit weight of soil solids to that of water 
                  at 27°C using a pycnometer. This fundamental property is essential for void ratio calculations, 
                  unit weight determinations, and soil classification in geotechnical engineering.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilMass" className="text-amber-700 font-medium">
                Mass of Dry Soil (Ms) g
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
                Mass of Empty Pycnometer (Mp) g
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
                Mass of Pycnometer + Water (Mpw) g
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
                Mass of Pycnometer + Soil + Water (Mpsw) g
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
                placeholder="27 (standard)"
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
                Specific Gravity Comparison with Common Indian Soil Minerals
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
                <p className="text-xs mt-2">K = Temperature correction factor, Standard temperature = 27°C for IS codes</p>
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
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-700">Water Mass in Pycnometer:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {results.waterMass} g
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
                    <span className="font-medium text-green-700 block mb-1">Dominant Minerals:</span>
                    <Badge variant="outline" className="border-green-400 text-green-700 mb-2">
                      {results.mineralComposition}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-green-700 block mb-1">Probable Soil Origin:</span>
                    <Badge variant="outline" className="border-green-400 text-green-700">
                      {results.soilOrigin}
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
