import Hero from "../src/component/Hero";
import Education from "../src/component/Education";
import Experience from "../src/component/Experience";
import Achievements from "../src/component/Achievements";
import Projects from "../src/component/Projects";
import Skills from "../src/component/Skills";
import Certifications from "../src/component/Certifications";
import Contact from "../src/component/Contact";
import Footer from "../src/component/Footer";
import type { Metadata } from "next";

// Page-specific SEO metadata
export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Nasche Del Ponso's portfolio. Explore projects, skills, and achievements in cloud computing, AI, and web development.",
};

export default function Home() {
  return (
    <main>
      {/* Hero Section - Main Introduction */}
      <section id="home" aria-label="Introduction">
        <Hero />
      </section>

      <article>
        {/* Education & Credentials */}
        <section id="education" aria-labelledby="education-heading">
          <h2 id="education-heading" className="sr-only">
            Education
          </h2>
          <Education />
        </section>

        {/* Work Experience */}
        <section id="experience" aria-labelledby="experience-heading">
          <h2 id="experience-heading" className="sr-only">
            Work Experience
          </h2>
          <Experience />
        </section>

        {/* Achievements & Awards */}
        <section id="achievements" aria-labelledby="achievements-heading">
          <h2 id="achievements-heading" className="sr-only">
            Achievements
          </h2>
          <Achievements />
        </section>

        {/* Featured Projects Portfolio */}
        <section id="projects" aria-labelledby="projects-heading">
          <h2 id="projects-heading" className="sr-only">
            Featured Projects
          </h2>
          <Projects />
        </section>

        {/* Technical Skills */}
        <section id="skills" aria-labelledby="skills-heading">
          <h2 id="skills-heading" className="sr-only">
            Technical Skills
          </h2>
          <Skills />
        </section>

        {/* Certifications & Credentials */}
        <section id="certifications" aria-labelledby="certifications-heading">
          <h2 id="certifications-heading" className="sr-only">
            Certifications
          </h2>
          <Certifications />
        </section>

        {/* Contact Information */}
        <section id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="sr-only">
            Contact Information
          </h2>
          <Contact />
        </section>
      </article>

      <footer>
        <Footer />
      </footer>
    </main>
  );
}
