import { ClerkProvider, Show } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import UserAvatar from "@/components/UserAvatar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Панель управления ELON",
  description: "Система управления платформой ELON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          <TooltipProvider>
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <Show when="signed-in">
                  <AppSidebar />
                </Show>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <Show when="signed-in">
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-white px-6 sticky top-0 z-50 font-mono">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 rounded-none border border-border bg-white hover:bg-zinc-50" />
                        <div className="h-4 w-[1px] bg-border mx-2" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          Консоль управления

                        </span>
                      </div>
                      <UserAvatar />
                    </header>
                  </Show>
                  <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-50/30">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          </TooltipProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}