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
      <Hero />
      <Education />
      <Experience />
      <Achievements />
      <Projects />
      <Skills />
      <Certifications />
      <Contact />
      <Footer />
    </>
  );
}
