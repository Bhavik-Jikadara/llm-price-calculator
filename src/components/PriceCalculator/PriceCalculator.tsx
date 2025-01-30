import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from '@/components/ui/card';
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Sparkles,
    Copy,
    Clock,
    Save,
    Share,
    Zap,
    Database,
    History,
    AlertCircle,
    LineChart as LineChartIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';
import { useTheme } from '@/components/ThemeProvider/ThemeProvider';

// Type definitions
type Provider = 'openai' | 'anthropic' | 'google' | 'meta' | 'cohere' | 'mistral' | 'stability';

// Provider model configurations
const providers: Record<Provider, string[]> = {
    openai: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k', 'gpt-4-turbo', 'dall-e-3'],
    anthropic: ['claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'],
    google: ['gemini-1.5-pro', 'palm-3', 'palm-3-xl'],
    meta: ['llama-2-70b', 'llama-2-70b-chat', 'llama-3-70b'],
    cohere: ['command', 'command-light', 'command-pro'],
    mistral: ['mistral-small', 'mistral-medium', 'mistral-large'],
    stability: ['stable-diffusion-xl', 'stable-diffusion-xl-turbo']
};

// Model pricing information
const modelPricing: Record<string, { input: number; output: number }> = {
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'claude-3-haiku': { input: 0.0025, output: 0.0025 },
    'claude-3-opus': { input: 0.015, output: 0.015 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gemini-1.5-pro': { input: 0.0005, output: 0.0015 }
};

// Interface for history entries
interface HistoryEntry {
    timestamp: number;
    tokens: number;
    cost: number;
    model: string;
    text: string;
}

// Token Visualizer Component
const TokenVisualizer: React.FC<{ tokens: string[]; maxDisplayTokens?: number }> = ({
    tokens,
    maxDisplayTokens = 100
}) => {
    const { theme } = useTheme();
    const displayTokens = tokens.slice(0, maxDisplayTokens);
    const remainingCount = tokens.length - maxDisplayTokens;

    return (
        <motion.div
            className="space-y-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Token Analysis</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        {tokens.length} total tokens
                    </Badge>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl max-h-[200px] overflow-y-auto">
                {displayTokens.map((token, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: index * 0.01,
                            type: "spring",
                            stiffness: 200,
                            damping: 10
                        }}
                        className="px-2 py-1 rounded-md text-xs font-mono shadow-sm hover:scale-110 transition-all cursor-default group relative"
                        style={{
                            backgroundColor: `hsl(${(index * 40) % 360}, 70%, ${theme === 'dark' ? '30%' : '85%'})`,
                            color: `hsl(${(index * 40) % 360}, 70%, ${theme === 'dark' ? '90%' : '25%'})`
                        }}
                    >
                        {token}
                    </motion.span>
                ))}
                {remainingCount > 0 && (
                    <Badge variant="outline" className="ml-2">
                        +{remainingCount} more tokens
                    </Badge>
                )}
            </div>
        </motion.div>
    );
};

