#!/usr/bin/env node

const commander = require('commander')
const chalk = require('chalk')
const fse = require('fs-extra')
const os = require('os')
const path = require('path')

const packageJson = require('./package.json')

let projectName;
const defaultBrowsers = [
  '>0.2%',
  'not dead',
  'not ie <= 11',
  'not op_mini all',
];


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

    /**TODO: isValidName */
    const originDir = process.cwd()
    const appPath = path.resolve(projectName)

    // 改变node process 执行目录  

    fse.ensureDirSync(projectName)
    fse.writeFileSync(
      path.join(appPath, 'package.json'), 
      JSON.stringify(packageJson, null, 2) + os.EOL
    ) 

    init(
      appPath
    )


  }


  //1 write package.json
  //2 copy temp to destination

  function init(appPath) {
    const appPackagePath = path.join(appPath, 'package.json')
    const appPackage = require(appPackagePath)

    appPackage.dependencies = appPackage.dependencies || {}
    appPackage.browserslist = defaultBrowsers
    appPackage.eslintConfig = {
      extends: 'react-app',
    };

    // TODO: reademe file ignore 

    fse.writeFileSync(
      appPackagePath,
      JSON.stringify(appPackage, null, 2) + os.EOL
    )

    // dest no temp 
    const tempPath = path.join('.', 'template')
    fse.copySync(tempPath, appPath)

    // try to set .gitignore
    // append if there's already a '.gitigore' file
    try {
      fse.moveSync(
        path.join(appPath, 'gitignore'),
        path.join(appPath, '.gitignore')
      )
    }catch(err) {
      if(err.code === 'EEXIST') {
        const data = fse.readFileSync(path.join(appPath, 'gitignore'))
        fse.appendFileSync(path.join(appPath, '.gitignore'), data)
        fse.unlinkSync(appPath, 'gitignore')
      }else {
        throw err
      }
    }


    // try init git
    // 巴拉巴拉 sucess! ...


    // eject part


    // we may not need jest for now 
    // i am not famliar with jest so just ignore it 
    // const folders = ['config', 'config/jest', 'scripts'];
    const foldersExcludeJest = ['config', 'scripts']
    const ownPath = path.resolve(__dirname, '.')

    // copy folders
    foldersExcludeJest.forEach(
      folder => fse.mkdirSync(
        path.join(appPath, folder)
      )
    )

    // copy files
    const files = foldersExcludeJest.reduce((files, folder)=>{
      return files.concat(
        fse.readdirSync(path.join(ownPath, folder))
        .map(file=>{
          // set full name; ownPath will be replace by appPath
          return path.join(ownPath, folder, file)
        })
        // omit dirs from filters  
        .filter(file=>fse.lstatSync(file).isFile())
      )
      
    },[])

    // write file in correct path
    files.forEach(file=> {
      const content = fse.readFileSync(file, 'utf-8')
      //skip files which is flagged
      if(content.match(/\/\/ @remove-file-on-eject/)) return 
      console.log(`  Addding ${chalk.cyan(file.replace(ownPath, ''))}`)
      fse.writeFileSync(file.replace(ownPath, appPath), content)
    })

    console.log(chalk.green('adding files success!'))



    // Updating the dependencies
    // set scripts




  }

  //console.log(projectName, process.argv)

