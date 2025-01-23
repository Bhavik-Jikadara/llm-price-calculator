import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Copy, Clock, Save, Share } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Provider = 'openai' | 'anthropic' | 'google' | 'meta' | 'cohere' | 'mistral' | 'stability';

const providers: Record<Provider, string[]> = {
    openai: ["gpt-3.5-turbo", "gpt-3.5-turbo-16k", "gpt-4", "gpt-4-32k", "gpt-4-turbo", "dall-e-3", "whisper-1", "whisper-1-large"],
    anthropic: ["claude-1", "claude-2", "claude-3-haiku", "claude-3-sonnet", "claude-3-opus", "claude-instant-1", "claude-2-xl", "claude-2-xxl"],
    google: ["gemini-1", "gemini-1-pro", "gemini-1.5-pro", "palm-2", "palm-3", "palm-3-xl"],
    meta: ["llama-2-7b", "llama-2-13b", "llama-2-70b", "llama-2-70b-chat", "llama-3-33b", "llama-3-65b"],
    cohere: ["command-light", "command", "command-nightly", "command-light-nightly", "command-pro", "command-pro-nightly"],
    mistral: ["mistral-tiny", "mistral-small", "mistral-medium", "mistral-large", "mistral-xl", "mistral-xxl"],
    stability: ["stable-diffusion-xl", "stable-diffusion-xl-turbo", "stable-diffusion-2", "stable-diffusion-2-turbo"]
};

interface TokenVisualizerProps {
    tokens: string[];
    isCalculating: boolean;
}

interface MetricDisplayProps {
    label: string;
    value: string | number;
    prefix?: string;
    isCalculating: boolean;
    icon?: React.ElementType;
}

interface HistoryEntry {
    name: string;
    tokens: number;
    cost: number;
    model: string;
    provider: Provider;
}

interface HistoryCardProps {
    entry: HistoryEntry;
}

interface UsageChartProps {
    data: HistoryEntry[];
}


const TokenVisualizer = ({ tokens }: TokenVisualizerProps) => (
    <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Tokenization Preview</h3>
            <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="text-xs">
                    {tokens.length} tokens
                </Badge>
            </motion.div>
        </div>
        <motion.div
            className="flex flex-wrap gap-1.5 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 max-h-[200px] overflow-y-auto"
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
                        backgroundColor: `hsl(${(index * 40) % 360}, 70%, 80%)`,
                        color: `hsl(${(index * 40) % 360}, 70%, 30%)`
                    }}
                >
                    {token}
                    <motion.span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/75 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                    >
                        Token #{index + 1}
                    </motion.span>
                </motion.span>
            ))}
        </motion.div>
    </motion.div>
);


const MetricCard = ({ label, value, prefix = "", isCalculating, icon: Icon }: MetricDisplayProps) => (
    <motion.div
        className="flex flex-col p-4 rounded-xl bg-card border shadow-sm hover:shadow-md transition-all"
        whileHover={{ scale: 1.02 }}
    >
        <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <motion.p
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono"
        >
            {isCalculating ? (
                <span className="animate-pulse">...</span>
            ) : (
                typeof value === 'number' ?
                    `${prefix}${value.toFixed(7)}` :
                    `${prefix}${value}`
            )}
        </motion.p>
    </motion.div>
);

const UsageChart = ({ data }: UsageChartProps) => (
    <div className="h-[200px] w-full p-4 bg-card rounded-xl border">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tokens" stroke="#6366f1" />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const HistoryCard = ({ entry }: HistoryCardProps) => (
    <Card className="p-4">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-medium">{entry.provider} - {entry.model}</p>
                <p className="text-sm text-muted-foreground">{entry.name}</p>
            </div>
            <div className="text-right">
                <p className="font-mono">{entry.tokens.toLocaleString()} tokens</p>
                <p className="text-sm text-muted-foreground">${entry.cost.toFixed(7)}</p>
            </div>
        </div>
    </Card>
);


