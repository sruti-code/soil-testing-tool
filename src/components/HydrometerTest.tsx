import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Beaker, TrendingDown, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HydrometerTest = () => {
  const [soilMass, setSoilMass] = useState('');
  const [hydrometerReading, setHydrometerReading] = useState('');
  const [temperature, setTemperature] = useState('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState(null);

  const calculateHydrometer = () => {
    const mass = parseFloat(soilMass);
    const reading = parseFloat(hydrometerReading);
    const temp = parseFloat(temperature) || 27;
    const timeMin = parseFloat(time);

    if (isNaN(mass) || isNaN(reading) || isNaN(timeMin)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Temperature correction factor (IS 2720 Part 4)
    const tempCorrection = 0.32 * (temp - 27);
    const correctedReading = reading + tempCorrection;

    // Effective depth calculation (cm) - Based on IS 2720 Part 4
    const effectiveDepth = (correctedReading - 1) * 1000 / 0.67;

    // Grain diameter calculation using Stokes' law - corrected formula
    const viscosity = 0.001 * Math.pow(10, 1.3272 * (20 - temp) / (temp + 105)); // Dynamic viscosity
    const specificGravity = 2.65; // Assumed
    const grainDiameter = Math.sqrt((18 * viscosity * effectiveDepth) / ((specificGravity - 1) * 9.81 * timeMin * 60));

    // Percentage finer calculation - corrected
    const percentageFiner = ((correctedReading - 1) * 100) / mass;

    // Generate grain size distribution curve
    const chartData = [];
    const timePoints = [0.25, 0.5, 1, 2, 4, 8, 15, 30, 60, 120, 240, 480, 1440];
    
    timePoints.forEach(t => {
      const d = Math.sqrt((18 * viscosity * effectiveDepth) / ((specificGravity - 1) * 9.81 * t * 60));
      const pctFiner = Math.max(5, percentageFiner * Math.exp(-0.001 * t));
      chartData.push({
        time: t,
        diameter: (d * 1000).toFixed(4),
        percentFiner: pctFiner.toFixed(1)
      });
    });

    // Soil gradation classification
    let gradation = '';
    if (grainDiameter > 0.075) {
      gradation = 'Sand Size';
    } else if (grainDiameter > 0.002) {
      gradation = 'Silt Size';
    } else {
      gradation = 'Clay Size';
    }

    setResults({
      correctedReading: correctedReading.toFixed(3),
      effectiveDepth: effectiveDepth.toFixed(2),
      grainDiameter: (grainDiameter * 1000).toFixed(4),
      percentageFiner: Math.max(0, Math.min(100, percentageFiner)).toFixed(1),
      gradation,
      temperature: temp.toFixed(1),
      chartData,
      calculations: {
        formula: 'D = √[(18η × L) / ((Gs-1) × γw × t)]',
        values: `D = √[(18 × ${viscosity.toFixed(6)} × ${effectiveDepth.toFixed(2)}) / ((${specificGravity}-1) × 9810 × ${timeMin * 60})]`,
        result: `D = ${(grainDiameter * 1000).toFixed(4)} mm`
      }
    });

    toast({
      title: "Analysis Complete",
      description: `Grain diameter: ${(grainDiameter * 1000).toFixed(4)} mm`,
    });
  };

  const resetForm = () => {
    setSoilMass('');
    setHydrometerReading('');
    setTemperature('');
    setTime('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-800">
            <Beaker className="h-5 w-5 mr-2" />
            Hydrometer Analysis
          </CardTitle>
          <CardDescription className="text-purple-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 4) - 1985: Grain size analysis by hydrometer method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-purple-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-purple-600">
                  {/* Measuring cylinder */}
                  <rect x="70" y="20" width="30" height="80" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="85" y="15" textAnchor="middle" fontSize="8" fill="currentColor">1000ml Cylinder</text>
                  
                  {/* Soil suspension */}
                  <rect x="75" y="25" width="20" height="70" fill="#8B4513" opacity="0.5"/>
                  
                  {/* Hydrometer */}
                  <line x1="85" y1="10" x2="85" y2="60" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="85" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <text x="105" y="18" fontSize="8" fill="currentColor">Hydrometer</text>
                  
                  {/* Scale markings */}
                  <line x1="95" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="1"/>
                  <line x1="95" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="1"/>
                  <line x1="95" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1"/>
                  <text x="105" y="35" fontSize="6" fill="currentColor">Scale</text>
                  
                  {/* Thermometer */}
                  <rect x="50" y="40" width="8" height="30" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="54" cy="75" r="3" fill="red" opacity="0.7"/>
                  <text x="30" y="58" fontSize="8" fill="currentColor">Thermometer</text>
                  
                  {/* Sedimentation particles */}
                  <circle cx="80" cy="80" r="1" fill="#654321"/>
                  <circle cx="88" cy="85" r="1" fill="#654321"/>
                  <circle cx="77" cy="90" r="1" fill="#654321"/>
                  <text x="110" y="88" fontSize="6" fill="currentColor">Settling particles</text>
                  
                  {/* Time indicator */}
                  <text x="120" y="100" fontSize="8" fill="currentColor">Time: t minutes</text>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800 mb-2">Test Description</h3>
                <p className="text-sm text-purple-700">
                  The hydrometer test determines the grain size distribution of fine-grained soils (passing 75μ sieve) 
                  based on Stokes' law. It measures the rate of sedimentation of soil particles in a dispersed suspension.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilMass" className="text-purple-700 font-medium">
                Soil Mass (g)
              </Label>
              <Input
                id="soilMass"
                type="number"
                placeholder="Enter soil mass (50g typical)"
                value={soilMass}
                onChange={(e) => setSoilMass(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hydrometerReading" className="text-purple-700 font-medium">
                Hydrometer Reading
              </Label>
              <Input
                id="hydrometerReading"
                type="number"
                step="0.001"
                placeholder="Enter corrected reading"
                value={hydrometerReading}
                onChange={(e) => setHydrometerReading(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature" className="text-purple-700 font-medium">
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                placeholder="27 (standard)"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-purple-700 font-medium">
                Elapsed Time (minutes)
              </Label>
              <Input
                id="time"
                type="number"
                placeholder="Enter time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateHydrometer} className="bg-purple-600 hover:bg-purple-700">
              Analyze Sample
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-purple-300 text-purple-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-violet-800 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Grain Size Distribution Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="diameter" label={{ value: 'Grain Size (mm)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Percentage Finer (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="percentFiner" stroke="#8b5cf6" strokeWidth={2} />
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
                <p className="text-xs mt-2">Where: η = dynamic viscosity, L = effective depth, Gs = specific gravity, γw = unit weight of water, t = time</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Hydrometer Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Corrected Reading:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {results.correctedReading}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Effective Depth:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {results.effectiveDepth} cm
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Grain Diameter:</span>
                    <Badge className="bg-orange-600 text-white">
                      {results.grainDiameter} mm
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Percentage Finer:</span>
                    <Badge className="bg-orange-600 text-white">
                      {results.percentageFiner}%
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-orange-700 block mb-1">Particle Size:</span>
                    <Badge variant="outline" className="border-orange-400 text-orange-700">
                      {results.gradation}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-700">Temperature:</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {results.temperature}°C
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

export default HydrometerTest;
