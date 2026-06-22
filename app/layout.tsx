import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Serif } from "next/font/google";
import { MotionBlurProvider } from "./MotionBlurProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nascheponso.com"),
  
  // ===== SEARCH ENGINE META =====
  title: {
    default: "Nasche Del Ponso | Portfolio",
    template: "%s | Nasche Del Ponso",
  },
  description:
    "Junior Modern Technology Generalist specializing in integration, cloud computing, and artificial intelligence. Explore my portfolio of innovative projects and technical expertise.",
  keywords: [
    "Nasche Del Ponso",
    "Portfolio",
    "Software Developer",
    "Technology Generalist",
    "Cloud Computing",
    "Artificial Intelligence",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Full Stack Developer",
    "Integration Specialist",
    "API Development",
    "JavaScript",
    "TypeScript",
    "Node.js",
  ],
  authors: [{ name: "Nasche Del Ponso", url: "https://nascheponso.com" }],
  creator: "Nasche Del Ponso",
  publisher: "Nasche Del Ponso",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  
  // ===== OPEN GRAPH (Universal - Facebook, WhatsApp, Messenger, LinkedIn, Slack, Discord, Telegram, iMessage, Pinterest, etc.) =====
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nascheponso.com",
    siteName: "Nasche Del Ponso",
    title: "Nasche Del Ponso | Junior Modern Technology Generalist",
    description:
      "Junior Modern Technology Generalist specializing in integration, cloud computing, and artificial intelligence. Building scalable solutions that drive innovation.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nasche Del Ponso - Junior Modern Technology Generalist",
        type: "image/png",
      },
    ],
  },
  
  // ===== TWITTER / X CARDS (Fallback to OG when specific tags are missing) =====
  twitter: {
    card: "summary_large_image",
    title: "Nasche Del Ponso | Portfolio",
    description:
      "Junior Modern Technology Generalist specializing in integration, cloud computing, and AI. Building the future, one integration at a time.",
    images: ["/og-image.png"],
    creator: "@nascheponso",
    site: "@nascheponso",
  },
  
  // ===== ROBOTS & CRAWLING =====
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // ===== CANONICAL & VERIFICATION =====
  alternates: {
    canonical: "https://nascheponso.com",
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
    // Additional verification can be added:
    // yandex: "YOUR_YANDEX_VERIFICATION",
    // bing: "YOUR_BING_VERIFICATION",
  },
};

// JSON-LD Structured Data for Person
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nasche Del Ponso",
  url: "https://nascheponso.com",
  jobTitle: "Junior Modern Technology Generalist",
  description:
    "Specializing in integration, cloud computing, and artificial intelligence",
  knowsAbout: [
    "Web Development",
    "Cloud Computing",
    "Artificial Intelligence",
    "API Integration",
    "Next.js",
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Firebase",
    "Google Cloud",
  ],
  sameAs: [
    "https://github.com/nascheponso", // Update with your actual social links
    "https://linkedin.com/in/nascheponso", // Update with your actual social links
  ],
};

// JSON-LD Structured Data for Website
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nasche Del Ponso Portfolio",
  url: "https://nascheponso.com",
  description:
    "Portfolio showcasing projects, skills, and achievements in cloud computing, AI, and web development",
  author: {
    "@type": "Person",
    name: "Nasche Del Ponso",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexSerif.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon hints */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden">
        <MotionBlurProvider>{children}</MotionBlurProvider>
      </body>
    </html>
  );
}
