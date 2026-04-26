import { ShieldAlert, Droplets, Syringe, Dog, TriangleAlert, HandHelping, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const biteSteps = [
  "Wash the wound immediately with soap and running water for at least 15 minutes.",
  "Apply a clean bandage and keep the wound covered.",
  "Seek medical care as soon as possible, even if the bite looks minor.",
  "Ask the doctor about tetanus and rabies vaccination.",
  "If safe, note the dog’s appearance and location for the report.",
];

const dogSymptoms = [
  "Sudden behavior changes, agitation, or unusual aggression.",
  "Excessive drooling, trouble swallowing, or frothing at the mouth.",
  "Weakness, stumbling, paralysis, or seizures.",
];

const humanSymptoms = [
  "Fever, headache, and discomfort around the bite site.",
  "Anxiety, confusion, or trouble sleeping.",
  "Muscle spasms, paralysis, or difficulty swallowing.",
];

const preventionTips = [
  "Keep pets vaccinated and avoid touching unfamiliar dogs.",
  "Report stray dogs from a safe distance instead of approaching them.",
  "Teach children to stay calm and slowly back away if a dog is loose.",
];

const doDonts = [
  ["Stand still, avoid eye contact, and let the dog move away.", "Run, scream, or make sudden movements."],
  ["Back away slowly with your body turned slightly sideways.", "Try to pet, feed, or corner the dog."],
  ["Use a barrier like a bag, jacket, or bicycle if needed.", "Reach toward the dog or lean over it."],
];

export function SafetyAwareness() {
  return (
    <div className="w-full pb-20">
      <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto w-full">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 rounded-[2rem]" />
        <div className="absolute -top-16 right-0 -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl opacity-50" />

        <div className="max-w-3xl space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/80 border border-border/60 text-sm font-semibold text-foreground shadow-sm">
            <ShieldAlert className="w-4 h-4 text-primary" /> Safety & Awareness
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Stay informed. Stay safe.</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Quick guidance for bites, rabies awareness, and calm behavior around stray dogs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-stretch">
          <Card className="lg:col-span-2 rounded-3xl border-border/60 bg-card/90 shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-0">
              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl font-bold">What to do after a dog bite</h2>
                    <p className="text-sm text-muted-foreground">Act quickly and get medical help.</p>
                  </div>
                </div>
                <ol className="space-y-3">
                  {biteSteps.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">{index + 1}</div>
                      <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 border-t md:border-t-0 md:border-l border-border/60 flex items-center justify-center">
                <div className="w-full max-w-sm rounded-3xl border border-border/60 bg-card/80 p-6 shadow-lg space-y-4 text-center">
                  <img src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80" alt="Dog safety illustration" className="w-full h-56 object-cover rounded-2xl" />
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold">Get help right away</h3>
                    <p className="text-sm text-muted-foreground">Medical care and reporting can make a big difference.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Syringe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Rabies Awareness</h2>
                  <p className="text-sm text-muted-foreground">Know the warning signs and prevention tips.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><Dog className="w-4 h-4 text-primary" /> Symptoms in dogs</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                    {dogSymptoms.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><TriangleAlert className="w-4 h-4 text-primary" /> Symptoms in humans</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                    {humanSymptoms.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/50 p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Prevention tips</h3>
                  <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                    {preventionTips.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
            <CardContent className="p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <HandHelping className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">Safety Tips Around Stray Dogs</h2>
                  <p className="text-sm text-muted-foreground">Simple do’s and don’ts for staying calm.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {doDonts.map(([doItem, dontItem], index) => (
                  <div key={index} className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-2">Do</p>
                      <p className="text-sm text-foreground/90">{doItem}</p>
                    </div>
                    <div className="border-t border-border/60 pt-4">
                      <p className="text-xs uppercase tracking-widest text-rose-500 font-semibold mb-2">Don't</p>
                      <p className="text-sm text-foreground/90">{dontItem}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/60 bg-card/90 shadow-xl">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold">How to approach safely</h2>
                  <p className="text-sm text-muted-foreground">Give the dog space and avoid sudden gestures.</p>
                </div>
              </div>

              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>Move slowly, keep your body turned sideways, and speak softly.</p>
                <p>Never trap a stray dog or reach toward its face.</p>
                <p>If the dog seems scared or injured, report it from a safe distance.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
