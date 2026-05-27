import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Project } from './components/Project';
import { Goals } from './components/Goals';
import { Gallery } from './components/Gallery';
import { Join } from './components/Join';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background font-sans scroll-smooth">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Project />
        <Goals />
        <Gallery />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
