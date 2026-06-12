"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SubscribeForm from "./SubscribeForm";

export default function SubscribeModal() {
  const [isVisible, setIsVisible] = useState(false);

  const isSubscribed = () => {
    if (typeof document === "undefined") return false;
    return document.cookie.split("; ").some(c => c.trim().startsWith("astrohub_subscribed=true"));
  };

  useEffect(() => {
    if (isSubscribed()) {
      setIsVisible(false);
      return;
    }

    const checkVisibility = () => {
      if (isSubscribed()) {
        setIsVisible(false);
        return;
      }

      const lastDismissedStr = localStorage.getItem("astrohub_subscribe_last_dismissed");
      const now = Date.now();
      const cooldowned = lastDismissedStr ? (now - parseInt(lastDismissedStr, 10) > 5 * 60 * 1000) : true;

      // Calculate how far down the user has scrolled
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      const scrollPercent = (scrollY / (documentHeight - windowHeight)) * 100;
      
      // Show modal when scrolled down 30% of the page and cooldown has expired
      if (scrollPercent > 30 && cooldowned && !isVisible) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", checkVisibility);
    const interval = setInterval(checkVisibility, 5000);
    
    // Run initial check
    checkVisibility();

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      clearInterval(interval);
    };
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("astrohub_subscribe_last_dismissed", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md"
        >
          <div className="relative">
            {/* Close button positioned outside the form */}
            <button
              onClick={handleDismiss}
              className="absolute -top-3 -right-3 z-10 p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-full border border-slate-700 shadow-xl transition-colors hover:bg-slate-700"
              aria-label="Close subscription form"
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* We scale down the SubscribeForm slightly to fit perfectly as a popup */}
            <div className="scale-[0.85] origin-bottom-right sm:scale-100 sm:origin-center">
              <SubscribeForm />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
