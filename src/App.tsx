import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Home from "./pages/Home";
import Calculators from "./pages/Calculators";
import Indicators from "./pages/Indicators";
import Screeners from "./pages/Screeners";
import Blogs from "./pages/Blogs";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import BacktestScanners from "./pages/BacktestScanners";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import CompoundInterestPage from "./pages/calculators/CompoundInterestPage";
import LoanEMIPage from "./pages/calculators/LoanEMIPage";
import SIPPage from "./pages/calculators/SIPPage";
import RetirementPage from "./pages/calculators/RetirementPage";
import RiskPage from "./pages/calculators/RiskPage";
import MortgagePage from "./pages/calculators/MortgagePage";
import CarLoanPage from "./pages/calculators/CarLoanPage";
import TaxPage from "./pages/calculators/TaxPage";
import InflationPage from "./pages/calculators/InflationPage";
import BlogPost from "./pages/BlogPost";
import TradingJournal from "./pages/TradingJournal";
import TradingJournalSettings from "./pages/TradingJournalSettings";
import TradingJournalAnalytics from "./pages/TradingJournalAnalytics";
import TradingJournalTradeDetail from "./pages/TradingJournalTradeDetail";
import OptionSimulator from "./pages/OptionSimulator";
import OptionStrategyRecommender from "./pages/OptionStrategyRecommender";
import MarketInsights from "./pages/MarketInsights";
import ChartingPlatform from "./pages/ChartingPlatform";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading XenAlgo..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <UserPreferencesProvider>
            <SubscriptionProvider>
              <CurrencyProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/calculators" element={<Calculators />} />
                    <Route path="/indicators" element={<Indicators />} />
                    <Route path="/screeners" element={<Screeners />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/backtest-scanners" element={<BacktestScanners />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/calculators/compound-interest" element={<CompoundInterestPage />} />
                    <Route path="/calculators/loan-emi" element={<LoanEMIPage />} />
                    <Route path="/calculators/sip" element={<SIPPage />} />
                    <Route path="/calculators/retirement" element={<RetirementPage />} />
                    <Route path="/calculators/risk" element={<RiskPage />} />
                    <Route path="/calculators/mortgage" element={<MortgagePage />} />
                    <Route path="/calculators/car-loan" element={<CarLoanPage />} />
                    <Route path="/calculators/tax" element={<TaxPage />} />
                    <Route path="/calculators/inflation" element={<InflationPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/trading-journal" element={
                      <ProtectedRoute>
                        <TradingJournal />
                      </ProtectedRoute>
                    } />
                    <Route path="/trading-journal/settings" element={
                      <ProtectedRoute>
                        <TradingJournalSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/trading-journal/analytics" element={
                      <ProtectedRoute>
                        <TradingJournalAnalytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/trading-journal/trade/:id" element={
                      <ProtectedRoute>
                        <TradingJournalTradeDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/option-simulator" element={
                      <ProtectedRoute>
                        <OptionSimulator />
                      </ProtectedRoute>
                    } />
                    <Route path="/option-recommender" element={
                      <ProtectedRoute>
                        <OptionStrategyRecommender />
                      </ProtectedRoute>
                    } />
                    <Route path="/market-insights" element={<MarketInsights />} />
                    <Route path="/charting" element={<ChartingPlatform />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </CurrencyProvider>
          </SubscriptionProvider>
        </UserPreferencesProvider>
      </QueryClientProvider>
        </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
