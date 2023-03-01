const fs = require('fs');

function openFile() {
  const filename = process.argv[2];
  if (filename) {
    try {
      const fileContent = fs.readFileSync(filename, 'utf-8');
      return fileContent;
    } catch (error) {
      console.error(error);
      return null;
    }
  } else {
    console.log('Usage: node lever.js <filename>');
    console.log('No filename provided');
    process.exit(-1);
  }
}

const anaylyze = (source) => {
  let state = 0;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    switch (state) {
      case 0:
        switch (char) {
          case 'r':
            state = 1;
            break;
          case 'w':
            state = 7;
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  }
};

const source = openFile();
anaylyze(source);
