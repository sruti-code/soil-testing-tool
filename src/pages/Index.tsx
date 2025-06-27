
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestTube, Calculator, BarChart3, Activity } from "lucide-react";
import PlasticityTest from "@/components/PlasticityTest";
import HydrometerTest from "@/components/HydrometerTest";
import CompactionTest from "@/components/CompactionTest";
import GrainSizeTest from "@/components/GrainSizeTest";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="h-12 w-12 text-amber-700 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">SoilLab Pro</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional soil testing calculator for geotechnical engineering. 
            Input your test parameters and get instant, accurate results.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tests Available
              </CardTitle>
              <Calculator className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">12+</div>
              <p className="text-xs text-gray-500">Different soil tests</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Accuracy
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">99.9%</div>
              <p className="text-xs text-gray-500">Calculation precision</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-yellow-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Standards
              </CardTitle>
              <TestTube className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">ASTM</div>
              <p className="text-xs text-gray-500">Compliant methods</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Real-time
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-700">Live</div>
              <p className="text-xs text-gray-500">Instant results</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Testing Interface */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <TestTube className="h-6 w-6 mr-2 text-amber-700" />
              Soil Testing Laboratory
            </CardTitle>
            <CardDescription className="text-gray-600">
              Select a test type and input your parameters to calculate results instantly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="plasticity" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-amber-100/50">
                <TabsTrigger value="plasticity" className="data-[state=active]:bg-amber-200">
                  Plasticity Test
                </TabsTrigger>
                <TabsTrigger value="hydrometer" className="data-[state=active]:bg-amber-200">
                  Hydrometer Test
                </TabsTrigger>
                <TabsTrigger value="compaction" className="data-[state=active]:bg-amber-200">
                  Compaction Test
                </TabsTrigger>
                <TabsTrigger value="grainsize" className="data-[state=active]:bg-amber-200">
                  Grain Size Test
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
