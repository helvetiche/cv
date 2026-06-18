/**
 * Inspect Firestore collection using Admin SDK
 * Run with: npx tsx scripts/inspectCollection.ts
 */

import { adminDb } from "../src/lib/firebase-admin";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const COLLECTION_NAME = "projects";

async function inspectCollection() {
  console.log(`\n📦 Inspecting collection: "${COLLECTION_NAME}"\n${"=".repeat(50)}`);

  try {
    const snapshot = await adminDb.collection(COLLECTION_NAME).get();

    if (snapshot.empty) {
      console.log("⚠️  Collection is empty or does not exist.");
      return;
    }

    console.log(`✅ Found ${snapshot.size} document(s)\n`);

    let idx = 0;
    snapshot.forEach((doc) => {
      idx++;
      const data = doc.data();

      console.log(`\n📄 Document ${idx}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Fields:`);

      Object.entries(data).forEach(([key, value]) => {
        const type = Array.isArray(value) ? "array" : typeof value;
        const preview =
          type === "array"
            ? `[${value.length} items] ${JSON.stringify(value).slice(0, 80)}...`
            : type === "string" && typeof value === "string" && value.length > 80
              ? `"${value.slice(0, 80)}..."`
              : JSON.stringify(value);

        console.log(`     • ${key}: ${type} = ${preview}`);
      });

      console.log(`   ${"-".repeat(40)}`);
    });
  } catch (error) {
    console.error("❌ Error fetching collection:", error);
  }
}

inspectCollection();
