'use strict';

var core = require('@assetpack/core');
var freeTexPackerCore = require('free-tex-packer-core');
var fs = require('fs');
var fs$1 = require('fs-extra');
var glob = require('glob-promise');

function texturePacker(options) {
    const defaultOptions = {
        tags: {
            tps: 'tps',
            fix: 'fix',
            jpg: 'jpg',
            ...options?.tags,
        },
        resolutionOptions: {
            template: '@%%x',
            resolutions: { default: 1, low: 0.5 },
            fixedResolution: 'default',
            maximumTextureSize: 4096,
            ...options?.resolutionOptions,
        },
        texturePacker: {
            padding: 2,
            packer: 'MaxRectsPacker',
            packerMethod: 'Smart',
            ...options?.texturePacker,
        }
    };
    return {
        folder: true,
        name: 'texture-packer',
        test(tree, _p, opts) {
            const opt = { ...defaultOptions.tags, ...opts.tags };
            return core.hasTag(tree, 'file', opt.tps);
        },
        async transform(tree, processor, optionOverrides) {
            const tags = { ...defaultOptions.tags, ...optionOverrides.tags };
            const resolutionOptions = { ...defaultOptions.resolutionOptions, ...optionOverrides.resolutionOptions };
            const transformOptions = {
                tags,
                resolutionOptions,
                texturePacker: {
                    textureName: core.path.basename(processor.inputToOutput(tree.path)),
                    textureFormat: (core.hasTag(tree, 'file', tags.jpg) ? 'jpg' : 'png'),
                    ...defaultOptions.texturePacker,
                    ...{
                        width: resolutionOptions?.maximumTextureSize,
                        height: resolutionOptions?.maximumTextureSize,
                    },
                    ...optionOverrides.texturePacker
                },
            };
            const largestResolution = Math.max(...Object.values(transformOptions.resolutionOptions.resolutions));
            const resolutionHash = core.hasTag(tree, 'path', transformOptions.tags.fix)
                ? {
                    default: transformOptions.resolutionOptions.resolutions[transformOptions.resolutionOptions.fixedResolution]
                }
                : transformOptions.resolutionOptions.resolutions;
            const globPath = `${tree.path}/**/*.{jpg,png,gif}`;
            const files = await glob(globPath);
            const imagesToPack = files.map((f) => ({ path: f, contents: fs.readFileSync(f) }));
            if (imagesToPack.length === 0) {
                return;
            }
            const cacheMap = new Map();
            const front = transformOptions.resolutionOptions.template.split('%%')[0];
            // loop through each resolution and pack the images
            for (const resolution of Object.values(resolutionHash)) {
                const scale = resolution / largestResolution;
                const origScale = largestResolution;
                const template = transformOptions.resolutionOptions.template.replace('%%', resolution.toString());
                const res = await freeTexPackerCore.packAsync(imagesToPack, { ...transformOptions.texturePacker, scale });
                const out = await processTPSFiles(res, {
                    inputDir: tree.path,
                    outputDir: processor.inputToOutput(tree.path),
                    template,
                    scale,
                    originalScale: origScale,
                    processor,
                });
                out.forEach((o) => {
                    const oo = o.split(front)[0];
                    if (o.endsWith('.json')) {
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        !cacheMap.get(oo) && cacheMap.set(oo, { paths: [], name: processor.trimOutputPath(`${oo}.json`) });
                        const d = cacheMap.get(oo);
                        d.paths.push(processor.trimOutputPath(o));
                        cacheMap.set(oo, d);
                    }
                    processor.addToTree({
                        tree,
                        outputOptions: {
                            outputPathOverride: o,
                        },
                        transformId: 'tps',
                        transformData: {
                            prefix: template,
                        }
                    });
                });
            }
            core.SavableAssetCache.set(tree.path, {
                tree,
                transformData: {
                    type: this.name,
                    prefix: transformOptions.resolutionOptions.template,
                    resolutions: Object.values(resolutionHash),
                    files: [...cacheMap.values()],
                }
            });
        },
    };
}
function pixiTexturePacker(options) {
    return texturePacker({
        ...options,
        texturePacker: {
            ...options?.texturePacker,
            exporter: 'Pixi',
        },
    });
}
async function processTPSFiles(files, options) {
    const outputFilePaths = [];
    for (const item of files) {
        // create a name that injects a template eg _mip
        const templateName = item.name.replace(/(\.[\w\d_-]+)$/i, `${options.template}$1`);
        const outputDir = options.outputDir;
        // make sure the folder we save to exists
        fs$1.ensureDirSync(outputDir);
        // this is where we save the files
        const outputFile = core.path.joinSafe(outputDir, templateName);
        // so one thing FREE texture packer does different is that it either puts the full paths in
        // or the image name.
        // we rely on the folder names being preserved in the frame data.
        // we need to modify the frame names before we save so they are the same
        // eg raw-assets/image/icons{tps}/cool/image.png -> cool/image.png
        if (outputFile.split('.').pop() === 'json') {
            const json = JSON.parse(item.buffer.toString('utf8'));
            const newFrames = {};
            for (const i in json.frames) {
                const normalizedDir = options.inputDir.replace(/\\/g, '/');
                const frameName = i.replace(`${normalizedDir}/`, '');
                newFrames[frameName] = json.frames[i];
            }
            json.frames = newFrames;
            json.meta.image = json.meta.image.replace(/(\.[\w\d_-]+)$/i, `${options.template}$1`);
            json.meta.scale *= options.originalScale;
            options.processor.saveToOutput({
                tree: undefined,
                outputOptions: {
                    outputPathOverride: outputFile,
                    outputData: JSON.stringify(json),
                }
            });
        }
        else {
            options.processor.saveToOutput({
                tree: undefined,
                outputOptions: {
                    outputPathOverride: outputFile,
                    outputData: item.buffer,
                }
            });
        }
        outputFilePaths.push(outputFile);
    }
    return outputFilePaths;
}

exports.pixiTexturePacker = pixiTexturePacker;
exports.texturePacker = texturePacker;
//# sourceMappingURL=index.js.map
