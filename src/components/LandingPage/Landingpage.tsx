'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, X, Check, Menu, Sun, Moon } from "lucide-react";
import PriceCalculator from "@/components/PriceCalculator/PriceCalculator";
import { motion } from "framer-motion";
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';
import { useState, useEffect } from 'react';

const LandingPage = () => {
    const { theme, toggleTheme } = useTheme();

    const scrollToCalculator = () => {
        document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Enhanced Animated background with particles
    const AnimatedBackground = () => {
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
        const particleCount = 50;
        const particles = Array.from({ length: particleCount });

        useEffect(() => {
            const updateDimensions = () => {
                setDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            updateDimensions();
            window.addEventListener('resize', updateDimensions);
            return () => window.removeEventListener('resize', updateDimensions);
        }, []);

        return (
            <div className="fixed inset-0 -z-10 overflow-hidden">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 dark:from-violet-950/40 dark:via-gray-900 dark:to-cyan-950/40 transition-colors duration-500" />

                {/* Depth overlay */}
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-rose-50/30 to-transparent dark:via-rose-900/10" />

                {/* Animated particles */}
                <div className="absolute inset-0">
                    {dimensions.width > 0 && particles.map((_, index) => {
                        const randomX = Math.random() * dimensions.width;
                        const randomY = Math.random() * dimensions.height;

                        return (
                            <motion.div
                                key={index}
                                className="absolute w-1 h-1 bg-indigo-400/30 dark:bg-blue-500/20 rounded-full"
                                animate={{
                                    x: [randomX, Math.random() * dimensions.width],
                                    y: [randomY, Math.random() * dimensions.height],
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 20,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        );
                    })}
                </div>

                {/* Grid overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(79, 70, 229, 0.03) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Animated gradient overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-blue-100/10 via-purple-100/10 to-pink-100/10 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10"
                />

                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-100/50 to-transparent dark:via-indigo-900/20" />
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col relative bg-white dark:bg-gray-900 transition-colors duration-500">
            <AnimatedBackground />

            {/* Navigation */}
            <nav className="border-b border-indigo-50 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-12 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">LLM</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Calculator
                            </span>
                        </motion.div>

                        <div className="hidden md:flex items-center gap-6">
                            <Button variant="ghost" size="icon"
                                className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                                onClick={toggleTheme}
                            >
                                {theme === 'light' ?
                                    <Moon className="w-5 h-5" /> :
                                    <Sun className="w-5 h-5" />
                                }
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                                <Github className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                                <X className="w-5 h-5" />
                            </Button>
                            <Button
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                                onClick={scrollToCalculator}
                            >
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
            <section className="relative overflow-hidden min-h-[80vh] flex items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32"
                >
                    <div className="text-center space-y-8">
                        <motion.div
                            className="flex justify-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-purple-100 dark:border-purple-900 rounded-full px-6 py-2 text-sm text-gray-600 dark:text-gray-300 shadow-sm">
                                ✨ Now supporting major AI providers
                            </div>
                        </motion.div>

                        <motion.h1
                            className="text-6xl md:text-7xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Smart Token Calculator
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                for Modern AI
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            The most accurate way to estimate costs across all major AI providers.
                            Real-time calculations, detailed analytics, and more.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            <Button
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                                onClick={scrollToCalculator}
                            >
                                Try Calculator <ArrowRight className="w-4 h-4" />
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-indigo-50 dark:border-gray-800 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md relative transition-colors duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "7+", label: "AI Providers" },
                            { value: "50+", label: "Models Supported" },
                            { value: "99.9%", label: "Accuracy" },
                            { value: "24/7", label: "Real-time Updates" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calculator Section */}
            <section id="calculator-section" className="py-24 relative">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Start Calculating
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Get instant token counts and cost estimates for your AI projects
                        </p>
                    </div>
                    <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100/50 dark:border-gray-800 p-8 transition-colors duration-500">
                        <PriceCalculator />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-24">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Everything You Need
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                                className="p-8 rounded-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-indigo-100/50 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all"
                            >
                                <h3 className="text-xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                                <ul className="space-y-3">
                                    {feature.features.map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
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
            <footer className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t dark:border-gray-800 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">LLM</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Calculator
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                The most accurate token calculator for modern AI models
                            </p>
                            <div className="flex gap-4">
                                <Button variant="ghost" size="icon" className="hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors">
                                    <Github className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        {[
                            {
                                title: "Product",
                                links: ["Features", "Pricing", "Documentation", "API"]
                            },
                            {
                                title: "Resources",
                                links: ["Blog", "Tutorials", "Support", "Contact"]
                            },
                            {
                                title: "Company",
                                links: ["About", "Careers", "Privacy", "Terms"]
                            }
                        ].map((section, index) => (
                            <div key={index}>
                                <h3 className="font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                                    {section.links.map((link, i) => (
                                        <li key={i} className="hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer transition-colors">
                                            {link}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t dark:border-gray-700 mt-12 pt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            © 2025 LLM Calculator. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
