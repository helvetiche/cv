/**
 * Admin Account Registration Script
 * 
 * Creates a Firebase Auth user with email/password using the Admin SDK.
 * Run with: npx tsx scripts/register-admin.ts
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import * as dotenv from "dotenv";
import * as path from "path";
import { createHash } from "crypto";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const ADMIN_EMAIL = "helvetiche@gmail.com";
// Generate a strong 256-bit random password (64 hex chars)
const ADMIN_PASSWORD = createHash("sha256")
  .update(`helvetiche-${Date.now()}-${Math.random()}`)
  .digest("hex");

async function registerAdmin() {
  console.log("\n🔐 Admin Account Registration\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Initialize Firebase Admin
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!privateKey || !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("❌ Missing Firebase credentials in .env.local");
    process.exit(1);
  }

  const app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });

  const auth = getAuth(app);

  try {
    // Check if user already exists
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(ADMIN_EMAIL);
      console.log(`ℹ️  User ${ADMIN_EMAIL} already exists (UID: ${userRecord.uid})`);
      console.log("   Updating password...\n");
      
      // Update password
      await auth.updateUser(userRecord.uid, {
        password: ADMIN_PASSWORD,
        emailVerified: true,
      });
      
    } catch {
      // User doesn't exist, create new
      console.log("📝 Creating new admin account...\n");
      
      userRecord = await auth.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        displayName: "Admin",
      });
      
      console.log(`✅ Account created successfully!`);
      console.log(`   UID: ${userRecord.uid}`);
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n📧 Email:    ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log("⚠️  Save these credentials securely!");
    console.log("⚠️  The password is SHA-256 based and cannot be recovered.\n");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

registerAdmin();
