import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/lib/firebase";

const COLLECTION_NAME = "projects";

async function inspectCollection() {
  console.log(`\n📦 Inspecting collection: "${COLLECTION_NAME}"\n${"=".repeat(50)}`);

  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

    if (querySnapshot.empty) {
      console.log("⚠️  Collection is empty or does not exist.");
      return;
    }

    console.log(`✅ Found ${querySnapshot.size} document(s)\n`);

    querySnapshot.forEach((doc, index) => {
      const data = doc.data();

      console.log(`\n📄 Document ${index + 1}`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Fields:`);

      Object.entries(data).forEach(([key, value]) => {
        const type = Array.isArray(value) ? "array" : typeof value;
        const preview =
          type === "array"
            ? `[${value.length} items] ${JSON.stringify(value).slice(0, 80)}...`
            : type === "string" && value.length > 80
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
