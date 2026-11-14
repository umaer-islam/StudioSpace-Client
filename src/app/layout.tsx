import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GradualBlur } from "@/components/react-bits/gradual-blur";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Find Your Creative Space",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book photography studios, podcast rooms, music suites and creative production spaces with StudioSpace.",
  applicationName: "StudioSpace",
  keywords: [
    "creative studio rental",
    "photography studio",
    "podcast studio",
    "music recording studio",
    "production studio booking",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            <SiteHeader />
            <main className="flex-1 pt-24 sm:pt-28">{children}</main>
            {/* Bottom Progressive Glassmorphic Blur Ramp across the bottom of the viewport */}
            <GradualBlur
              target="page"
              position="bottom"
              height="10rem"
              strength={2.5}
              layers={6}
              curve="bezier"
              zIndex={30}
            />
            <SiteFooter />
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: "rounded-2xl border border-border bg-surface text-foreground shadow-2xl backdrop-blur-xl font-sans text-xs sm:text-sm",
                  description: "text-muted text-xs font-normal",
                  actionButton: "rounded-full bg-foreground text-background font-bold text-xs px-3 py-1.5",
                  cancelButton: "rounded-full bg-surface-secondary text-foreground text-xs px-3 py-1.5",
                },
              }}
            />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
