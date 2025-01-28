import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Copy, Clock, Save, Share, Zap, Database, History, ChevronRight, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';

type Provider = 'openai' | 'anthropic' | 'google' | 'meta' | 'cohere' | 'mistral' | 'stability';

const providers: Record<Provider, string[]> = {
    openai: ["gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-4", "gpt-4-32k", "gpt-4-turbo", "dall-e-3"],
    anthropic: ["claude-3-haiku", "claude-3-sonnet", "claude-3-opus"],
    google: ["gemini-1.5-pro", "palm-3", "palm-3-xl"],
    meta: ["llama-2-70b", "llama-2-70b-chat", "llama-3-70b"],
    cohere: ["command", "command-light", "command-pro"],
    mistral: ["mistral-small", "mistral-medium", "mistral-large"],
    stability: ["stable-diffusion-xl", "stable-diffusion-xl-turbo"]
};

// Define a type for the history entry
type HistoryEntry = {
    name: string;
    tokens: number;
    cost: number;
    model: string;
    provider: Provider;
};

const TokenVisualizer = ({ tokens }: { tokens: string[] }) => {
    const { theme } = useTheme();

    return (
        <motion.div
            className="space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <h3 className="text-sm font-medium gradient-text gradient-text-primary">Token Visualization</h3>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Badge variant="secondary" className="text-xs font-mono bg-purple-100 dark:bg-purple-900/30">
                        {tokens.length} tokens
                    </Badge>
                </motion.div>
            </div>
            <motion.div
                className="flex flex-wrap gap-1.5 p-4 glass-light dark:glass-dark rounded-xl max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20"
            >
                {tokens.map((token, index) => (
                    <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: index * 0.01,
                            type: "spring",
                            stiffness: 200,
                            damping: 10
                        }}
                        key={index}
                        className="px-2 py-1 rounded-md text-xs font-mono shadow-sm hover:scale-110 transition-all cursor-default group relative"
                        style={{
                            backgroundColor: `hsl(${(index * 40) % 360}, 70%, ${theme === 'dark' ? '30%' : '85%'})`,
                            color: `hsl(${(index * 40) % 360}, 70%, ${theme === 'dark' ? '90%' : '25%'})`
                        }}
                    >
                        {token}
                        <motion.span
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                            whileHover={{ scale: 1.1 }}
                        >
                            Token #{index + 1}
                        </motion.span>
                    </motion.span>
                ))}
            </motion.div>
        </motion.div>
    );
};

const MetricCard = ({ label, value, prefix = "", isCalculating, icon: Icon }: {
    label: string;
    value: string | number;
    prefix?: string;
    isCalculating: boolean;
    icon?: React.ElementType;
}) => {
    return (
        <motion.div
            className="flex flex-col p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon className="w-4 h-4 text-purple-500 dark:text-purple-400" />}
                <p className="text-sm font-medium gradient-text gradient-text-primary">{label}</p>
            </div>
            <motion.p
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold gradient-text gradient-text-primary font-mono"
            >
                {isCalculating ? (
                    <span className="animate-pulse">Calculating...</span>
                ) : (
                    typeof value === 'number' ?
                        `${prefix}${value.toFixed(7)}` :
                        `${prefix}${value}`
                )}
            </motion.p>
        </motion.div>
    );
};