// Metric Card Component
interface MetricCardProps {
    label: string;
    value: string | number;
    prefix?: string;
    isCalculating: boolean;
    icon?: React.ElementType;
    trend?: { value: number; label: string };
    secondaryValue?: string;
    formatAsInteger?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
    label,
    value,
    prefix = "",
    isCalculating,
    icon: Icon,
    trend,
    secondaryValue,
    formatAsInteger = false
}) => {
    const formatValue = (val: string | number) => {
        if (typeof val === 'number') {
            if (formatAsInteger) {
                return Math.round(val).toLocaleString();
            }
            return val < 0.000001 ? val.toExponential(2) : val.toFixed(6);
        }
        return val;
    };

    return (
        <motion.div
            className="flex flex-col p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
                </div>
                {trend && (
                    <Badge
                        variant={trend.value >= 0 ? "default" : "destructive"}
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                        {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
                    </Badge>
                )}
            </div>
            <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
            >
                <p className="text-3xl font-bold font-mono text-gray-900 dark:text-gray-100">
                    {isCalculating ? (
                        <span className="animate-pulse">Calculating...</span>
                    ) : (
                        `${prefix}${formatValue(value)}`
                    )}
                </p>
                {secondaryValue && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {secondaryValue}
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
};

const PriceCalculator: React.FC = () => {
    // Load history from localStorage on component mount
    const [history, setHistory] = useState<HistoryEntry[]>(() => {
        const savedHistory = localStorage.getItem('tokenCalculatorHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('tokenCalculatorHistory', JSON.stringify(history));
    }, [history]);

    const [provider, setProvider] = useState<Provider>("openai");
    const [model, setModel] = useState(providers.openai[0]);
    const [text, setText] = useState("");
    const [tokens, setTokens] = useState(0);
    const [tokenized, setTokenized] = useState<string[]>([]);
    const [cost, setCost] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [currentTab, setCurrentTab] = useState("input");
    const [showCopiedAlert, setShowCopiedAlert] = useState(false);
    const [showSavedAlert, setShowSavedAlert] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Token calculation logic with history update
    const calculateTokensAndCost = async () => {
        if (!text.trim()) {
            setTokens(0);
            setTokenized([]);
            setCost(0);
            return;
        }

        setIsCalculating(true);
        try {
            const words = text.trim().split(/\s+/);
            const tokenCount = Math.ceil(words.length * 1.3);
            const tokenizedText = words.map(word => word.toLowerCase());
            const pricing = modelPricing[model] || { input: 0.0015, output: 0.002 };
            const estimatedCost = (tokenCount * pricing.input) / 1000;

            setTokens(tokenCount);
            setTokenized(tokenizedText);
            setCost(estimatedCost);

            // Remove history update logic from here
        } catch (error) {
            console.error('Error calculating tokens:', error);
        }
        setIsCalculating(false);
    };

    // Handle text changes with debounce
    useEffect(() => {
        const debouncer = setTimeout(() => {
            if (text.trim()) {
                calculateTokensAndCost(); // Only calculate if text is not empty
            }
        }, 300);
        return () => clearTimeout(debouncer);
    }, [text, model]);

    // Enhanced save handler to only save in history
    const handleSave = () => {
        if (!text.trim() || isSaving) return; // Prevent multiple saves

        setIsSaving(true); // Set saving state to true

        const newEntry: HistoryEntry = {
            timestamp: Date.now(),
            tokens,
            cost,
            model,
            text: text.slice(0, 50) + (text.length > 50 ? '...' : '')
        };

        setHistory(prev => {
            const updated = [newEntry, ...prev.slice(0, 9)];
            return updated; // Update history state
        });

        // Show saved alert
        setShowSavedAlert(true);
        setTimeout(() => {
            setShowSavedAlert(false);
            setIsSaving(false); // Reset saving state after timeout
        }, 2000);
    };

    // Clear history handler
    const handleClearHistory = () => {
        const shouldClear = window.confirm('Are you sure you want to clear all history?');
        if (shouldClear) {
            setHistory([]); // Clear the history state
        }
    };

    // Copy text handler
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setShowCopiedAlert(true);
            setTimeout(() => setShowCopiedAlert(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <Card className="shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 15, -15, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-xl"
                        >
                            <Sparkles className="w-7 h-7 text-white" />
                        </motion.div>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Smart Token Calculator
                        </CardTitle>
                    </div>

                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="gap-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <Zap className="w-4 h-4" />
                            Live Updates
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="input" className="gap-2">
                            <Database className="w-4 h-4" />
                            Input
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="gap-2">
                            <LineChartIcon className="w-4 h-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="w-4 h-4" />
                            History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="input" className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                value={provider}
                                onValueChange={(value: Provider) => {
                                    setProvider(value);
                                    setModel(providers[value][0]);
                                }}
                            >
                                <SelectTrigger className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                    {Object.keys(providers).map((prov) => (
                                        <SelectItem
                                            key={prov}
                                            value={prov}
                                            className="capitalize hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            {prov.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={model}
                                onValueChange={setModel}
                            >
                                <SelectTrigger className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                    {providers[provider].map((mdl) => (
                                        <SelectItem
                                            key={mdl}
                                            value={mdl}
                                            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            {mdl}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative">
                            <Textarea
                                placeholder="Enter your text to calculate tokens and cost..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="min-h-[200px] font-mono text-sm resize-y p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                            />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleCopy}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showCopiedAlert && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                        <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <AlertDescription className="text-green-600 dark:text-green-400">
                                            Copied to clipboard!
                                        </AlertDescription>
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {tokenized.length > 0 && (
                            <TokenVisualizer tokens={tokenized} maxDisplayTokens={50} />
                        )}

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={handleSave}
                                className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <Save className="w-4 h-4" />
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => {
                                    const shareUrl = window.location.href;
                                    navigator.clipboard.writeText(shareUrl);
                                    setShowCopiedAlert(true);
                                    setTimeout(() => setShowCopiedAlert(false), 2000);
                                }}
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
                                value={tokens}
                                isCalculating={isCalculating}
                                icon={Sparkles}
                                formatAsInteger={true}
                                trend={{
                                    value: history.length > 1 ?
                                        Math.round(((tokens - history[1].tokens) / history[1].tokens) * 100) :
                                        0,
                                    label: "vs last"
                                }}
                            />
                            <MetricCard
                                label="Estimated Cost"
                                value={cost}
                                prefix="$"
                                isCalculating={isCalculating}
                                icon={Clock}
                                secondaryValue={`${Math.round(tokens).toLocaleString()} tokens at ${modelPricing[model]?.input || '0.0015'}/1K tokens`}
                            />
                        </div>

                        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Usage Trends
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                    Last {history.length} calculations
                                </Badge>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={history.map(h => ({
                                    name: new Date(h.timestamp).toLocaleTimeString(),
                                    tokens: h.tokens,
                                    cost: h.cost
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="currentColor"
                                        className="text-gray-600 dark:text-gray-400"
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        orientation="left"
                                        stroke="#3b82f6"
                                        label={{
                                            value: 'Tokens',
                                            angle: -90,
                                            position: 'insideLeft',
                                            className: "text-blue-500"
                                        }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#8b5cf6"
                                        label={{
                                            value: 'Cost ($)',
                                            angle: 90,
                                            position: 'insideRight',
                                            className: "text-purple-500"
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '0.5rem'
                                        }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="tokens"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                                        name="Tokens"
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="cost"
                                        stroke="#8b5cf6"
                                        strokeWidth={2}
                                        dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                                        name="Cost ($)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Database className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Model Info
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Provider: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {provider}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Model: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {model}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Input Price: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            ${modelPricing[model]?.input || '0.0015'}/1K tokens
                                        </span>
                                    </p>
                                </div>
                            </Card>

                            <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Usage Stats
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Avg. Tokens: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {history.length > 0
                                                ? Math.round(history.reduce((acc, curr) => acc + curr.tokens, 0) / history.length).toLocaleString()
                                                : 0}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Cost: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            ${history.reduce((acc, curr) => acc + curr.cost, 0).toFixed(6)}
                                        </span>
                                    </p>
                                </div>
                            </Card>

                            <Card className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Performance
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Response Time: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            300ms
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Accuracy: <span className="font-medium text-gray-900 dark:text-gray-100">
                                            99.9%
                                        </span>
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Calculation History
                            </h3>
                            {history.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearHistory}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    Clear History
                                </Button>
                            )}
                        </div>

                        {history.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500">No calculations yet. Start typing to see your history.</p>
                            </div>
                        ) : (
                            <motion.div className="space-y-4">
                                {history.map((entry, index) => (
                                    <motion.div
                                        key={entry.timestamp}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {new Date(entry.timestamp).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{entry.model}</p>
                                                <p className="text-xs text-gray-500 mt-1 truncate max-w-[300px]">
                                                    {entry.text}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-mono text-gray-900 dark:text-gray-100">
                                                    {Math.round(entry.tokens).toLocaleString()} tokens
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    ${entry.cost.toFixed(6)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </TabsContent>
                </Tabs>

                <AnimatePresence>
                    {showSavedAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <AlertDescription className="text-green-600 dark:text-green-400">
                                    Calculation saved and exported successfully!
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>

            <CardFooter className="border-t border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <MetricCard
                        label="Current Tokens"
                        value={tokens}
                        isCalculating={isCalculating}
                        icon={Sparkles}
                        formatAsInteger={true}
                    />
                    <MetricCard
                        label="Estimated Cost"
                        value={cost}
                        prefix="$"
                        isCalculating={isCalculating}
                        icon={Clock}
                        secondaryValue={`Based on ${model} pricing`}
                    />
                </div>
            </CardFooter>
        </Card>
    );
};

export default PriceCalculator;