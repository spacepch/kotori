import { Context, Service, createConfig, loadConfig, saveConfig } from '@kotori-bot/core';
import { join } from 'path';

export class File extends Service {
  constructor(ctx: Context) {
    super(ctx, {}, 'file');
  }

  getDir() {
    return join(this.ctx.baseDir.data, ...(this.ctx.identity ? this.ctx.identity.split('/') : []));
  }

  getFile(filename: string) {
    return join(this.getDir(), filename);
  }

  load(filename: string, type?: Parameters<typeof loadConfig>[1], init?: Parameters<typeof loadConfig>[2]) {
    return loadConfig(this.getFile(filename), type, init);
  }

  save(filename: string, data: Parameters<typeof saveConfig>[1], type?: Parameters<typeof saveConfig>[2]) {
    saveConfig(this.getFile(filename), data, type);
  }

  create(filename: string, data?: Parameters<typeof createConfig>[1], type?: Parameters<typeof createConfig>[2]) {
    createConfig(this.getFile(filename), data, type);
  }
}

export default File;
