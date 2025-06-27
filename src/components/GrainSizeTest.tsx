
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layers, PieChart } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GrainSizeTest = () => {
  const [totalMass, setTotalMass] = useState('');
  const [sieve4, setSieve4] = useState('');
  const [sieve10, setSieve10] = useState('');
  const [sieve40, setSieve40] = useState('');
  const [sieve200, setSieve200] = useState('');
  const [results, setResults] = useState(null);

  const calculateGrainSize = () => {
    const total = parseFloat(totalMass);
    const s4 = parseFloat(sieve4) || 0;
    const s10 = parseFloat(sieve10) || 0;
    const s40 = parseFloat(sieve40) || 0;
    const s200 = parseFloat(sieve200) || 0;

    if (isNaN(total) || total <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid total mass.",
        variant: "destructive",
      });
      return;
    }

    // Calculate cumulative percentages
    const cumulative4 = (s4 / total) * 100;
    const cumulative10 = ((s4 + s10) / total) * 100;
    const cumulative40 = ((s4 + s10 + s40) / total) * 100;
    const cumulative200 = ((s4 + s10 + s40 + s200) / total) * 100;

    // Calculate percentage passing
    const passing4 = 100 - cumulative4;
    const passing10 = 100 - cumulative10;
    const passing40 = 100 - cumulative40;
    const passing200 = 100 - cumulative200;

    // Grain size distribution
    const gravel = cumulative4;
    const coarseSand = cumulative10 - cumulative4;
    const mediumSand = cumulative40 - cumulative10;
    const fineSand = cumulative200 - cumulative40;
    const fines = 100 - cumulative200;

    // Uniformity coefficient and coefficient of gradation
    const d60 = interpolateD(60, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);
    const d30 = interpolateD(30, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);
    const d10 = interpolateD(10, [passing4, passing10, passing40, passing200], [4.75, 2, 0.425, 0.075]);

    const Cu = d60 / d10;
    const Cc = (d30 * d30) / (d60 * d10);

    // Soil classification
    let classification = '';
    if (gravel > 50) {
      classification = 'Gravel (G)';
    } else if (coarseSand + mediumSand + fineSand > 50) {
      classification = 'Sand (S)';
    } else {
      classification = 'Fine-grained (M/C)';
    }

    setResults({
      gravel: gravel.toFixed(1),
      coarseSand: coarseSand.toFixed(1),
      mediumSand: mediumSand.toFixed(1),
      fineSand: fineSand.toFixed(1),
      fines: fines.toFixed(1),
      Cu: Cu.toFixed(2),
      Cc: Cc.toFixed(2),
      d60: d60.toFixed(3),
      d30: d30.toFixed(3),
      d10: d10.toFixed(3),
      classification
    });

    toast({
      title: "Grain Size Analysis Complete",
      description: `Primary classification: ${classification}`,
    });
  };

  // Helper function to interpolate particle sizes
  const interpolateD = (percent, passings, sizes) => {
    for (let i = 0; i < passings.length - 1; i++) {
      if (percent >= passings[i+1] && percent <= passings[i]) {
        const ratio = (percent - passings[i+1]) / (passings[i] - passings[i+1]);
        return sizes[i+1] + ratio * (sizes[i] - sizes[i+1]);
      }
    }
    return sizes[sizes.length - 1];
  };

  const resetForm = () => {
    setTotalMass('');
    setSieve4('');
    setSieve10('');
    setSieve40('');
    setSieve200('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center text-emerald-800">
            <Layers className="h-5 w-5 mr-2" />
            Grain Size Distribution Analysis
          </CardTitle>
          <CardDescription className="text-emerald-600">
            Determine particle size distribution using sieve analysis (ASTM D6913)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalMass" className="text-emerald-700 font-medium">
              Total Sample Mass (g)
            </Label>
            <Input
              id="totalMass"
              type="number"
              placeholder="Enter total mass"
              value={totalMass}
              onChange={(e) => setTotalMass(e.target.value)}
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sieve4" className="text-emerald-700 font-medium">
                Sieve #4 (4.75mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve4"
                type="number"
                placeholder="0"
                value={sieve4}
                onChange={(e) => setSieve4(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve10" className="text-emerald-700 font-medium">
                Sieve #10 (2.0mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve10"
                type="number"
                placeholder="0"
                value={sieve10}
                onChange={(e) => setSieve10(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve40" className="text-emerald-700 font-medium">
                Sieve #40 (0.425mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve40"
                type="number"
                placeholder="0"
                value={sieve40}
                onChange={(e) => setSieve40(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sieve200" className="text-emerald-700 font-medium">
                Sieve #200 (0.075mm) - Retained Mass (g)
              </Label>
              <Input
                id="sieve200"
                type="number"
                placeholder="0"
                value={sieve200}
                onChange={(e) => setSieve200(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateGrainSize} className="bg-emerald-600 hover:bg-emerald-700">
              Analyze Distribution
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-emerald-300 text-emerald-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-rose-800 flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Grain Size Distribution Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-rose-700 mb-2">Particle Distribution:</h4>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Gravel:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.gravel}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Coarse Sand:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.coarseSand}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Medium Sand:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.mediumSand}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Fine Sand:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.fineSand}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Fines:</span>
                  <Badge className="bg-rose-600 text-white">
                    {results.fines}%
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-rose-700 mb-2">Gradation Parameters:</h4>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">D₆₀:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.d60} mm
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">D₃₀:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.d30} mm
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">D₁₀:</span>
                  <Badge variant="secondary" className="bg-rose-100 text-rose-800">
                    {results.d10} mm
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Cᵤ:</span>
                  <Badge className="bg-rose-600 text-white">
                    {results.Cu}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-700">Cᶜ:</span>
                  <Badge className="bg-rose-600 text-white">
                    {results.Cc}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-rose-700 block mb-1">Classification:</span>
                  <Badge variant="outline" className="border-rose-400 text-rose-700">
                    {results.classification}
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

export default GrainSizeTest;
