import { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Header from './components/site/Header';
import Hero from './components/site/Hero';
import TrustBar from './components/site/TrustBar';
import Features from './components/site/Features';
import Packages from './components/site/Packages';
import Mentors from './components/site/Mentors';
import SuccessStories from './components/site/SuccessStories';
import Testimonials from './components/site/Testimonials';
import CTAContact from './components/site/CTAContact';
import FAQ from './components/site/FAQ';
import Footer from './components/site/Footer';
import SideCallButton from './components/site/SideCallButton';

const Home = () => {
  useEffect(() => {
    document.title = 'Koçum Sınav | Kişiye Özel YKS & LGS Koçluğu';
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white antialiased">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Features />
        <Packages />
        <Mentors />
        <SuccessStories />
        <Testimonials />
        <CTAContact />
        <FAQ />
      </main>
      <Footer />
      <SideCallButton />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
