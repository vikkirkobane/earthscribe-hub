import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Sprout } from "lucide-react";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact TerraGuardian</h1>
        <p className="text-xl text-muted-foreground">
          Get in touch with our team to learn more about our platform and partnership opportunities
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Reach out to us through any of these channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">contact@terraguardian.org</p>
                <p className="text-sm text-muted-foreground">For general inquiries and partnerships</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">Monday-Friday, 9AM-5PM EST</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-1">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Office</h3>
                <p className="text-muted-foreground">123 Sustainability Ave</p>
                <p className="text-muted-foreground">San Francisco, CA 94105</p>
                <p className="text-sm text-muted-foreground">United States</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>
              Have questions about our platform? Fill out the form and we'll get back to you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <Input placeholder="Your Email" type="email" />
              </div>
              <div className="space-y-2">
                <Input placeholder="Subject" />
              </div>
              <div className="space-y-2">
                <Textarea placeholder="Your message..." rows={4} />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Partnership Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Partnership Opportunities</CardTitle>
          <CardDescription>
            We're always looking for new partnerships to expand our impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">NGOs</h3>
              <p className="text-sm text-muted-foreground">Partner with us to engage your communities</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Governments</h3>
              <p className="text-sm text-muted-foreground">Scale land restoration in your region</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Researchers</h3>
              <p className="text-sm text-muted-foreground">Access our data for environmental studies</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">Explore Partnership Options</Button>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How does TerraGuardian work?</h3>
              <p className="text-muted-foreground mt-1">
                Our platform uses gamification to engage communities in land monitoring, AI-powered 
                advice for regeneration, and satellite verification to track impact and unlock carbon credit revenue.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Is the platform available globally?</h3>
              <p className="text-muted-foreground mt-1">
                Currently focusing on East Africa (Kenya, Tanzania, Uganda) and West Africa (Ghana, Nigeria), 
                with plans to expand globally.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">How can my community join?</h3>
              <p className="text-muted-foreground mt-1">
                Contact us through this form or connect with one of our local partners. We provide training 
                and support to help communities get started.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Contact;