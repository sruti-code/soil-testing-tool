
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Beaker, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HydrometerTest = () => {
  const [soilMass, setSoilMass] = useState('');
  const [hydrometerReading, setHydrometerReading] = useState('');
  const [temperature, setTemperature] = useState('');
  const [time, setTime] = useState('');
  const [results, setResults] = useState(null);

  const calculateHydrometer = () => {
    const mass = parseFloat(soilMass);
    const reading = parseFloat(hydrometerReading);
    const temp = parseFloat(temperature) || 20;
    const timeMin = parseFloat(time);

    if (isNaN(mass) || isNaN(reading) || isNaN(timeMin)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Temperature correction factor
    const tempCorrection = 0.1 * (temp - 20);
    const correctedReading = reading + tempCorrection;

    // Effective depth calculation (simplified)
    const effectiveDepth = 10 + (correctedReading * 0.5);

    // Grain diameter calculation using Stokes' law (simplified)
    const grainDiameter = Math.sqrt((18 * 0.001 * effectiveDepth) / (0.0027 * timeMin * 60));

    // Percentage finer calculation
    const percentageFiner = ((correctedReading - 1) / mass) * 100;

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
      temperature: temp.toFixed(1)
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
          <CardDescription className="text-purple-600">
            Determine grain size distribution in fine-grained soils using sedimentation (ASTM D7928)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilMass" className="text-purple-700 font-medium">
                Soil Mass (g)
              </Label>
              <Input
                id="soilMass"
                type="number"
                placeholder="Enter soil mass"
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
                placeholder="Enter reading"
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
                placeholder="20"
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
      )}
    </div>
  );
};

export default HydrometerTest;
