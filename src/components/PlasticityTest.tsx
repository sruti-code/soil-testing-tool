
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

    // Soil classification based on plasticity
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

    setResults({
      plasticityIndex: plasticityIndex.toFixed(2),
      soilClassification,
      activityLevel,
      liquidLimit: LL.toFixed(1),
      plasticLimit: PL.toFixed(1)
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
          <CardDescription className="text-blue-600">
            Calculate plasticity index and soil classification based on liquid and plastic limits (ASTM D4318)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
      )}
    </div>
  );
};

export default PlasticityTest;
