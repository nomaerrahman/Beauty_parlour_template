"use client";

import { motion } from "framer-motion";
import { DoorClosed, GlassWater, Leaf, Sofa } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { cn, unsplash } from "@/lib/utils";

const amenities = [
  {
    title: "Private VIP suites",
    text: "Two soundproofed suites with their own vanity, shower and dimmable lighting. Ideal for bridal parties.",
    icon: DoorClosed,
    image: unsplash("1600334089648-b0d9d3028eb2", 1400),
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    title: "Champagne bar",
    text: "A glass of English sparkling or a house mocktail with every treatment over an hour.",
    icon: GlassWater,
    image: unsplash("1551024709-8f23befc6f87", 900),
    span: "",
  },
  {
    title: "Organic, cruelty-free products",
    text: "Certified vegan colour and skincare from small British and French labs.",
    icon: Leaf,
    image: unsplash("1556228578-8c89e6adf883", 900),
    span: "",
  },
  {
    title: "The relaxation lounge",
    text: "Heated loungers, herbal teas and a phone-free hour before or after your visit.",
    icon: Sofa,
    image: unsplash("1540555700478-4be289fbecef", 1400),
    span: "lg:col-span-2",
  },
];

export function Amenities() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          title="The spa experience"
          intro="A mews house turned sanctuary. Every visit includes the lounge, the bar and as much quiet as you like."
        />
        <div className="grid auto-rows-[280px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {amenities.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={cn("group relative overflow-hidden rounded-petal bg-linen", a.span)}
            >
              <SmartImage
                src={a.image}
                alt=""
                fill
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate/80 via-slate/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-champagne md:p-8">
                <span className="glass-dark mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full">
                  <a.icon className="h-5 w-5 text-gold" />
                </span>
                <h3 className={cn("font-display", i === 0 ? "text-3xl md:text-4xl" : "text-2xl")}>{a.title}</h3>
                <p className="mt-2 max-w-md text-champagne/80">{a.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
