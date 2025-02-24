// Production-optimized build script for cluster architecture
import { build } from "bun";

interface BuildConfig {
  entrypoints: string[];
  outdir: string;
  naming: string;
  minify: boolean;
}

const config: BuildConfig = {
  entrypoints: ["cluster.ts"],  // Updated entrypoint from app.ts to cluster.ts
  outdir: "dist",
  naming: "[dir]/[name].[ext]", // Keep file structure
  minify: true
};

console.log("Building for production...");

try {
  const result = await build({
    entrypoints: config.entrypoints,
    outdir: config.outdir,
    naming: config.naming,
    minify: {
      whitespace: true,
      identifiers: true,
      syntax: true
    },
    target: "bun",
    sourcemap: "external",
    // In cluster mode, we might want to keep console logs for debugging worker status
    // But we can still drop debugger statements
    drop: ["debugger"],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production")
    }
  });

  console.log(`✓ Build completed! ${result.outputs.length} files generated`);
  for (const file of result.outputs) {
    console.log(`  - ${file.path} (${(file.size / 1024).toFixed(2)} KB)`);
  }
} catch (error) {
  console.error("Build failed:", error);
  process.exit(1);
}