const LivePriceCalculator = () => {
    const [provider, setProvider] = useState<Provider>("openai");
    const [model, setModel] = useState(providers.openai[0]);
    const [text, setText] = useState("");
    const [tokens, setTokens] = useState(0);
    const [tokenized, setTokenized] = useState<string[]>([]);
    const [cost, setCost] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const [history, setHistory] = useState<HistoryEntry[]>([]);

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
                const [tokenResponse, costResponse] = await Promise.all([
                    fetch("/api/tokenize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text, model }),
                    }),
                    fetch("/api/calculate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            tokens: text.split(' ').length * 1.3, // Rough estimate while waiting
                            model,
                            provider
                        }),
                    })
                ]);

                const [tokenData, costData] = await Promise.all([
                    tokenResponse.json(),
                    costResponse.json()
                ]);

                setTokens(tokenData.tokens);
                setTokenized(tokenData.tokenized);
                setCost(costData.cost);
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
        setHistory(prev => [...prev, {
            name: new Date().toLocaleTimeString(),
            tokens,
            cost,
            model,
            provider
        }]);
    };

    return (
        <div className="flex items-center justify-center p-6 sm:p-10">
            <Card className="w-full max-w-5xl mx-auto shadow-xl bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 border-white/20">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    {/* Rest of the component remains the same as in the previous implementation */}
                    <CardHeader className="border-b border-white/10 py-6">
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
                                >
                                    <Sparkles className="w-7 h-7 text-purple-500" />
                                </motion.div>
                                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    LLM Price Calculator
                                </CardTitle>
                            </motion.div>
                            <div className="flex items-center gap-4 ml-4">
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <Badge variant="outline" className="text-sm gap-2 bg-white/50">
                                        <Clock className="w-4 h-4" />
                                        Live Updates
                                    </Badge>
                                </motion.div>
                                {isCalculating && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <Badge variant="secondary" className="text-sm animate-pulse bg-purple-100">
                                            Calculating...
                                        </Badge>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </CardHeader>


                    <CardContent className="flex flex-col sm:flex-row justify-between gap-4 border-t p-6 bg-white/30 backdrop-blur-sm">
                        <Tabs defaultValue="input" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="input">Input</TabsTrigger>
                                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                                <TabsTrigger value="history">History</TabsTrigger>
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
                                        <SelectTrigger className="w-full capitalize hover:border-primary/50 transition-colors">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-primary/80"></span>
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
                                        <SelectTrigger className="w-full hover:border-primary/50 transition-colors">
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
                                        placeholder="Start typing to see live token count and pricing..."
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        className="min-h-[200px] font-mono text-sm transition-colors resize-none hover:border-primary/50 pr-10"
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

                                {showCopied && (
                                    <Alert>
                                        <AlertDescription>Copied to clipboard!</AlertDescription>
                                    </Alert>
                                )}

                                <AnimatePresence>
                                    {tokenized.length > 0 && (
                                        <TokenVisualizer tokens={tokenized} isCalculating={isCalculating} />
                                    )}
                                </AnimatePresence>

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
                                        label="Token Count"
                                        value={tokens.toLocaleString()}
                                        isCalculating={isCalculating}
                                        icon={Sparkles}
                                    />
                                    <MetricCard
                                        label="Estimated Cost"
                                        value={cost.toFixed(7)}
                                        prefix="$"
                                        isCalculating={isCalculating}
                                        icon={Clock}
                                    />
                                </div>
                                <UsageChart data={history} />
                            </TabsContent>

                            <TabsContent value="history" className="space-y-4">
                                {history.map((entry, index) => (
                                    <HistoryCard key={index} entry={entry} />
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>

                    <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t p-6 bg-muted/30 backdrop-blur-sm">
                        <MetricCard
                            label="Token Count"
                            value={tokens.toLocaleString()}
                            isCalculating={isCalculating}
                            icon={Sparkles as React.ElementType}
                        />
                        <MetricCard
                            label="Estimated Cost"
                            value={cost.toFixed(7)}
                            prefix="$"
                            isCalculating={isCalculating}
                            icon={Clock}
                        />
                    </CardFooter>
                </motion.div>
            </Card>
        </div>
    );
};

export default LivePriceCalculator;