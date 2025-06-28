import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Hammer, Target, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

    // Calculate wet density (IS 2720 Part 8)
    const wetDensity = wetM / volume;

    // Calculate dry density using the relationship: γd = γw / (1 + w)
    const dryDensity = wetDensity / (1 + wc / 100);

    // Calculate degree of saturation (assuming specific gravity of 2.65)
    const specificGravity = 2.65;
    const voidRatio = (specificGravity * 1000) / dryDensity - 1;
    const degreeOfSaturation = Math.min(100, (wc * specificGravity) / (voidRatio * 100) * 100);

    // Compaction efficiency (comparing with typical maximum dry density)
    const maxDryDensity = 2.1; // Typical maximum dry density for reference
    const compactionEfficiency = Math.min(100, (dryDensity / maxDryDensity) * 100);

    // Classification based on IS 2132
    let compactionLevel = '';
    if (compactionEfficiency >= 95) {
      compactionLevel = 'Excellent Compaction';
    } else if (compactionEfficiency >= 90) {
      compactionLevel = 'Good Compaction';
    } else if (compactionEfficiency >= 85) {
      compactionLevel = 'Fair Compaction';
    } else {
      compactionLevel = 'Poor Compaction';
    }

    // Generate compaction curve data
    const chartData = [];
    const baseWC = wc;
    for (let i = -3; i <= 3; i++) {
      const wcPoint = baseWC + (i * 2);
      const dryDensityPoint = dryDensity * (1 - Math.abs(i) * 0.05);
      chartData.push({
        waterContent: wcPoint.toFixed(1),
        dryDensity: dryDensityPoint.toFixed(3)
      });
    }

    setResults({
      wetDensity: wetDensity.toFixed(3),
      dryDensity: dryDensity.toFixed(3),
      voidRatio: voidRatio.toFixed(3),
      degreeOfSaturation: degreeOfSaturation.toFixed(1),
      compactionEfficiency: compactionEfficiency.toFixed(1),
      compactionLevel,
      waterContent: wc.toFixed(1),
      chartData,
      calculations: {
        formula: 'γd = γw / (1 + w)',
        values: `γd = ${wetDensity.toFixed(3)} / (1 + ${wc}/100)`,
        result: `γd = ${dryDensity.toFixed(3)} g/cm³`
      }
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
          <CardDescription className="text-teal-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 8) - 1983: Determination of water content-dry density relation using heavy compaction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-teal-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-teal-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-teal-600">
                  {/* Proctor mold */}
                  <rect x="70" y="60" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="90" y="110" textAnchor="middle" fontSize="8" fill="currentColor">Proctor Mold</text>
                  
                  {/* Soil layers */}
                  <rect x="75" y="85" width="30" height="5" fill="#8B4513" opacity="0.8"/>
                  <rect x="75" y="75" width="30" height="5" fill="#8B4513" opacity="0.6"/>
                  <rect x="75" y="65" width="30" height="5" fill="#8B4513" opacity="0.4"/>
                  <text x="115" y="75" fontSize="6" fill="currentColor">3 Layers</text>
                  
                  {/* Rammer */}
                  <rect x="85" y="25" width="10" height="25" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="90" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="105" y="30" fontSize="8" fill="currentColor">2.5 kg</text>
                  <text x="105" y="40" fontSize="8" fill="currentColor">Rammer</text>
                  
                  {/* Drop height */}
                  <line x1="90" y1="50" x2="90" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
                  <text x="95" y="55" fontSize="6" fill="currentColor">30 cm</text>
                  
                  {/* Compaction energy indication */}
                  <line x1="90" y1="50" x2="90" y2="60" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  
                  {/* Base plate */}
                  <rect x="60" y="100" width="60" height="5" fill="#ccc" stroke="currentColor" strokeWidth="1"/>
                  <text x="90" y="118" textAnchor="middle" fontSize="8" fill="currentColor">Base Plate</text>
                  
                  {/* Blow count indication */}
                  <text x="30" y="70" fontSize="6" fill="currentColor">25 Blows</text>
                  <text x="30" y="80" fontSize="6" fill="currentColor">per Layer</text>
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-teal-800 mb-2">Test Description</h3>
                <p className="text-sm text-teal-700">
                  The Standard Proctor compaction test determines the maximum dry density and optimum moisture content 
                  of soil. The test involves compacting soil in a standard mold using a 2.5 kg rammer dropped from 
                  30 cm height in three layers with 25 blows per layer.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wetMass" className="text-teal-700 font-medium">
                Wet Mass of Soil + Mold (g)
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
                Dry Mass of Soil + Mold (g)
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
        <>
          <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-indigo-800 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Compaction Curve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="waterContent" label={{ value: 'Water Content (%)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Dry Density (g/cm³)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="dryDensity" stroke="#0ea5e9" strokeWidth={2} />
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
                <p className="text-xs mt-2">Where: γd = dry density, γw = wet density, w = water content (%)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Compaction Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Wet Density:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.wetDensity} g/cm³
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Dry Density:</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.dryDensity} g/cm³
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Void Ratio:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.voidRatio}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Water Content:</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {results.waterContent}%
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Degree of Saturation:</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.degreeOfSaturation}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-emerald-700">Compaction Efficiency:</span>
                    <Badge className="bg-emerald-600 text-white">
                      {results.compactionEfficiency}%
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-emerald-700 block mb-1">Compaction Level:</span>
                    <Badge variant="outline" className="border-emerald-400 text-emerald-700">
                      {results.compactionLevel}
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

export default CompactionTest;
