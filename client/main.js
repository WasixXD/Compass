import inquirer from "inquirer";
import { program } from "commander"
import terminalLink from "terminal-link"
const url = "https://compass-h5gl.onrender.com/"


program
  .command("login")
  .description("Auth your account")

  .action(async (str, options) => {
    let { name, pass } = await inquirer.prompt([{
      type: "input",
      message: "Enter your name:",
      name: "name",

    }, {
      type: "password",
      message: "Enter your password:",
      mask: "*",
      name: "pass"
      }])


    const request = await fetch(url + `user?name=${name}&pass=${pass}`)
    const response = await request.json()
  
    if(terminalLink.isSupported) {
      const link = terminalLink("Now open this link", url)
    } else {
      console.log("Now, open this link on your browser:", url +"auth/"+ response)
      const inter = setInterval(async () => {
        const auth = await fetch(`${url}authed/${response}`)
        const { verify } = await auth.json()
        
        if(verify) {
          clearInterval(inter)
          console.log("Account authed")
        }
      },1000)  
    }

  
  })

program.parse()
