export const generateCode = () => {
  // Get current timestamp in milliseconds
  const timestamp = new Date().getTime().toString();

  // Generate a random number 2-digit number
  const randomNum = Math.floor(Math.random() * 90 + 10).toString();

  // Combine timestamp and random number and extract the last 5 digits
  const code = (timestamp + randomNum).slice(-5); // Get the last 5 digits to ensure it's a 5-digit code

  return code;
};
