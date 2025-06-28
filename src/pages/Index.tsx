
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, BookOpen, Zap, Target, Beaker, Hammer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const tests = [
    {
      icon: TestTube,
      title: "Atterberg Limits",
      description: "Determine liquid limit, plastic limit, and plasticity index",
      isCode: "IS 2720 (Part 5) - 1985",
      color: "bg-blue-500"
    },
    {
      icon: Beaker,
      title: "Hydrometer Analysis",
      description: "Grain size distribution of fine-grained soils",
      isCode: "IS 2720 (Part 4) - 1985",
      color: "bg-purple-500"
    },
    {
      icon: Hammer,
      title: "Compaction Test",
      description: "Standard and modified Proctor compaction",
      isCode: "IS 2720 (Part 8) - 1983",
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: "Shear Strength",
      description: "Direct shear test for cohesion and friction angle",
      isCode: "IS 2720 (Part 13) - 1986",
      color: "bg-red-500"
    }
  ];

  const standards = [
    {
      code: "IS 2720",
      title: "Methods of Test for Soils",
      description: "Comprehensive series covering all standard soil testing procedures",
      parts: "40+ Parts"
    },
    {
      code: "IS 1498",
      title: "Classification and Identification of Soils",
      description: "Standard for soil classification for general engineering purposes",
      parts: "1970"
    },
    {
      code: "IS 1888",
      title: "Method of Load Test on Soils",
      description: "Standard procedure for plate load test on soils",
      parts: "1982"
    },
    {
      code: "IS 8009",
      title: "Calculation of Settlement",
      description: "Methods for calculating settlement of shallow foundations",
      parts: "Part 1 - 1976"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-600 to-yellow-600 p-4 rounded-full">
              <TestTube className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Soil <span className="text-amber-600">LAB</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Advanced Digital Soil Testing Laboratory with IS Code Compliance
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
            Comprehensive geotechnical analysis tools following Indian Standard (IS) codes for 
            accurate soil characterization, foundation design, and construction quality control
          </p>
          <Button 
            onClick={() => navigate('/soil-tests')} 
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-3 text-lg"
          >
            Start Testing
          </Button>
        </div>

        {/* Quick Test Access */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <Zap className="h-6 w-6 mr-2 text-amber-600" />
              Featured Tests
            </CardTitle>
            <CardDescription>
              Most commonly used soil tests in geotechnical engineering practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tests.map((test, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-amber-100" onClick={() => navigate('/soil-tests')}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${test.color} rounded-full flex items-center justify-center mb-4`}>
                      <test.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{test.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                      {test.isCode}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* IS Standards Section */}
        <Card className="mb-12 bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-800 flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-amber-600" />
              Indian Standard (IS) Codes Compliance
            </CardTitle>
            <CardDescription>
              All tests are performed according to Bureau of Indian Standards specifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {standards.map((standard, index) => (
                <Card key={index} className="border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-amber-600 text-white font-semibold">
                        {standard.code}
                      </Badge>
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {standard.parts}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{standard.title}</h3>
                    <p className="text-sm text-gray-600">{standard.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TestTube className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">8 Comprehensive Tests</h3>
              <p className="text-gray-600">
                Complete suite of geotechnical tests including plasticity, compaction, permeability, and shear strength analysis
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">IS Code Compliant</h3>
              <p className="text-gray-600">
                All calculations and procedures follow Indian Standard codes ensuring accuracy and professional compliance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Analysis</h3>
              <p className="text-gray-600">
                Real-time calculations with detailed graphs, soil classification, and engineering interpretations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <h2 class="text-3xl font-bold mb-4">Ready to Start Testing?</h2>
            <p className="text-xl mb-6 opacity-90">
              Access professional-grade soil testing tools designed for Indian geotechnical practice
            </p>
            <Button 
              onClick={() => navigate('/soil-tests')} 
              size="lg"
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Launch Soil LAB
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
