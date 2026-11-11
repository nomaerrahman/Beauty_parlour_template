import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Amenities } from "@/components/sections/Amenities";
import { ConsultationQuiz } from "@/components/sections/ConsultationQuiz";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Lookbook } from "@/components/sections/Lookbook";
import { Specialists } from "@/components/sections/Specialists";
import { Testimonials } from "@/components/sections/Testimonials";
import { TreatmentMenu } from "@/components/sections/TreatmentMenu";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TreatmentMenu />
        <ConsultationQuiz />
        <Specialists />
        <Lookbook />
        <Amenities />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
