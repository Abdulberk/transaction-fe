// app/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, TrendingUp, Store, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionsQuery } from '@/hooks/queries/useTransactionsQuery';
import { useMerchantsQuery } from '@/hooks/queries/useMerchantsQuery';
import { UploadModal } from '@/components/features/transactions/UploadModal';
import type { MerchantData, SearchMerchantsDto } from '@/types/merchant';
import { usePatternsQuery } from '@/hooks/queries/usePatternsQuery';
import { Pattern } from "@/types/pattern";

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("merchant");
  const [merchantParams,] = useState<SearchMerchantsDto>({
    page: 1,
    limit: 10,
    isActive: true
  });

  const { 
    data: transactionsData, 
    isLoading: isTransactionsLoading 
  } = useTransactionsQuery({
    page: 1,
    limit: 10,
    sortBy: 'date',
    order: 'desc'
  });

  const { 
    data: merchantsData, 
    isLoading: isMerchantsLoading 
  } = useMerchantsQuery(merchantParams);

  const { 
    data: patterns, 
    isLoading: isPatternsLoading 
  } = usePatternsQuery();

  const isLoading = isTransactionsLoading || isMerchantsLoading || isPatternsLoading;


  const totalSpend = transactionsData?.items.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
  const transactionCount = transactionsData?.items.length || 0;
  const avgTransaction = transactionCount ? totalSpend / transactionCount : 0;
  const merchantCount = merchantsData?.total || 0;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <motion.main 
        className="max-w-[1200px] mx-auto p-4 space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex items-center justify-between py-6 border-b"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
              Transaction Analyzer
            </h1>
            <p className="text-sm text-zinc-500 mt-1">Analyze your spending patterns with AI</p>
          </div>
          <motion.button 
            className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Upload CSV
          </motion.button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {isLoading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              <motion.div variants={itemVariants}>
                <StatsCard
                  icon={<DollarSign className="h-5 w-5" />}
                  title="Total Spend"
                  value={`$${totalSpend.toFixed(2)}`}
                  trend={`${transactionsData?.items.length || 0} transactions`}
                  trendUp={null}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatsCard
                  icon={<CreditCard className="h-5 w-5" />}
                  title="Transactions"
                  value={transactionCount.toString()}
                  trend="Analyzed transactions"
                  trendUp={null}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatsCard
                  icon={<TrendingUp className="h-5 w-5" />}
                  title="Avg. Transaction"
                  value={`$${avgTransaction.toFixed(2)}`}
                  trend="Per transaction"
                  trendUp={null}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <StatsCard
                  icon={<Store className="h-5 w-5" />}
                  title="Merchants"
                  value={merchantCount.toString()}
                  trend="Unique merchants"
                  trendUp={null}
                />
              </motion.div>
            </>
          )}
        </motion.div>

        <Tabs 
          defaultValue="merchant" 
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="border-b rounded-none w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="merchant" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-4 py-2 transition-colors"
            >
              Merchant Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="pattern"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-4 py-2 transition-colors"
            >
              Pattern Detection
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="merchant" className="mt-6">
                <Card className="p-8 border-none shadow-xl bg-white/50 backdrop-blur-sm">
                  <h2 className="text-xl font-semibold">Normalized Merchants</h2>
                  <p className="text-sm text-zinc-500 mb-6">
                    AI-powered merchant name normalization and categorization
                  </p>
                  <ScrollArea className="h-[500px] pr-4">
                    {isMerchantsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <MerchantCardSkeleton key={i} />
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {merchantsData?.items.map((merchant, index) => (
                          <motion.div
                            key={merchant.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                          >
                            <MerchantCard 
                              merchant={{
                                original: merchant.originalName,
                                normalized: merchant.normalizedName,
                                categories: [merchant.category, merchant.subCategory].filter(Boolean) as string[],
                                tags: merchant.flags
                              }} 
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </ScrollArea>
                </Card>
              </TabsContent>

              <TabsContent value="pattern" className="mt-6">
  <Card className="p-8 border-none shadow-xl bg-white/50 backdrop-blur-sm">
    <h2 className="text-xl font-semibold">Detected Patterns</h2>
    <p className="text-sm text-zinc-500 mb-6">
      Subscription and recurring payment detection
    </p>
    <ScrollArea className="h-[500px] pr-4">
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <MerchantCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {patterns?.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <PatternCard pattern={pattern} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </ScrollArea>
  </Card>
</TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>

        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
      </motion.main>
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <Card className="p-6 border-none bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-32 mt-2" />
      <Skeleton className="h-3 w-20 mt-1" />
    </Card>
  );
}

function MerchantCardSkeleton() {
  return (
    <Card className="p-6 border border-zinc-100">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {

  const patternTypeDisplay = pattern.type.toLowerCase().replace('_', ' ');
  const frequencyDisplay = pattern.frequency.toLowerCase();

  return (
    <Card className="p-6 hover:shadow-md transition-shadow border border-zinc-100">
      <div className="space-y-3">
      
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-zinc-900">
              {pattern.merchantName || 'Unknown Merchant'}
            </h3>
            <p className="text-sm text-zinc-500">
              {patternTypeDisplay} • {frequencyDisplay}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-zinc-900">
              ${Math.abs(pattern.amount).toFixed(2)}
            </p>
            {pattern.nextExpectedDate && (
              <p className="text-sm text-zinc-500">
                Next: {new Date(pattern.nextExpectedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {pattern.description && (
          <p className="text-sm text-zinc-600">
            {pattern.description}
          </p>
        )}
      </div>
    </Card>
  );
}

function MerchantCard({ merchant }: { merchant: MerchantData }) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow border border-zinc-100">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-zinc-500">Original</p>
            <p className="text-sm text-zinc-500">Normalized</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-mono text-sm bg-zinc-50 px-3 py-1 rounded">{merchant.original}</p>
            <p className="font-semibold text-zinc-900">{merchant.normalized}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {merchant.categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {merchant.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded transition-colors hover:bg-zinc-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatsCard({ 
  icon, 
  title, 
  value, 
  trend, 
  trendUp 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string;
  trend: string;
  trendUp: boolean | null;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow border-none bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-zinc-100 rounded-lg">
          {icon}
        </div>
        <h3 className="text-sm font-medium text-zinc-600">{title}</h3>
      </div>
      <p className="text-2xl font-bold mt-2 text-zinc-900">{value}</p>
      <p className={`text-xs mt-1 flex items-center gap-1 ${
        trendUp === null 
          ? 'text-zinc-500' 
          : trendUp 
            ? 'text-emerald-600' 
            : 'text-rose-600'
      }`}>
        {trendUp !== null && (
          <span className="inline-block">
            {trendUp ? '↑' : '↓'}
          </span>
        )}
        {trend}
      </p>
    </Card>
  );
}