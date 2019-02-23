// Include prompt module.
const prompt = require('prompt');

// This json object is used to configure what data will be retrieved from command line.
const prompt_attributes = [
  {
        // The fist input text is assigned to username variable.
    name: 'username',
        // The username must match below regular expression.
    validator: /^\S/,
        // If username is not valid then prompt below message.
    warning: 'Username is not valid, it can only contains letters, spaces, or dashes',
  },
];

// Start the prompt to read user input.
prompt.start();

// Prompt and get user input then display those data in console.
prompt.get(prompt_attributes, (err, result) => {
  if (err) {
    console.log(err);
    return 1;
  }
  console.log('Command-line received data:');

        // Get user input from result object.
  const username = result.username;
  const password = result.password;
  const email = result.email;
  const message = `  Username : ${username} , Password : ${password} , Email : ${email}`;

        // Display user input in console log.
  console.log(message);
  console.log(result.number);
});
