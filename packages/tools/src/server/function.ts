import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

type ConfigFileType = 'json' | 'toml' | 'yaml' /* | 'xml' | 'ini'  */ | 'text';

export function loadConfig(
  filename: string,
  type: ConfigFileType = 'json',
  init: object | string = {}
): object | null | unknown[] | string {
  const dirname = path.dirname(filename);
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
  const isExistsFile = fs.existsSync(filename);
  const defaultValue = typeof init === 'string' ? init : JSON.stringify(init);
  if (!isExistsFile && init) fs.writeFileSync(filename, defaultValue);
  const data = isExistsFile ? fs.readFileSync(filename).toString() : defaultValue;
  if (type === 'yaml') return YAML.parse(data);
  if (type === 'toml') return data;
  if (type === 'text') return data;
  return JSON.parse(data);
}

export function saveConfig(filename: string, data: object | string, type: ConfigFileType = 'json'): void {
  let content = '';
  if (typeof data === 'object' && type === 'json') content = JSON.stringify(data);
  else if (typeof data === 'object' && type === 'yaml') content = YAML.stringify(data);
  else content = String(data);
  const dirname = path.dirname(filename);
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname, { recursive: true });
  fs.writeFileSync(filename, content);
}

export function createConfig(filename: string, data?: object, type: ConfigFileType = 'json'): void {
  let content = '';
  if (!fs.existsSync(filename)) {
    if (type === 'json') content = JSON.stringify(data);
    if (type === 'yaml') content = YAML.stringify(data);
    fs.writeFileSync(filename, content);
  }
}
