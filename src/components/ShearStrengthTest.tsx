import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const ShearStrengthTest = () => {
  const [normalStress1, setNormalStress1] = useState('');
  const [shearStress1, setShearStress1] = useState('');
  const [normalStress2, setNormalStress2] = useState('');
  const [shearStress2, setShearStress2] = useState('');
  const [normalStress3, setNormalStress3] = useState('');
  const [shearStress3, setShearStress3] = useState('');
  const [results, setResults] = useState(null);

  const calculateShearStrength = () => {
    const n1 = parseFloat(normalStress1);
    const s1 = parseFloat(shearStress1);
    const n2 = parseFloat(normalStress2);
    const s2 = parseFloat(shearStress2);
    const n3 = parseFloat(normalStress3);
    const s3 = parseFloat(shearStress3);

    if (isNaN(n1) || isNaN(s1) || isNaN(n2) || isNaN(s2) || isNaN(n3) || isNaN(s3)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numerical values for all stress pairs.",
        variant: "destructive",
      });
      return;
    }

    // Calculate cohesion (c) and friction angle (φ) using linear regression - IS 2720 Part 13
    const n = 3;
    const sumN = n1 + n2 + n3;
    const sumS = s1 + s2 + s3;
    const sumNS = n1*s1 + n2*s2 + n3*s3;
    const sumN2 = n1*n1 + n2*n2 + n3*n3;

    // Slope (tan φ) and intercept (c) from Coulomb's equation
    const tanPhi = (n * sumNS - sumN * sumS) / (n * sumN2 - sumN * sumN);
    const cohesion = (sumS - tanPhi * sumN) / n;
    const frictionAngle = Math.atan(tanPhi) * (180 / Math.PI);

    // Generate Mohr-Coulomb failure envelope
    const envelopeData = [];
    const maxNormal = Math.max(n1, n2, n3) * 1.5;
    for (let i = 0; i <= 12; i++) {
      const normalStress = (maxNormal / 12) * i;
      const shearStrength = Math.max(0, cohesion + normalStress * tanPhi);
      envelopeData.push({
        normal: normalStress.toFixed(1),
        shear: shearStrength.toFixed(2)
      });
    }

    // Test points for visualization
    const testPoints = [
      { normal: n1, shear: s1, name: 'Test 1' },
      { normal: n2, shear: s2, name: 'Test 2' },
      { normal: n3, shear: s3, name: 'Test 3' }
    ];

    // Soil classification based on friction angle (IS 1498)
    let soilType = '';
    let bearingCapacity = '';
    
    if (frictionAngle > 35) {
      soilType = 'Dense Sand/Gravel';
      bearingCapacity = 'Very High';
    } else if (frictionAngle > 30) {
      soilType = 'Medium Dense Sand';
      bearingCapacity = 'High';
    } else if (frictionAngle > 25) {
      soilType = 'Loose Sand/Stiff Clay';
      bearingCapacity = 'Medium';
    } else if (frictionAngle > 15) {
      soilType = 'Soft to Medium Clay';
      bearingCapacity = 'Low';
    } else {
      soilType = 'Very Soft Clay';
      bearingCapacity = 'Very Low';
    }

    setResults({
      cohesion: Math.max(0, cohesion).toFixed(2),
      frictionAngle: frictionAngle.toFixed(1),
      tanPhi: tanPhi.toFixed(3),
      soilType,
      bearingCapacity,
      envelopeData,
      testPoints,
      calculations: {
        formula: 'τ = c + σ × tan(φ)',
        cohesionCalc: `c = ${Math.max(0, cohesion).toFixed(2)} kPa`,
        angleCalc: `φ = ${frictionAngle.toFixed(1)}°`
      }
    });

    toast({
      title: "Shear Strength Analysis Complete",
      description: `φ = ${frictionAngle.toFixed(1)}°, c = ${Math.max(0, cohesion).toFixed(2)} kPa`,
    });
  };

  const resetForm = () => {
    setNormalStress1('');
    setShearStress1('');
    setNormalStress2('');
    setShearStress2('');
    setNormalStress3('');
    setShearStress3('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <Zap className="h-5 w-5 mr-2" />
            Direct Shear Test
          </CardTitle>
          <CardDescription className="text-red-600 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            IS 2720 (Part 13) - 1986: Determination of shear strength parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Description with Diagram */}
          <div className="bg-red-50 rounded-lg p-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-48 h-32 bg-white rounded-lg border-2 border-red-200 flex items-center justify-center">
                <svg width="180" height="120" viewBox="0 0 180 120" className="text-red-600">
                  {/* Shear box */}
                  <rect x="60" y="50" width="60" height="30" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <line x1="60" y1="65" x2="120" y2="65" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2"/>
                  <text x="90" y="45" textAnchor="middle" fontSize="8" fill="currentColor">Shear Box</text>
                  
                  {/* Soil sample */}
                  <rect x="70" y="55" width="40" height="20" fill="#8B4513" opacity="0.7"/>
                  <text x="90" y="95" textAnchor="middle" fontSize="8" fill="currentColor">Soil Sample</text>
                  
                  {/* Normal load */}
                  <rect x="85" y="20" width="10" height="20" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="90" y="15" textAnchor="middle" fontSize="8" fill="currentColor">Normal Load</text>
                  <line x1="90" y1="40" x2="90" y2="50" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                  
                  {/* Shear force */}
                  <line x1="30" y1="65" x2="60" y2="65" stroke="currentColor" strokeWidth="3" markerEnd="url(#arrowhead)"/>
                  <text x="20" y="60" fontSize="8" fill="currentColor">Shear</text>
                  <text x="20" y="70" fontSize="8" fill="currentColor">Force</text>
                  
                  {/* Dial gauges */}
                  <circle cx="140" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <line x1="140" y1="40" x2="145" y2="35" stroke="currentColor" strokeWidth="1"/>
                  <text x="135" y="55" fontSize="6" fill="currentColor">Vertical Dial</text>
                  
                  <circle cx="140" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <line x1="140" y1="75" x2="145" y2="70" stroke="currentColor" strokeWidth="1"/>
                  <text x="135" y="90" fontSize="6" fill="currentColor">Horizontal Dial</text>
                  
                  {/* Proving ring */}
                  <circle cx="35" cy="65" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <text x="35" y="85" textAnchor="middle" fontSize="6" fill="currentColor">Proving Ring</text>
                  
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="currentColor"/>
                    </marker>
                  </defs>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Test Description</h3>
                <p className="text-sm text-red-700">
                  The direct shear test determines the shear strength parameters (cohesion and angle of internal friction) 
                  of soil by applying normal stress and measuring the shear stress at failure. Multiple tests at different 
                  normal stresses establish the Mohr-Coulomb failure envelope for foundation design.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="font-semibold text-red-700">Test 1</h4>
              <div className="space-y-2">
                <Label htmlFor="normalStress1" className="text-red-700 font-medium">
                  Normal Stress (kPa)
                </Label>
                <Input
                  id="normalStress1"
                  type="number"
                  placeholder="Enter normal stress"
                  value={normalStress1}
                  onChange={(e) => setNormalStress1(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shearStress1" className="text-red-700 font-medium">
                  Peak Shear Stress (kPa)
                </Label>
                <Input
                  id="shearStress1"
                  type="number"
                  placeholder="Enter shear stress"
                  value={shearStress1}
                  onChange={(e) => setShearStress1(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-red-700">Test 2</h4>
              <div className="space-y-2">
                <Label htmlFor="normalStress2" className="text-red-700 font-medium">
                  Normal Stress (kPa)
                </Label>
                <Input
                  id="normalStress2"
                  type="number"
                  placeholder="Enter normal stress"
                  value={normalStress2}
                  onChange={(e) => setNormalStress2(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shearStress2" className="text-red-700 font-medium">
                  Peak Shear Stress (kPa)
                </Label>
                <Input
                  id="shearStress2"
                  type="number"
                  placeholder="Enter shear stress"
                  value={shearStress2}
                  onChange={(e) => setShearStress2(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-red-700">Test 3</h4>
              <div className="space-y-2">
                <Label htmlFor="normalStress3" className="text-red-700 font-medium">
                  Normal Stress (kPa)
                </Label>
                <Input
                  id="normalStress3"
                  type="number"
                  placeholder="Enter normal stress"
                  value={normalStress3}
                  onChange={(e) => setNormalStress3(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shearStress3" className="text-red-700 font-medium">
                  Peak Shear Stress (kPa)
                </Label>
                <Input
                  id="shearStress3"
                  type="number"
                  placeholder="Enter shear stress"
                  value={shearStress3}
                  onChange={(e) => setShearStress3(e.target.value)}
                  className="border-red-200 focus:border-red-400"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={calculateShearStrength} className="bg-red-600 hover:bg-red-700">
              Analyze Shear Strength
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-red-300 text-red-700">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Mohr-Coulomb Failure Envelope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="normal" label={{ value: 'Normal Stress (kPa)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Shear Stress (kPa)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line data={results.envelopeData} type="monotone" dataKey="shear" stroke="#dc2626" strokeWidth={2} />
                  {/* Test points overlay */}
                  <ScatterChart data={results.testPoints}>
                    <Scatter dataKey="shear" fill="#ef4444" />
                  </ScatterChart>
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
                <p><strong>Mohr-Coulomb Formula:</strong> {results.calculations.formula}</p>
                <p><strong>Cohesion:</strong> {results.calculations.cohesionCalc}</p>
                <p><strong>Friction Angle:</strong> {results.calculations.angleCalc}</p>
                <p className="text-xs mt-2">Parameters derived from linear regression of test data</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-yellow-800">Shear Strength Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-700">Cohesion (c):</span>
                    <Badge className="bg-yellow-600 text-white">
                      {results.cohesion} kPa
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-700">Friction Angle (φ):</span>
                    <Badge className="bg-yellow-600 text-white">
                      {results.frictionAngle}°
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-700">tan(φ):</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {results.tanPhi}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-yellow-700 block mb-1">Soil Classification:</span>
                    <Badge variant="outline" className="border-yellow-400 text-yellow-700 mb-2">
                      {results.soilType}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-700 block mb-1">Bearing Capacity:</span>
                    <Badge variant="outline" className="border-yellow-400 text-yellow-700">
                      {results.bearingCapacity}
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

export default ShearStrengthTest;
