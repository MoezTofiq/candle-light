import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true
}

const storage = new Storage()

// TODO when storage updates apply changes to webpage

// storage.watch({
//   color: (c) => {
//     console.log(c.newValue)
//   },
//   opacity: (c) => {
//     console.log(c.newValue)
//   }
// })

const applyTint = async () => {
  const color = await storage.get("color")
  const opacity = await storage.get("opacity")
  console.log(color, opacity)
  const overlay = document.createElement("div")
  overlay.id = "temptemp"
  overlay.style.position = "fixed"
  overlay.style.top = "0"
  overlay.style.left = "0"
  overlay.style.width = "100vw"
  overlay.style.height = "100vh"
  overlay.style.pointerEvents = "none"
  overlay.style.zIndex = "100000"
  overlay.style.backgroundColor = color
  overlay.style.opacity = opacity
  document.documentElement.appendChild(overlay)
}

applyTint()
