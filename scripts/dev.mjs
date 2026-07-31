import { spawn } from 'node:child_process';

const forwarded = process.argv.slice(2);
const args = ['dev'];

for (let index = 0; index < forwarded.length; index += 1) {
  const argument = forwarded[index];

  if (argument === '--host') {
    args.push('--hostname');
    continue;
  }

  if (argument === '--strictPort') {
    continue;
  }

  args.push(argument);
}

const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', ...args], {
  stdio: 'inherit'
});

next.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
