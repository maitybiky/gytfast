#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const { frames } = require("./animationframes.js");
const fs = require("fs");
const directoryPath = process.cwd();
//!? handling command argument
const args = process.argv.slice(2);
const commit_message = args[0];
const brach_name = args[1];
const files = args.slice(2);
const command_name = "git";

//? if neccessery argument provided then continue
if (args.length >= 3) {
  programIntro();
} else {
  console.log(
    changeTextColor("Please provide all three necessary arguments: ", 33)
  );
  console.log("");
  console.warn(
    changeTextColor(
      "gytfast <commit_message_inside_''> <brach_name> <files)>",
      32
    )
  );
  console.log("");
  console.info("Example:  gytfast 'design completed..' main .");
}

// program intro in terminal

function programIntro(currentfiles) {
  console.log(changeTextColor(`Commit message     : ${commit_message}`, 35));
  console.log(changeTextColor(`Brach name         : ${brach_name}`, 35));
 


  gitAdd(); //? initiating git add command
 
}

//!? Tracking Changes
function gitAdd() {
  const git_add = spawn(command_name, ["add", ...files]);
  handle_child_process(git_add, (callback) => {
    console.log(changeTextColor("Changes staged \u2714", 32));
    //? showing git status before commite
    console.log(changeTextColor(`[git status]`, 36));
    const gitstat = spawn(command_name, ["status"]);
    handle_child_process(gitstat, () => {
      console.log("");
      commit(); //? initiaing git commit command
    });
   
  });
}

//!? Commiting Changes
const commit = () => {
  console.log(changeTextColor("Commiting...",35));
  const git_commit = spawn(command_name, ["commit", "-m", commit_message]);

  handle_child_process(git_commit, (callback) => {
    // ? callback is an error status . initially false but if there nothing to commit , work tree cleaned then it will be true
    if (!callback) { 
      console.log(changeTextColor("Changes Committed! \u2714", 32));
    } else {
      console.log(
        changeTextColor(
          `Work tree clean in ${path.basename(directoryPath)}`,
          33
        )
      );
    }
    push(); //? initiating push command
  });
};

//!? Push Commit

const push = () => {
  const loadingAnimation = showLoadingAnimation();
  console.log("");
  const git_push = spawn(command_name, ["push", "origin", brach_name]);
  handle_child_process(git_push, (callback) => {
    stopLoading(loadingAnimation);
  });
};

//!? Handling child process

function handle_child_process(child, callback) {
  // listens for the standard output (stdout) of the child process
  let ERR_CODE = false; // this varible will be true if staged files already commited and send in call back 
  child.stdout.on("data", (data) => {
    if (data.includes("working tree clean")) ERR_CODE = true;

    //This will filter the line where file name and modifcation type shown  and remove extraa suggestion message from git because this will be done auto later
    if (("child.argv", child.spawnargs[1] == "status")) {
      const lines = `${data}`.split("\n");
      let trimmedLine = lines.map((it) => it.trim());
      const modifiedLines = trimmedLine.filter(
        (line) => !(line[0] == "(" && line[line.length - 1] == ")")
      );
      modifiedLines.forEach((lines) => console.log(lines));
    } else {
      console.log(`${data}`);
    }
  });

  // listens for the standard err of the child process
  child.stderr.on("data", (data) => {
    if (data.includes("up-to-date")) {
      callback(true);
      ERR_CODE = true;
    }

    console.error(`
 :  ${data}`);

 //checking pushed succeced or not 
 if (child.spawnargs[1] == "push") {
    if (`${data}`.includes(`${brach_name} -> ${brach_name}`)) {
      console.log(
        changeTextColor(`Changes pushed to ${brach_name} \u2714`, 32)
      );
    } else {
    
        console.log(
          changeTextColor("seems failed to push check above message", 31)
        );
      }
    }
  });

  // Listen for 'error' event from the child process
  child.on("error", (error) => {
    console.error(`git error: ${error}`);
    callback(true);
    ERR_CODE = true;
  });

  // Listen for 'close' event from the child process
  child.on("close", (code) => {
    // console.log(`Child process exited with code ${code}`);
    callback(ERR_CODE);
  });
}

//!? Loading Animation 
function showLoadingAnimation() {
  // const frames = [`(-(-_(-_-)_-)-)`, `-(_(-_(-)_-)_)-`];
  // const frames=["+","x"]

  let currentFrameIndex = 0;

  const animation = setInterval(() => {
    process.stdout.clearLine(); // Clear the current line
    process.stdout.cursorTo(0); // Move cursor to beginning of line
    process.stdout.write(
      changeTextColor(
        `Pushing... to ${brach_name}      ${frames[currentFrameIndex]}`,
        getRandomInt(35, 36)
      )
    );

    currentFrameIndex = (currentFrameIndex + 1) % frames.length;
  }, 150);

  return animation; // Return the interval ID so you can clear it later
}

// Loading stop
function stopLoading(loadingAnimation) {
  clearInterval(loadingAnimation); // Clear the animation interval
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}
//!Extraa
function changeTextColor(text, colorCode) {
  return `\x1b[${colorCode}m${text}\x1b[0m`; // Reset color after the text
}

function getRandomInt(a, b) {
  const min = Math.ceil(a);
  const max = Math.floor(b);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
