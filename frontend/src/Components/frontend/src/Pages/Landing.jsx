// import React, { useState, useEffect } from 'react';
// import { ArrowRight, Heart, Shield, Zap, ChevronDown } from 'lucide-react';

// const LandingPage = ({ onNavigate }) => {
//   const [activeSection, setActiveSection] = useState('hero');

//   const scrollToNext = (id) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const sections = ['hero', 'features', 'cta'];
//       const scrollPosition = window.scrollY + window.innerHeight / 2;

//       for (const section of sections) {
//         const element = document.getElementById(section);
//         if (!element) continue;

//         const rect = element.getBoundingClientRect();
//         const sectionTop = rect.top + window.scrollY;
//         const sectionBottom = sectionTop + rect.height;

//         if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
//           setActiveSection(section);
//           break;
//         }
//       }
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className="snap-y snap-mandatory h-screen overflow-y-auto">
//       {/* Floating Navigation Indicators */}
//       <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4">
//         {['hero', 'features', 'cta'].map((section, index) => (
//           <button
//             key={section}
//             onClick={() => scrollToNext(section)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//               activeSection === section 
//                 ? 'bg-indigo-600 w-4 h-4' 
//                 : 'bg-gray-400 hover:bg-indigo-400'
//             }`}
//             aria-label={`Scroll to ${section} section`}
//           />
//         ))}
//       </div>

//       {/* Down Arrow */}
//       <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 transition-opacity duration-300 ${
//         activeSection === 'cta' ? 'opacity-0' : 'opacity-100'
//       }`}>
//         <button 
//           onClick={() => {
//             const nextSection = {
//               'hero': 'features',
//               'features': 'cta'
//             }[activeSection];
//             if (nextSection) scrollToNext(nextSection);
//           }}
//           className="text-white bg-indigo-600 rounded-full p-2 shadow-lg hover:bg-indigo-700 transition-colors"
//         >
//           <ChevronDown size={24} />
//         </button>
//       </div>

//       {/* Hero Section */}
//       <section id="hero" className="h-screen w-full snap-start relative flex items-center justify-center">
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-800 opacity-90" />
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="flex items-center justify-center mb-6">
//             <Heart className="h-12 w-12 text-white mr-3" />
//             <h1 className="text-4xl md:text-6xl font-bold text-white">
//               Share<span className="text-purple-300">U</span>
//             </h1>
//           </div>
//           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
//             Empowering Communities
//             <span className="block text-purple-300">Through Shared Giving</span>
//           </h2>
//           <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
//             Connect, share, and make a difference. Join our community of givers and create
//             lasting impact through transparent blockchain donations.
//           </p>
//           <div className="flex justify-center space-x-4 mb-16">
//             <button
//               onClick={() => onNavigate('/signup')}
//               className="bg-white text-purple-700 px-8 py-3 rounded-lg font-semibold 
//                 hover:bg-purple-100 transition duration-300 flex items-center"
//             >
//               Get Started
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </button>
//             <button
//               onClick={() => onNavigate('/about')}
//               className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold 
//                 hover:bg-white hover:text-purple-700 transition duration-300"
//             >
//               Learn More
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="h-screen w-full snap-start bg-white flex items-center justify-center relative">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
//               Why Choose Our Platform?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               We combine blockchain technology with traditional charitable giving to create
//               a transparent and efficient donation platform.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             <div className="p-8 bg-gray-50 rounded-xl transform hover:scale-105 transition duration-300">
//               <Shield className="h-16 w-16 text-indigo-600 mb-6" />
//               <h3 className="text-2xl font-semibold mb-4">Secure & Transparent</h3>
//               <p className="text-gray-600 text-lg">
//                 Every transaction is recorded on the blockchain, ensuring complete
//                 transparency and security.
//               </p>
//             </div>

//             <div className="p-8 bg-gray-50 rounded-xl transform hover:scale-105 transition duration-300">
//               <Zap className="h-16 w-16 text-indigo-600 mb-6" />
//               <h3 className="text-2xl font-semibold mb-4">Instant Impact</h3>
//               <p className="text-gray-600 text-lg">
//                 Your donations are transferred instantly, allowing causes to access
//                 funds immediately.
//               </p>
//             </div>

//             <div className="p-8 bg-gray-50 rounded-xl transform hover:scale-105 transition duration-300">
//               <Heart className="h-16 w-16 text-indigo-600 mb-6" />
//               <h3 className="text-2xl font-semibold mb-4">Track Your Impact</h3>
//               <p className="text-gray-600 text-lg">
//                 Follow your donations and see exactly how they're making a difference
//                 in real-time.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section id="cta" className="h-screen w-full snap-start bg-indigo-600 flex items-center justify-center">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
//             Ready to Make a Difference?
//           </h2>
//           <p className="text-xl text-white mb-12 max-w-2xl mx-auto">
//             Join thousands of donors who are already using our platform to make
//             secure and transparent donations.
//           </p>
//           <div className="space-y-4">
//             <button
//               onClick={() => onNavigate('/signup')}
//               className="bg-white text-indigo-600 px-12 py-4 rounded-lg text-xl font-semibold hover:bg-gray-100 transition duration-300"
//             >
//               Start Donating Today
//             </button>
//             <p className="text-white text-lg mt-4">
//               Already have an account?{' '}
//               <button
//                 onClick={() => onNavigate('/login')}
//                 className="underline hover:text-gray-200"
//               >
//                 Sign in
//               </button>
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;