import Timeline from "./Timeline";

const experiences = [
  {
    date: "Jan 2013 — Present",
    title: "Senior Software Engineer | Founder",
    company: "murbach.work",
    description: "Independent software engineering consultancy providing professional services with focus on efficient results.",
  },
  {
    date: "Nov 2023 — Oct 2024",
    title: "Senior Software Engineer",
    company: "GO.K - One Step Ahead",
    description: "Led development of cutting-edge mobile and e-commerce experiences using React, React Native, and Node.js.",
  },
  {
    date: "Nov 2023 — Oct 2024",
    title: "Senior Software Engineer",
    company: "RD Saúde",
    description: "Developed healthcare solutions using React, React Native, and Node.js. Implemented best practices in software development.",
  },
  {
    date: "Jan 2018 — Aug 2021",
    title: "Lead Frontend Engineer",
    company: "Napp Solutions",
    description: "Led teams working on critical systems like Esphera serving hundreds of Brazilian shopping malls. Implemented TypeScript, Figma workflows, and custom Design Systems.",
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-16 text-center">Experience</h2>
        <Timeline experiences={experiences} />
      </div>
    </section>
  );
}
