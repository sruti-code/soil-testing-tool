
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestTube, FileText, Microscope, FlaskConical, Users, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TestTube,
      title: "Comprehensive Testing",
      description: "8 essential soil tests including Plasticity, Hydrometer, Compaction, and more"
    },
    {
      icon: FileText,
      title: "IS Code Compliant",
      description: "All tests follow Indian Standard (IS) codes for accurate and reliable results"
    },
    {
      icon: Microscope,
      title: "Detailed Analysis",
      description: "Advanced calculations with visual graphs and comprehensive reporting"
    },
    {
      icon: FlaskConical,
      title: "Laboratory Grade",
      description: "Professional-grade testing methods used in certified laboratories"
    }
  ];

  const stats = [
    { label: "Soil Tests", value: "8+" },
    { label: "IS Standards", value: "100%" },
    { label: "Accuracy", value: "99.9%" },
    { label: "Reports", value: "1000+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-600 p-4 rounded-full shadow-lg">
                <TestTube className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Soil <span className="text-amber-600">LAB</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced soil testing laboratory with comprehensive analysis tools. 
              Perform accurate soil tests following Indian Standard (IS) codes with instant results and detailed reporting.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/soil-tests')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Testing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Soil LAB?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade soil testing with accuracy and reliability that meets industry standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg text-gray-800">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* IS Standards Section */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Indian Standard (IS) Compliance</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                All our tests are conducted according to Bureau of Indian Standards (BIS) specifications
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-700">IS 2720</div>
                  <div className="text-sm text-gray-600">Soil Testing Methods</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-700">IS 1498</div>
                  <div className="text-sm text-gray-600">Soil Classification</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-700">IS 2132</div>
                  <div className="text-sm text-gray-600">Compaction Tests</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="font-semibold text-green-700">IS 2434</div>
                  <div className="text-sm text-gray-600">Permeability Tests</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-amber-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Testing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Access our comprehensive soil testing laboratory and get instant, accurate results
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/soil-tests')}
              className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Enter Laboratory <TestTube className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
