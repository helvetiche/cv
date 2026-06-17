import {
  SiNextdotjs,
  SiReact,
  SiNodedotjs,
  SiFirebase,
  SiGooglecloud,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiMysql,
  SiPostgresql,
  SiRedis,
  SiPrisma,
  SiOpenai,
  SiStripe,
  SiExpress,
  SiSupabase,
  SiD3Dotjs,
  SiChartdotjs,
  SiSocketdotio,
  SiRaspberrypi,
  SiExpo,
  SiVercel,
  SiGit,
  SiGithub,
  SiGnubash,
  SiNodemailer,
  SiReact as SiReactNative,
  SiApachekafka,
  SiInfluxdb,
} from "react-icons/si";
import { DiMysql, DiRedis, DiDatabase } from "react-icons/di";
import { BiCodeAlt, BiChip, BiCloud, BiData, BiPalette, BiShield, BiWifi } from "react-icons/bi";
import { type IconType } from "react-icons";

// Map technology names to React Icons
const techIconMap: Record<string, IconType> = {
  // Frontend Frameworks
  "Next.js": SiNextdotjs,
  React: SiReact,
  "React Native": SiReactNative,

  // Backend
  "Node.js": SiNodedotjs,
  Express: SiExpress,

  // Languages
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,

  // Styling
  Tailwind: SiTailwindcss,
  "Tailwind CSS": SiTailwindcss,

  // Cloud & Services
  Firebase: SiFirebase,
  "Google Cloud": SiGooglecloud,
  Supabase: SiSupabase,
  Vercel: SiVercel,

  // Databases
  MongoDB: SiMongodb,
  MySQL: SiMysql,
  PostgreSQL: SiPostgresql,
  InfluxDB: SiInfluxdb,
  Redis: SiRedis,
  Prisma: SiPrisma,

  // APIs & AI
  OpenAI: SiOpenai,
  Stripe: SiStripe,
  OAuth: BiShield,

  // Visualization
  "D3.js": SiD3Dotjs,
  "Chart.js": SiChartdotjs,

  // IoT & Hardware
  MQTT: BiWifi,
  WebSocket: SiSocketdotio,
  "Raspberry Pi": SiRaspberrypi,

  // Tools
  Expo: SiExpo,
  Git: SiGit,
  GitHub: SiGithub,
  Cron: SiGnubash,
  Nodemailer: SiNodemailer,
  "Excel JS": BiCodeAlt,
  Automation: BiChip,
};

// Get icon for a tech name, fallback to generic code icon
export function getTechIcon(techName: string): IconType {
  return techIconMap[techName] ?? BiCodeAlt;
}

export default techIconMap;
