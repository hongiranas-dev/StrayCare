import { motion } from "framer-motion";
import { Link } from "wouter";
import { HeartPulse, ShieldAlert, PawPrint, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import heroImg from "@/assets/safety/hero-community.jpg";
import firstAidImg from "@/assets/safety/first-aid.jpg";
import rabiesImg from "@/assets/safety/rabies-vaccine.jpg";
import encounterImg from "@/assets/safety/stray-dog-encounter.jpg";

export function Safety() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20"
            >
              For the Community
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]"
            >
              Safety & <span className="text-gradient">Awareness</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl font-medium"
            >
              Know what to do when you encounter a stray dog, after a bite, and how to stay rabies-aware.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 bg-primary/5 rounded-3xl blur-2xl transform translate-x-4 translate-y-4"></div>
            <img 
              src={heroImg} 
              alt="Person walking calmly with a dog in a community setting" 
              className="rounded-3xl object-cover aspect-[4/3] w-full shadow-2xl shadow-primary/10 border border-border/50"
            />
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-12">
        {/* Section 1: What to do after a dog bite */}
        <motion.div {...fadeInUp}>
          <Card className="overflow-hidden border-border/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-3xl bg-card/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative h-64 md:h-auto">
                <img src={firstAidImg} alt="Person washing a minor wound under running water" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">What to do after a dog bite</h2>
                </div>
                <ul className="space-y-4 text-muted-foreground font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Wash the wound immediately with soap and running water for at least 15 minutes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Apply an antiseptic (povidone-iodine or alcohol) to the cleaned wound.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Seek medical help within 24 hours, even if the wound looks minor.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Follow your doctor's vaccination advice — post-exposure rabies shots are time-sensitive.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 2: Rabies Awareness */}
        <motion.div {...fadeInUp}>
          <Card className="overflow-hidden border-border/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-3xl bg-card/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center space-y-8 order-2 md:order-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Rabies Awareness</h2>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground">Symptoms in dogs</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Aggression or unusual friendliness</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Excessive salivation</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Paralysis or difficulty moving</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Change in bark tone</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground">Symptoms in humans</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Fever, headache, confusion</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Agitation or anxiety</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Fear of water (hydrophobia)</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 shrink-0" /> Difficulty swallowing</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" /> Prevention
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Vaccinate pets annually, avoid contact with unknown animals, do not handle injured strays without protection, and report suspected rabid animals to local animal control.
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 relative h-64 md:h-auto order-1 md:order-2">
                <img src={rabiesImg} alt="Veterinarian holding a medical vaccine vial" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 3: Safety Tips Around Stray Dogs */}
        <motion.div {...fadeInUp}>
          <Card className="overflow-hidden border-border/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-3xl bg-card/80 backdrop-blur-sm">
            <div className="grid md:grid-cols-5 gap-0">
              <div className="md:col-span-2 relative h-64 md:h-auto">
                <img src={encounterImg} alt="Person calmly walking past a dog on a street" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="md:col-span-3 p-8 sm:p-10 flex flex-col justify-center space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <PawPrint className="w-6 h-6" />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold">Safety Tips Around Stray Dogs</h2>
                </div>
                <ul className="space-y-4 text-muted-foreground font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Do not run or panic — running can trigger a chase response.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Avoid direct, prolonged eye contact; turn your body slightly to the side.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Do not disturb dogs while they're eating, sleeping, or with puppies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Stay calm, lower your voice, and slowly back away — never turn your back and run.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>If a dog approaches, "be a tree" — stand still with hands at your sides until it loses interest.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* CTA Footer */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full mt-20">
        <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/30 border border-primary/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-lg">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">See a stray dog?</h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Help us track and rescue strays in the community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="rounded-xl h-14 px-8 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-primary/90">
              <Link href="/">
                Report a sighting
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="rounded-xl h-14 px-8 text-base font-bold">
              <Link href="/admin">
                View all rescues
              </Link>
            </Button>
          </div>
        </div>
        
        <p className="text-center text-xs text-muted-foreground/60 mt-12 max-w-2xl mx-auto">
          This page provides general guidance only. Always consult a qualified medical professional for treatment after a dog bite or possible rabies exposure.
        </p>
      </section>
    </div>
  );
}
