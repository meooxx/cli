#!/usr/bin/env node

const commander = require('commander')
const chalk = require('chalk')

const packageJson = require('./package.json')

let projectName;

const program =  new commander.Command(packageJson.name)
  .version(packageJson.version, '-v, --version')
  .arguments('<project-dir>' )
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action((name, ...rest)=>{ // when command name is specified via argv
    projectName = name
    console.log(rest)
  })
  program.parse(process.argv)

  if(projectName){}  // 没有项目名字情况

  console.log(projectName, process.argv)

