
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hammer, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CompactionTest = () => {
  const [wetMass, setWetMass] = useState('');
  const [dryMass, setDryMass] = useState('');
  const [moldVolume, setMoldVolume] = useState('');
  const [waterContent, setWaterContent] = useState('');
  const [results, setResults] = useState(null);

  const calculateCompaction = () => {
    const wetM = parseFloat(wetMass);
    const dryM = parseFloat(dryMass);
    const volume = parseFloat(moldVolume) || 944; // Standard Proctor mold volume in cm³
    const wc = parseFloat(waterContent);

    if (isNaN(wetM) || isNaN(dryM) || isNaN(wc)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Calculate wet density
    const wetDensity = wetM / volume;

    // Calculate dry density
    const dryDensity = dryM / volume;

    // Alternative dry density calculation from water content
    const dryDensityFromWC = wetDensity / (1 + wc / 100);

    // Calculate degree of saturation (assuming specific gravity of 2.65)
    const specificGravity = 2.65;
    const voidRatio = (specificGravity * 1000) / dryDensity - 1;
    const degreeOfSaturation = (wc * specificGravity) / (voidRatio * 100) * 100;

    // Compaction efficiency
    const maxDryDensity = 2.1; // Typical maximum dry density for reference
    const compactionEfficiency = (dryDensity / maxDryDensity) * 100;

    // Classification
    let compactionLevel = '';
    if (compactionEfficiency >= 95) {
      compactionLevel = 'Excellent';
    } else if (compactionEfficiency >= 90) {
      compactionLevel = 'Good';
    } else if (compactionEfficiency >= 85) {
      compactionLevel = 'Fair';
    } else {
      compactionLevel = 'Poor';
    }

    setResults({
      wetDensity: wetDensity.toFixed(3),
      dryDensity: dryDensity.toFixed(3),
      dryDensityFromWC: dryDensityFromWC.toFixed(3),
      voidRatio: voidRatio.toFixed(3),
      degreeOfSaturation: Math.min(100, degreeOfSaturation).toFixed(1),
      compactionEfficiency: Math.min(100, compactionEfficiency).toFixed(1),
      compactionLevel,
      waterContent: wc.toFixed(1)
    });

    toast({
      title: "Compaction Analysis Complete",
      description: `Dry density: ${dryDensity.toFixed(3)} g/cm³`,
    });
  };

  const resetForm = () => {
    setWetMass('');
    setDryMass('');
    setMoldVolume('');
    setWaterContent('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center text-teal-800">
            <Hammer className="h-5 w-5 mr-2" />
            Standard Proctor Compaction Test
          </CardTitle>
          <CardDescription className="text-teal-600">
            Determine maximum dry density and optimum moisture content (ASTM D698)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wetMass" className="text-teal-700 font-medium">
                Wet Mass (g)
              </Label>
              <Input
                id="wetMass"
                type="number"
                placeholder="Enter wet mass"
                value={wetMass}
                onChange={(e) => setWetMass(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dryMass" className="text-teal-700 font-medium">
                Dry Mass (g)
              </Label>
              <Input
                id="dryMass"
                type="number"
                placeholder="Enter dry mass"
                value={dryMass}
                onChange={(e) => setDryMass(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moldVolume" className="text-teal-700 font-medium">
                Mold Volume (cm³)
              </Label>
              <Input
                id="moldVolume"
                type="number"
                placeholder="944 (standard)"
                value={moldVolume}
                onChange={(e) => setMoldVolume(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="waterContent" className="text-teal-700 font-medium">
                Water Content (%)
              </Label>
              <Input
                id="waterContent"
                type="number"
                step="0.1"
                placeholder="Enter water content"
                value={waterContent}
                onChange={(e) => setWaterContent(e.target.value)}
                className="border-teal-200 focus:border-teal-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateCompaction} className="bg-teal-600 hover:bg-teal-700">
              Calculate Compaction
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-teal-300 text-teal-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-indigo-800 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Compaction Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Wet Density:</span>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {results.wetDensity} g/cm³
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Dry Density:</span>
                  <Badge className="bg-indigo-600 text-white">
                    {results.dryDensity} g/cm³
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Void Ratio:</span>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {results.voidRatio}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Water Content:</span>
                  <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                    {results.waterContent}%
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Degree of Saturation:</span>
                  <Badge className="bg-indigo-600 text-white">
                    {results.degreeOfSaturation}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-indigo-700">Compaction Efficiency:</span>
                  <Badge className="bg-indigo-600 text-white">
                    {results.compactionEfficiency}%
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-indigo-700 block mb-1">Compaction Level:</span>
                  <Badge variant="outline" className="border-indigo-400 text-indigo-700">
                    {results.compactionLevel}
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

export default CompactionTest;
