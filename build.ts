// Production-optimized build script
import { build } from "bun";

interface BuildConfig {
  entrypoints: string[];
  outdir: string;
  naming: string;
  minify: boolean;
  target: string;
}

const config: BuildConfig = {
  entrypoints: ["app.ts"],
  outdir: "dist",
  naming: "[dir]/[name].[ext]", // Keep file structure
  minify: true,
  target: "bun"       // Build for Bun runtime (use "node" for Node.js)
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
    target: config.target,
    sourcemap: "external",      // Generate external sourcemaps for debugging
    drop: ["console", "debugger"], // Remove debugging code
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