const UsageChart = ({ data }: { data: { name: string; tokens: number }[] }) => {
    const { theme } = useTheme();

    return (
        <div className="h-[300px] w-full p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-800">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                        dataKey="name"
                        stroke={theme === 'dark' ? '#94a3b8' : '#475569'}
                    />
                    <YAxis
                        stroke={theme === 'dark' ? '#94a3b8' : '#475569'}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                            color: theme === 'dark' ? '#ffffff' : '#000000',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="tokens"
                        stroke={theme === 'dark' ? '#8b5cf6' : '#6366f1'}
                        strokeWidth={2}
                        dot={{ fill: theme === 'dark' ? '#8b5cf6' : '#6366f1', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: theme === 'dark' ? '#8b5cf6' : '#6366f1' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const HistoryCard = ({ entry }: { entry: HistoryEntry }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
    >
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <History className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="font-medium gradient-text gradient-text-primary">{entry.provider} - {entry.model}</p>
                    <p className="text-sm text-muted-foreground">{entry.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-mono text-sm gradient-text gradient-text-secondary">
                    {entry.tokens.toLocaleString()} tokens
                </p>
                <p className="text-sm font-medium gradient-text gradient-text-primary">${entry.cost.toFixed(7)}</p>
            </div>
        </div>
    </motion.div>
);

const LivePriceCalculator = () => {
    // const { theme } = useTheme();
    const [provider, setProvider] = useState<Provider>("openai");
    const [model, setModel] = useState(providers.openai[0]);
    const [text, setText] = useState("");
    const [tokens, setTokens] = useState(0);
    const [tokenized, setTokenized] = useState<string[]>([]);
    const [cost, setCost] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [currentTab, setCurrentTab] = useState("input");

    useEffect(() => {
        const calculateTokens = async () => {
            if (!text.trim()) {
                setTokens(0);
                setTokenized([]);
                setCost(0);
                return;
            }

            setIsCalculating(true);
            try {
                // Simulate API calls
                await new Promise(resolve => setTimeout(resolve, 300));
                const tokenCount = Math.ceil(text.length / 4);
                const tokenizedText = text.split(' ').map(word => word.toLowerCase());

                setTokens(tokenCount);
                setTokenized(tokenizedText);
                setCost(tokenCount * 0.000001);
            } catch (error) {
                console.error(error);
            }
            setIsCalculating(false);
        };

        const debouncer = setTimeout(calculateTokens, 300);
        return () => clearTimeout(debouncer);
    }, [text, model, provider]);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const saveToHistory = () => {
        const newEntry = {
            name: new Date().toLocaleTimeString(),
            tokens,
            cost,
            model,
            provider
        };
        setHistory(prev => [newEntry, ...prev]);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Card className="shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-100 dark:border-gray-800">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <CardHeader className="border-b border-theme py-6">
                        <div className="flex items-center justify-between">
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ scale: 1.02 }}
                            >
                                <motion.div
                                    animate={{
                                        rotate: [0, 15, -15, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="bg-gradient-to-br from-blue-500 to-purple-500 p-2 rounded-xl"
                                >
                                    <Sparkles className="w-7 h-7 text-white" />
                                </motion.div>
                                <CardTitle className="text-3xl font-bold gradient-text gradient-text-primary animate-gradient">
                                    Smart Token Calculator
                                </CardTitle>
                            </motion.div>

                            <div className="flex items-center gap-4">
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Badge variant="secondary" className="gap-2 bg-purple-100 dark:bg-purple-900/30">
                                        <Zap className="w-4 h-4" />
                                        Live Updates
                                    </Badge>
                                </motion.div>
                                <AnimatePresence>
                                    {isCalculating && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <Badge variant="outline" className="animate-pulse">
                                                Processing...
                                            </Badge>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-6">
                        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6 bg-purple-100/50 dark:bg-purple-900/20">
                                <TabsTrigger value="input" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                    <Database className="w-4 h-4" />
                                    Input
                                </TabsTrigger>
                                <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                    <ChevronRight className="w-4 h-4" />
                                    Analytics
                                </TabsTrigger>
                                <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                                    <History className="w-4 h-4" />
                                    History
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="input" className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Select
                                        onValueChange={(value: Provider) => {
                                            setProvider(value);
                                            setModel(providers[value][0]);
                                        }}
                                        value={provider}
                                    >
                                        <SelectTrigger className="w-full capitalize">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                                {provider}
                                            </span>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(Object.keys(providers) as Provider[]).map((prov) => (
                                                <SelectItem key={prov} value={prov} className="capitalize">
                                                    {prov}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select onValueChange={setModel} value={model}>
                                        <SelectTrigger className="w-full">
                                            {model}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {providers[provider].map((mdl) => (
                                                <SelectItem key={mdl} value={mdl}>
                                                    {mdl}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="relative">
                                    <Textarea
                                        placeholder="Start typing to calculate tokens and cost..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="min-h-[200px] font-mono text-sm resize-none bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 opacity-50 hover:opacity-100"
                                        onClick={handleCopy}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {showCopied && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                        >
                                            <Alert>
                                                <AlertCircle className="w-4 h-4" />
                                                <AlertDescription>Copied to clipboard!</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {tokenized.length > 0 && (
                                    <TokenVisualizer tokens={tokenized} />
                                )}

                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={saveToHistory}
                                        className="gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        <Share className="w-4 h-4" />
                                        Share
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="analytics" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <MetricCard
                                        label="Total Tokens"
                                        value={tokens.toLocaleString()}
                                        isCalculating={isCalculating}
                                        icon={Sparkles}
                                    />
                                    <MetricCard
                                        label="Total Cost"
                                        value={cost}
                                        prefix="$"
                                        isCalculating={isCalculating}
                                        icon={Clock}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Usage Trends</h3>
                                    <UsageChart data={history} />
                                </div>
                            </TabsContent>

                            <TabsContent value="history" className="space-y-4">
                                {history.length === 0 ? (
                                    <div className="text-center py-8">
                                        <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-gray-500">No history yet. Save some calculations to see them here.</p>
                                    </div>
                                ) : (
                                    <motion.div className="space-y-4">
                                        {history.map((entry, index) => (
                                            <HistoryCard key={index} entry={entry} />
                                        ))}
                                    </motion.div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t border-theme p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            <MetricCard
                                label="Current Tokens"
                                value={tokens.toLocaleString()}
                                isCalculating={isCalculating}
                                icon={Sparkles}
                            />
                            <MetricCard
                                label="Estimated Cost"
                                value={cost}
                                prefix="$"
                                isCalculating={isCalculating}
                                icon={Clock}
                            />
                        </div>
                    </CardFooter>
                </motion.div>
            </Card>
        </div>
    );
};

export default LivePriceCalculator;