import * as esbuild from 'https://deno.land/x/esbuild@v0.17.10/mod.js';

const ctx = await esbuild.context({
  entryPoints: [`./src/index.ts`],
  bundle: true,
  outfile: './dist/axink.js',
  write: true,
  format: 'esm', // this will ensure we don't have CJS issues later.
  minify: true,
  treeShaking: true,
  // watch: {
  //   onRebuild(error, result) {
  //     error
  //       ? console.error("watch build failed: ", error)
  //       : console.log("Watch build succesful: ", result);
  //   },
  // },
  target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
});

// console.log(result);

await ctx.watch();
console.log('watching...');
