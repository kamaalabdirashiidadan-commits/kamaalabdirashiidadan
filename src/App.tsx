/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Info, 
  ClipboardList, 
  Phone, 
  MapPin, 
  Users, 
  CheckCircle2, 
  ChevronRight,
  Menu,
  X,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreErrors';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    tripleName: '',
    fullName: '',
    phone: '',
    category: 'Barakicin',
    tribe: '',
    complaint: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const complaintsCol = collection(db, 'complaints');
      await addDoc(complaintsCol, {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setFormSubmitted(true);
      setFormData({
        tripleName: '',
        fullName: '',
        phone: '',
        category: 'Barakicin',
        tribe: '',
        complaint: ''
      });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'complaints');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const navLinks = [
    { name: 'Bogga Hore', href: '#home', icon: Home },
    { name: 'Ku Saabsan', href: '#about', icon: Info },
    { name: 'Diiwaangelin', href: '#register', icon: ClipboardList },
    { name: 'Xiriir', href: '#contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Himilo Qaran</h1>
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Cadaaladda Bulshada</p>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Diiwaangeli Hadda
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-slate-600 font-medium p-2 hover:bg-slate-50 rounded-lg"
                  >
                    <link.icon size={18} />
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section id="home" className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 tracking-wide uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                U Reeb Dhaxalkaaga Cadaalad
              </span>
              <h2 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                Ku Soo Dhawoow <span className="text-blue-600">Himilo Qaran</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                Website-kan waxaa loogu talagalay uruurinta xogta dadka sheeganaya
                in dhulkooda si sharci darro ah looga qaatay, si codkooda loo maqlo lana helo xaqooda.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#register"
                  className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 group"
                >
                  Diiwaangeli Hadda
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-10 py-5 rounded-2xl font-bold transition-all"
                >
                  Wax Badan Baro
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
              
              <div className="relative bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100">
                <h3 className="text-2xl font-bold mb-8 text-slate-900 flex items-center gap-3">
                  <CheckCircle2 className="text-blue-600" />
                  Tirakoobka Cabashada
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center">
                    <Users className="text-blue-600 mb-4 w-10 h-10" />
                    <span className="text-4xl font-black text-slate-900">500+</span>
                    <p className="text-slate-500 font-medium mt-2">Dhibanayaal</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col items-center text-center">
                    <MapPin className="text-blue-600 mb-4 w-10 h-10" />
                    <span className="text-4xl font-black text-slate-900">120+</span>
                    <p className="text-slate-500 font-medium mt-2">Goobo La Hubiyey</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-sm text-yellow-800 font-medium text-center">
                    Xogtaada waa mid ammaan ah oo qarsoodi ah.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="register" className="py-20 bg-slate-900 relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                  Foomka Diiwaangelinta
                </h2>
                <p className="text-slate-500 text-lg max-w-xl mx-auto">
                  Fadlan buuxi xogtaada saxda ah si loo diiwaangeliyo cabashadaada.
                </p>
              </div>

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
                    <CheckCircle2 className="text-white w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Waa Lagu Diiwaangeliyey!</h3>
                  <p className="text-green-700">Mahadsanid. Cabashadaada waa ay nasoo gaartay, waana lagula soo xiriiri doonaa dhowaan.</p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className="mt-8 text-green-700 font-bold hover:underline"
                  >
                    Diiwaangeli cabasho kale
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Magaca Saddexan</label>
                      <input
                        type="text"
                        name="tripleName"
                        required
                        value={formData.tripleName}
                        onChange={handleChange}
                        placeholder="Tusaale: Maxamed Cali Axmed"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Magaca Buuxa (Haddii uu jiro mid kale)</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Magacyo kale"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Number-ka Taleefanka</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="61xxxxxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Qeybta Cabashada</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all appearance-none"
                      >
                        <option>Barakicin</option>
                        <option>Cadaalad Daro</option>
                        <option>Shaqo Laga Dhacay</option>
                        <option>Dhul Dhaxal ah</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Qabiilka (Ikhtiyaari)</label>
                    <input
                      type="text"
                      name="tribe"
                      value={formData.tribe}
                      onChange={handleChange}
                      placeholder="Qabiilka qofka dhiban"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Faahfaahinta Cabashada</label>
                    <textarea
                      name="complaint"
                      required
                      value={formData.complaint}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Fadlan si kooban u sharax dhibaatada dhacday..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Sawir Ama Dukumenti (Haddii uu jiro)</label>
                    <div className="relative group">
                      <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
                        <FileText className="mb-2 w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium text-sm">Guji ama soo jiid faylka halkan</span>
                        <span className="text-xs mt-1 text-slate-400">PDF, JPG, PNG (Max 10MB)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-200 transform hover:scale-[1.01] active:scale-95"
                  >
                    Diiwaangeli Cabashada
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                  Ujeedada <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">Himilo Qaran</span>
                </h2>
                <div className="space-y-6">
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Ujeedka website-kan waa in la uruuriyo xogta dadka dhibanayaasha ah,
                    lana abuuro meel codkooda lagu maqlo. Waxaan aaminsanahay in qof walba xaq u leeyahay inuu hantidiisa si nabad ah ku heysto.
                  </p>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Waxaan uruurineynaa cabashooyinka si aan u gudbinno hay'adaha ay khuseyso, ugana bixino tallooyin dhanka sharciga iyo cadaaladda ah.
                  </p>
                </div>
                
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Xaqiijinta Xogta",
                    "Tallo Sharci",
                    "Gudbinta Cabashada",
                    "Maaraynta Khilaafaadka"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-blue-600 w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative"
              >
                <img 
                   src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2670&auto=format&fit=crop" 
                   alt="Justice Scales" 
                   className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover aspect-square"
                />
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] z-0" />
                <div className="absolute inset-0 border-2 border-blue-600/10 rounded-[3rem] -translate-x-6 translate-y-6 -z-10" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-16 border-b border-slate-800 pb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-sans">Himilo Qaran</h3>
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Waxaan u taaganahay inaan kaalmo u fidinno muwaadin walba oo xaqiisa laga qaatay.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-blue-500 font-sans">Links</h4>
            <div className="flex flex-col gap-4">
              {navLinks.map(link => (
                <a key={link.name} href={link.href} className="text-slate-400 hover:text-white transition-colors font-sans">
                  {link.name}
                </a>
              ))}
              <a href="/admin" className="text-slate-600 hover:text-white transition-colors text-xs font-sans">Admin Login</a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-blue-500 font-sans">Fariin Bulshada</h4>
            <p className="text-slate-400 italic font-sans">
              "Haddii aad taqaan qof dhibane ah, inooga reeb fariintiisa ama diiwaangeli. Wadajir ayaan cadaalad ku heli karnaa."
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-10 text-center">
          <p className="text-slate-500 text-sm font-sans">
            © {new Date().getFullYear()} Himilo Qaran. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
