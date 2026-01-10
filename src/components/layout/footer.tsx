"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 py-4">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-1 text-sm text-muted-foreground px-4">
        <span>Built with</span>
        <Heart className="h-3 w-3 fill-red-500 text-red-500" />
        <span>by</span>
        <a
          href="https://berkinduz.com/en/about"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          Berkin Duz
        </a>
      </div>
    </footer>
  );
}
