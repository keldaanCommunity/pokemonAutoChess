import { precomputeTracker } from "./precompute-tracker"
import { precomputeCredits } from "./precompute-credits"
import { precomputeEmotions } from "./precompute-emotions"
import { csvExport } from "./csv-export"

async function precomputeAll() {
  await precomputeTracker()
  precomputeCredits()
  precomputeEmotions()
  csvExport()
}

precomputeAll()
