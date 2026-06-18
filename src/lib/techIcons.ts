import { type IconType } from "react-icons";
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
  SiSocketdotio,
  SiRaspberrypi,
  SiExpo,
  SiVercel,
  SiGit,
  SiGithub,
  SiInfluxdb,
  SiD3,
  SiChartdotjs,
  SiGnubash,
} from "react-icons/si";
import { BiCodeAlt, BiChip, BiShield, BiWifi } from "react-icons/bi";

// Map technology names to React Icons
const techIconMap: Record<string, IconType> = {
  // Frontend Frameworks
  "Next.js": SiNextdotjs,
  React: SiReact,
  "React Native": SiReact,

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
  "D3.js": SiD3,
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
  "Excel JS": BiCodeAlt,
  Automation: BiChip,
};

// Get icon for a tech name, fallback to generic code icon
export function getTechIcon(techName: string): IconType {
  return techIconMap[techName] ?? BiCodeAlt;
}

export default techIconMap;
