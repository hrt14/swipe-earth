import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dataPath = path.join(root, 'data/ocean/midnight-scene.json');
const allowedLayers = new Set(['far', 'mid', 'near', 'silhouette']);
const errors = [];

function fail(message) {
  errors.push(message);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Cannot read JSON ${path.relative(root, filePath)}: ${error.message}`);
    return null;
  }
}

function publicPath(assetPath) {
  if (typeof assetPath !== 'string' || !assetPath.startsWith('/')) {
    fail(`Asset path must start with /: ${String(assetPath)}`);
    return null;
  }
  const resolved = path.resolve(root, 'public', assetPath.slice(1));
  const publicRoot = path.resolve(root, 'public');
  if (!resolved.startsWith(`${publicRoot}${path.sep}`)) {
    fail(`Asset path escapes public directory: ${assetPath}`);
    return null;
  }
  return resolved;
}

function validateSvg(assetPath) {
  const filePath = publicPath(assetPath);
  if (!filePath) return;
  if (!fs.existsSync(filePath)) {
    fail(`Missing asset: ${assetPath}`);
    return;
  }
  const stat = fs.statSync(filePath);
  if (!stat.isFile() || stat.size < 80) {
    fail(`Empty or invalid asset: ${assetPath}`);
    return;
  }
  if (path.extname(filePath).toLowerCase() !== '.svg') return;
  const svg = fs.readFileSync(filePath, 'utf8');
  if (!/<svg\b/i.test(svg)) fail(`Missing <svg> root: ${assetPath}`);
  if (!/viewBox\s*=\s*["'][^"']+["']/i.test(svg)) fail(`SVG lacks viewBox: ${assetPath}`);
  if (/<image\b[^>]+(?:href|xlink:href)\s*=\s*["'](?:https?:)?\/\//i.test(svg)) {
    fail(`External image reference is not allowed: ${assetPath}`);
  }
  const openTags = (svg.match(/<svg\b/gi) || []).length;
  const closeTags = (svg.match(/<\/svg>/gi) || []).length;
  if (openTags !== 1 || closeTags !== 1) fail(`Malformed SVG root count: ${assetPath}`);
}

const scene = readJson(dataPath);
if (scene) {
  if (scene.schemaVersion !== 1) fail('midnight-scene.json schemaVersion must be 1');
  if (!scene.zone || typeof scene.zone !== 'object') fail('Scene must contain zone');
  if (!scene.species || typeof scene.species !== 'object') fail('Scene must contain species');
  if (!Array.isArray(scene.instances)) fail('Scene must contain instances array');

  if (scene.zone?.background) validateSvg(scene.zone.background);

  const speciesIds = new Set(Object.keys(scene.species || {}));
  for (const [id, item] of Object.entries(scene.species || {})) {
    if (!item.name || !item.jp || !item.image || !item.note) fail(`Species ${id} is missing required display fields`);
    if (!['pending', 'verified', 'fiction'].includes(item.researchStatus)) fail(`Species ${id} has invalid researchStatus`);
    validateSvg(item.image);
  }

  const instanceIds = new Set();
  for (const item of scene.instances || []) {
    if (!item.id || instanceIds.has(item.id)) fail(`Duplicate or missing instance id: ${String(item.id)}`);
    instanceIds.add(item.id);
    if (!speciesIds.has(item.species)) fail(`Instance ${item.id} references unknown species ${item.species}`);
    if (!allowedLayers.has(item.layer)) fail(`Instance ${item.id} has invalid layer ${item.layer}`);
    for (const key of ['x', 'y']) {
      if (typeof item[key] !== 'number' || item[key] < 0 || item[key] > 100) fail(`Instance ${item.id} has invalid ${key}`);
    }
    if (typeof item.size !== 'number' || item.size <= 0 || item.size > 120) fail(`Instance ${item.id} has invalid size`);
    if (typeof item.duration !== 'number' || item.duration < 4 || item.duration > 60) fail(`Instance ${item.id} has invalid duration`);
  }
}

if (errors.length) {
  console.error(`Ocean scene validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Ocean scene validation passed: ${Object.keys(scene.species).length} species, ${scene.instances.length} instances.`);
