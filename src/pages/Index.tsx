
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TestTube2, 
  BarChart3, 
  Calculator, 
  FlaskConical,
  Beaker,
  Layers,
  Target,
  Droplets,
  MessageSquare,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-yellow-25">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Admin Link */}
        <div className="flex justify-between items-start mb-12">
          <div className="text-center flex-1">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <TestTube2 className="h-16 w-16 text-amber-600" />
                <div className="absolute -top-2 -right-2">
                  <FlaskConical className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Soil <span className="text-amber-600">LAB</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Advanced Geotechnical Testing Platform - Comprehensive soil analysis with 
              IS code compliance, real-time calculations, and detailed reporting
            </p>
          </div>
          <Button
            onClick={() => navigate('/feedback-dashboard')}
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View Feedback
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TestTube2 className="h-10 w-10 text-amber-600 group-hover:scale-110 transition-transform" />
                <Badge variant="secondary">8 Tests</Badge>
              </div>
              <CardTitle className="text-gray-800">Comprehensive Testing Suite</CardTitle>
              <CardDescription>
                Full range of geotechnical soil tests including plasticity, compaction, 
                grain size analysis, and more
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BarChart3 className="h-10 w-10 text-green-600 group-hover:scale-110 transition-transform" />
                <Badge variant="secondary">Live Results</Badge>
              </div>
              <CardTitle className="text-gray-800">Real-time Analysis</CardTitle>
              <CardDescription>
                Instant calculations with interactive graphs, charts, and detailed 
                result interpretations
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-xl transition-all duration-300 group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Calculator className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform" />
                <Badge variant="secondary">IS Compliant</Badge>
              </div>
              <CardTitle className="text-gray-800">Standards Compliance</CardTitle>
              <CardDescription>
                All calculations follow Indian Standard (IS) codes for accurate 
                and reliable results
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Available Tests */}
        <Card className="bg-white/90 backdrop-blur-sm border-amber-200 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-800 mb-2">Available Soil Tests</CardTitle>
            <CardDescription className="text-lg">
              Professional-grade testing suite for complete soil characterization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: TestTube2, name: "Plasticity Index", desc: "Atterberg Limits" },
                { icon: Beaker, name: "Hydrometer", desc: "Particle Size" },
                { icon: Target, name: "Compaction", desc: "Proctor Test" },
                { icon: Layers, name: "Grain Size", desc: "Sieve Analysis" },
                { icon: Droplets, name: "Permeability", desc: "Flow Rate" },
                { icon: Target, name: "Consolidation", desc: "Settlement" },
                { icon: FlaskConical, name: "Shear Strength", desc: "Stability" },
                { icon: Calculator, name: "Specific Gravity", desc: "Density" }
              ].map((test, index) => (
                <div key={index} className="text-center p-4 rounded-lg hover:bg-amber-50 transition-colors">
                  <test.icon className="h-8 w-8 mx-auto mb-2 text-amber-600" />
                  <h3 className="font-semibold text-gray-800 text-sm">{test.name}</h3>
                  <p className="text-xs text-gray-600">{test.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/soil-tests')}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <TestTube2 className="mr-3 h-6 w-6" />
            Start Testing Now
          </Button>
          <p className="mt-4 text-gray-600">
            Get instant results with detailed analysis and professional reports
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
