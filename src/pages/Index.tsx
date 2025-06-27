
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TestTube, Calculator, BarChart3, Activity, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="h-12 w-12 text-amber-700 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Soil LAB</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional soil testing laboratory for geotechnical engineering. 
            Comprehensive analysis with instant results and detailed graphs.
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
              <div className="text-2xl font-bold text-amber-700">15+</div>
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

        {/* Main Call to Action */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gray-800 flex items-center justify-center">
              <TestTube className="h-8 w-8 mr-3 text-amber-700" />
              Welcome to Soil LAB
            </CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-4">
              Access comprehensive soil testing tools with detailed analysis, calculations, and graphical results
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg"
              onClick={() => navigate('/soil-tests')}
            >
              Start Soil Tests
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white/60 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get detailed graphs and visual representations of your soil test results with comprehensive analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Step-by-Step Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View detailed calculation steps and formulas used in each test for educational and verification purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Multiple Test Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Access a wide range of soil tests including plasticity, compaction, grain size, and many more specialized tests.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
