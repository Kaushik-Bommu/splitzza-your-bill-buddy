import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Splits from "./pages/Splits";
import Friends from "./pages/Friends";
import SettingsPage from "./pages/SettingsPage";
import CreateBill from "./pages/CreateBill";
import AddFoodItems from "./pages/AddFoodItems";
import SplitResult from "./pages/SplitResult";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { ThemeProvider } from "./hooks/useTheme";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-md mx-auto relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/splits" element={<Splits />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/create-bill" element={<CreateBill />} />
              <Route path="/add-items" element={<AddFoodItems />} />
              <Route path="/split-result" element={<SplitResult />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

