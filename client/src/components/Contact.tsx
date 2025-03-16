import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mail, Phone, Globe } from "lucide-react";

export default function Contact() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Get in Touch</h2>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:matheus@murbach.work" className="hover:text-primary transition-colors">
                      matheus@murbach.work
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+5535984073125" className="hover:text-primary transition-colors">
                      +55 35 984073125
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <a href="https://murbach.work" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      murbach.work
                    </a>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-4">Let's Connect</h3>
                <p className="text-muted-foreground mb-6">
                  I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                </p>
                <Button asChild size="lg">
                  <a href="mailto:matheus@murbach.work">Send Message</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
