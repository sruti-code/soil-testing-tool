
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TestTube, ArrowLeft, Beaker, Hammer, Layers, PieChart, Droplets, Target, Zap, Thermometer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlasticityTest from "@/components/PlasticityTest";
import HydrometerTest from "@/components/HydrometerTest";
import CompactionTest from "@/components/CompactionTest";
import GrainSizeTest from "@/components/GrainSizeTest";
import PermeabilityTest from "@/components/PermeabilityTest";
import ConsolidationTest from "@/components/ConsolidationTest";
import ShearStrengthTest from "@/components/ShearStrengthTest";
import SpecificGravityTest from "@/components/SpecificGravityTest";

const SoilTests = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center">
            <TestTube className="h-8 w-8 text-amber-700 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Soil Testing Laboratory</h1>
          </div>
        </div>

        {/* Main Testing Interface */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <TestTube className="h-6 w-6 mr-2 text-amber-700" />
              Comprehensive Soil Analysis
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select a test type and input your parameters to get instant results with detailed graphs and calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="plasticity" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-amber-100/50 h-auto">
                <TabsTrigger value="plasticity" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <TestTube className="h-4 w-4 mb-1" />
                  <span className="text-xs">Plasticity</span>
                </TabsTrigger>
                <TabsTrigger value="hydrometer" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Beaker className="h-4 w-4 mb-1" />
                  <span className="text-xs">Hydrometer</span>
                </TabsTrigger>
                <TabsTrigger value="compaction" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Hammer className="h-4 w-4 mb-1" />
                  <span className="text-xs">Compaction</span>
                </TabsTrigger>
                <TabsTrigger value="grainsize" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Layers className="h-4 w-4 mb-1" />
                  <span className="text-xs">Grain Size</span>
                </TabsTrigger>
                <TabsTrigger value="permeability" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Droplets className="h-4 w-4 mb-1" />
                  <span className="text-xs">Permeability</span>
                </TabsTrigger>
                <TabsTrigger value="consolidation" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Target className="h-4 w-4 mb-1" />
                  <span className="text-xs">Consolidation</span>
                </TabsTrigger>
                <TabsTrigger value="shear" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Zap className="h-4 w-4 mb-1" />
                  <span className="text-xs">Shear</span>
                </TabsTrigger>
                <TabsTrigger value="gravity" className="data-[state=active]:bg-amber-200 flex flex-col items-center p-3">
                  <Thermometer className="h-4 w-4 mb-1" />
                  <span className="text-xs">Sp. Gravity</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="plasticity" className="mt-6">
                <PlasticityTest />
              </TabsContent>

              <TabsContent value="hydrometer" className="mt-6">
                <HydrometerTest />
              </TabsContent>

              <TabsContent value="compaction" className="mt-6">
                <CompactionTest />
              </TabsContent>

              <TabsContent value="grainsize" className="mt-6">
                <GrainSizeTest />
              </TabsContent>

              <TabsContent value="permeability" className="mt-6">
                <PermeabilityTest />
              </TabsContent>

              <TabsContent value="consolidation" className="mt-6">
                <ConsolidationTest />
              </TabsContent>

              <TabsContent value="shear" className="mt-6">
                <ShearStrengthTest />
              </TabsContent>

              <TabsContent value="gravity" className="mt-6">
                <SpecificGravityTest />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SoilTests;
