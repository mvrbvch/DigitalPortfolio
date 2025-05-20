import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PreLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      transition={{ duration: 2 }}
      onAnimationComplete={() => {
        if (!isLoading) {
          const element = document.getElementById("preloader");
          if (element) {
            element.style.display = "none";
          }
        }
      }}
      id="preloader"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-4"
    >
      <div className="w-full h-1 bg-muted overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-gradient-to-r from-[#b300ff] via-[#ed4aff] to-[#9bf1fb]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
}
