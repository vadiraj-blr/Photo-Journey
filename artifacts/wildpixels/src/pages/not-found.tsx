import { motion } from "framer-motion";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-stone-100 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-md text-center space-y-8"
      >
        <h1 className="text-8xl md:text-9xl font-serif text-primary">404</h1>
        <div className="space-y-4">
          <h2 className="text-2xl font-serif">Off the Trail</h2>
          <p className="text-muted-foreground font-light text-lg">
            The path you're looking for has faded into the wilderness. 
            This coordinate doesn't exist on our maps.
          </p>
        </div>
        
        <div className="pt-8">
          <Link href="/" className="inline-flex items-center gap-4 text-xs uppercase tracking-widest text-primary hover:text-stone-100 transition-colors duration-500 pb-2 border-b border-primary/30 hover:border-stone-100/50">
            Return to the Expedition
          </Link>
        </div>
      </motion.div>
    </div>
  );
}