import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Docs = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">TerraGuardian Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Learn about our mission, vision, and how our platform transforms community-led land restoration
        </p>
      </div>

      {/* Executive Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Executive Summary</CardTitle>
          <CardDescription>
            TerraGuardian is a revolutionary mobile-first platform that transforms community members into active land guardians
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            TerraGuardian is a revolutionary mobile-first platform that transforms community members into active land guardians through gamified monitoring, AI-driven regeneration guidance, and measurable impact tracking. By combining computer vision, large language models, and geospatial analysis, TerraGuardian democratizes land restoration while keeping communities at the heart of climate action.
          </p>
          <p className="font-semibold">
            Tagline: "Where Community Observations Meet AI Intelligence for Climate Action"
          </p>
        </CardContent>
      </Card>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To empower communities worldwide to become active stewards of land health by providing accessible, AI-powered tools that make land restoration participatory, data-driven, and economically viable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              A world where every community member can contribute to reversing land degradation, where local observations combine with artificial intelligence to create actionable regeneration strategies, and where communities are rewarded for their environmental stewardship through verifiable impact data.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Problem Statement */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Critical Challenges:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Disconnected Land Management:</strong> Top-down approaches miss on-the-ground realities and fail to engage local communities</li>
              <li><strong>Inaccessible Regenerative Knowledge:</strong> Farmers lack hyperlocal, actionable advice for regenerative practices tailored to their specific conditions</li>
              <li><strong>Lack of Verification Systems:</strong> Community-led restoration efforts cannot access carbon markets due to absence of credible verification mechanisms</li>
              <li><strong>Data Fragmentation:</strong> Communities cannot visualize their collective environmental impact</li>
            </ul>
            
            <div>
              <h3 className="font-semibold text-lg">Global Context:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Land degradation affects 3.2 billion people globally</li>
                <li>Limited tools exist that combine community engagement with scientific verification</li>
                <li>Economic incentives for restoration are inaccessible to most communities</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solution Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Solution Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            TerraGuardian bridges these gaps through a mobile-first platform that is:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Participatory:</strong> Gamification drives sustained community engagement</li>
            <li><strong>Intelligent:</strong> Multi-AI system provides personalized guidance</li>
            <li><strong>Verifiable:</strong> Satellite data enables impact measurement for carbon markets</li>
            <li><strong>Accessible:</strong> Offline-first architecture works in low-connectivity areas</li>
          </ul>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Core Product Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Module 1: Gamified Land Monitoring</h3>
              <p className="mb-2"><strong>Core Concept:</strong> "Every Photo Builds a Healthier Planet"</p>
              <p>Features include 5 pre-built quest types covering critical land health indicators: Soil Erosion Detection, Crop Health Assessment, Water Source Monitoring, Tree/Vegetation Health, and Bare/Degraded Land Identification.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Module 2: AI Regeneration Advisor</h3>
              <p className="mb-2"><strong>Core Concept:</strong> "Hyperlocal Wisdom from Global Intelligence"</p>
              <p>Powered by Claude.ai, providing soil health insights, native species selection, seasonal action plans, erosion control strategies, and educational content based on local conditions.</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Module 3: Impact Tracking & Verification</h3>
              <p className="mb-2"><strong>Core Concept:</strong> "Prove Your Progress, Unlock Carbon Credits"</p>
              <p>Includes plot claiming system, satellite-based verification using NDVI analysis, and community impact dashboard showing hectares restored, CO2 sequestered, biodiversity index, and more.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Model */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Business Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Carbon Credit Marketplace (Primary)</h4>
              <p>Revenue sharing from verified carbon credits - communities receive 70% of carbon credit sales, TerraGuardian retains 30% as platform fee.</p>
            </div>
            <div>
              <h4 className="font-semibold">Freemium Subscription</h4>
              <p>Free tier with basic features, Guardian Pro ($5/month) with unlimited AI advice and advanced analytics, and Organization tier ($50/month) with white-label capabilities.</p>
            </div>
            <div>
              <h4 className="font-semibold">B2B/B2G Partnerships</h4>
              <p>Platform licensing to NGOs and governments, custom MRV solutions, data analytics and insights reports.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Users */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Target Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Smallholder Farmers</h4>
              <p>1-10 hectare landholdings, interested in improving yields and soil health, limited access to agricultural extension services.</p>
            </div>
            <div>
              <h4 className="font-semibold">Rural Community Members</h4>
              <p>Looking for ways to contribute to community wellbeing and environmental education with meaningful engagement opportunities.</p>
            </div>
            <div>
              <h4 className="font-semibold">Community-Based Organizations</h4>
              <p>Local NGOs, farmers' cooperatives, women's groups coordinating community development projects and needing data to demonstrate impact.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Frontend & UI</h4>
              <ul className="list-disc pl-6">
                <li>React with TypeScript</li>
                <li>Shadcn UI components</li>
                <li>Mobile-first PWA architecture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Backend & Data</h4>
              <ul className="list-disc pl-6">
                <li>Supabase (PostgreSQL, Auth, Storage)</li>
                <li>Node.js API services</li>
                <li>TensorFlow Lite (offline AI)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">AI & Intelligence</h4>
              <ul className="list-disc pl-6">
                <li>Claude.ai for natural language processing</li>
                <li>Computer vision for image validation</li>
                <li>Geospatial analysis with satellite imagery</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Geospatial & Verification</h4>
              <ul className="list-disc pl-6">
                <li>Sentinel Hub / Google Earth Engine</li>
                <li>NDVI analysis for vegetation health</li>
                <li>Plot claiming and monitoring system</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sustainability Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sustainable Development Goals Alignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">SDG 15: Life on Land (Primary)</h4>
              <p>Restore degraded land and soil, combat desertification, halt biodiversity loss, sustainable forest management</p>
            </div>
            <div>
              <h4 className="font-semibold">SDG 13: Climate Action</h4>
              <p>Carbon sequestration through land restoration, climate change adaptation for communities, education on climate impacts</p>
            </div>
            <div>
              <h4 className="font-semibold">SDG 2: Zero Hunger</h4>
              <p>Improved agricultural productivity through regenerative practices, soil health enhancement, climate-resilient farming</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Docs;