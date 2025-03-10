/*
 * @Author: hotaru biyuehuya@gmail.com
 * @Blog: https://hotaru.icu
 * @Date: 2023-07-11 14:18:27
 * @LastEditors: Hotaru biyuehuya@gmail.com
 * @LastEditTime: 2024-05-03 13:24:35
 */

import { Command, Context, Symbols } from 'kotori-bot';

export const lang = [__dirname, '../locales'];

export function main(ctx: Context) {
  ctx.command('help [...command] - helper.descr.help').action((data, session) => {
    const filterResult: Command['meta'][] = [];
    const args = (data.args as string[]).join('');
    ctx[Symbols.command].forEach((command) => {
      if (
        command.meta.root.startsWith(args) ||
        command.meta.alias.filter((alias) => alias.startsWith(args)).length > 0
      ) {
        filterResult.push(command.meta);
      }
    });
    if (filterResult.length <= 0) return 'helper.msg.descr.fail';
    let commands = '';
    filterResult.forEach((command) => {
      const cmd = command;
      const alias =
        cmd.alias.length > 0
          ? session.format('helper.template.alias', {
              content: cmd.alias.join(session.i18n.locale('helper.template.alias.delimiter'))
            })
          : '';
      let args = '';
      let options = '';
      const handle = (values: Command['meta']['args'] | Command['meta']['options']) => {
        values.forEach((value) => {
          let defaultValue = '';
          if ('rest' in value) {
            const valueType = typeof value.default;
            if (valueType === 'string' || valueType === 'number') {
              defaultValue = session.format('helper.template.default', { content: value.default as string });
            } else if (valueType === 'boolean') {
              defaultValue = session.format('helper.template.default', { content: value.default ? 'true' : 'false' });
            }
            args += session.format(`helper.template.arg.${value.optional ? 'optional' : 'required'}`, {
              name: value.rest ? `...${value.name}` : value.name,
              type: value.type === 'string' ? '' : session.format('helper.template.arg.type', { content: value.type }),
              default: defaultValue
            });
          }
          if (!('realname' in value) || !('description' in value)) return;
          options += session.format('helper.template.option', {
            name: value.name,
            realname: value.realname,
            type: value.type === 'string' ? '' : session.format('helper.template.arg.type', { content: value.type }),
            description: value.description
              ? session.format('helper.template.description', { content: session.i18n.locale(value.description) })
              : ''
          });
        });
      };
      handle(command.args);
      handle(command.options);
      if (options) options = session.format('helper.template.options', { content: options });
      commands += session.format('helper.msg.descr.command', {
        root: `${session.api.adapter.config['command-prefix']}${cmd.root}`,
        args,
        description: cmd.description
          ? session.format('helper.template.description', { content: session.i18n.locale(cmd.description) })
          : '',
        options,
        help: cmd.help ? session.format('helper.template.help', { content: session.i18n.locale(cmd.help) }) : '',
        alias
      });
    });
    return ['helper.msg.help', { content: commands }];
  });
}

export default main;
