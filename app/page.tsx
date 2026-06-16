import Hero from "../src/component/Hero";
import Education from "../src/component/Education";
import Experience from "../src/component/Experience";
import Achievements from "../src/component/Achievements";
import Projects from "../src/component/Projects";
import Skills from "../src/component/Skills";
import Certifications from "../src/component/Certifications";
import Contact from "../src/component/Contact";
import Footer from "../src/component/Footer";

export default function Home() {
  return (
    <>
      <section id="home">
        <Hero />
      </section>
      <section id="education">
        <Education />
      </section>
      <section id="experience">
        <Experience />
      </section>
      <section id="achievements">
        <Achievements />
      </section>
      <section id="projects">
        <Projects />
      </section>
      <section id="skills">
        <Skills />
      </section>
      <section id="certifications">
        <Certifications />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </>
  );
}
