import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, X, Check, Menu } from "lucide-react";
import PriceCalculator from "@/components/PriceCalculator/PriceCalculator";
import { motion } from "framer-motion";

const LandingPage = () => {
    const scrollToCalculator = () => {
        document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-11 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-bold">LLM</span>
                            </div>
                            <span className="text-xl font-bold">LLM Calculator</span>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-4">
                            <Button variant="ghost" size="icon">
                                <Github className="w-5 h-5" href='https://github.com/Bhavik-Jikadara' />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <X className="w-5 h-5" href='https://x.com/BhavikJikadara1' />
                            </Button>
                            <Button className="gap-2" onClick={scrollToCalculator}>
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
                >
                    <div className="text-center space-y-8">
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-white/30 backdrop-blur-sm border rounded-full px-4 py-1 text-sm text-gray-600"
                            >
                                ✨ New: Support for all models
                            </motion.div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Smart Token Calculator for Modern AI
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The most accurate way to estimate costs across all major AI providers.
                            Real-time calculations, detailed analytics, and more.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button size="lg" className="gap-2" onClick={scrollToCalculator}>
                                Try Calculator <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="border-y bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">7+</div>
                            <div className="text-sm text-gray-600">AI Providers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">50+</div>
                            <div className="text-sm text-gray-600">Models Supported</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">99.9%</div>
                            <div className="text-sm text-gray-600">Accuracy</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-600">Real-time Updates</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section id="calculator-section" className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Start Calculating</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Get instant token counts and cost estimates for your AI projects
                        </p>
                    </div>
                    <PriceCalculator />
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gradient-to-br from-gray-50 to-white py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive tools for AI cost management
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Real-time Updates",
                                description: "Instant token counting and cost calculation as you type with sub-second latency",
                                features: ["Live tokenization", "Instant cost estimates", "Multiple models"]
                            },
                            {
                                title: "Provider Coverage",
                                description: "Support for all major AI providers including latest model updates",
                                features: ["OpenAI GPT-4", "Claude 3", "PaLM & Gemini"]
                            },
                            {
                                title: "Advanced Analytics",
                                description: "Track usage patterns and optimize costs across your projects",
                                features: ["Usage trends", "Cost breakdowns", "Export data"]
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all"
                            >
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-green-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-11 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white font-bold">LLM</span>
                                </div>
                                <span className="text-xl font-bold">LLM Calculator</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                The most accurate token calculator for modern AI models
                            </p>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon">
                                    <Github className="w-5 h-5"/>
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <X className="w-5 h-5" href='https://x.com/BhavikJikadara1' />
                                </Button>
                            </div>
                        </div>
                        {[
                            {
                                title: "Product",
                                links: ["Features", "Pricing", "Documentation", "API"]
                            }
                        ].map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold mb-4">{section.title}</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    {section.links.map((link, i) => (
                                        <li key={i} className="hover:text-gray-900 cursor-pointer">
                                            {link}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-12 pt-8 text-center text-sm text-gray-600">
                        © 2024 LLM Calculator. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;