"use client";

import { motion } from "framer-motion";
import { MessierEntry } from "@/types/messier";
import MessierCard from "@/components/Messier/MessierCard";

export default function MessierGrid({ items }: { items: MessierEntry[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {items.map((item, index) => (
        <MessierCard key={item.id} item={item} index={index} />
      ))}
    </motion.div>
  );
}

