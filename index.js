#!/usr/bin/env node

const commander = require('commander')
const chalk = require('chalk')
const fse = require('fs-extra')
const os = require('os')
const path = require('path')

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




 
  if(projectName){
    
    createApp(
      projectName
    )


  }  // 没有项目名字情况


  function createApp(appName){

    const packageJson = {
      name: appName,
      version: '0.1.0',
      private: true,
    };

    /**isValidName */
    const originDir = process.cwd()
    const root = path.resolve(projectName)
    fse.ensureDirSync(projectName)
    fse.writeFileSync(
      path.join(root, 'package.json'), 
      JSON.stringify(packageJson, null, 2) + os.EOL
    )
  }

  console.log(projectName, process.argv)

