const chalk = require('chalk');
const boxen = require('boxen');

const log = console.log;

const logger = {
  info: (...args) => log(...args),
  error: (...args) => log(chalk.bold.red(...args)),
  warning: (...args) => log(chalk.yellow(...args)),
  success: (...args) => log(chalk.green(...args)),
  line: () => log('********************************************************'),
  header: (...args) => log(boxen(...args, { padding: 1, borderStyle: 'double' })),
  section: (...args) => log(chalk.underline(...args)),
}

module.exports = logger;
