import { hashPassword } from "./hash.js";

const password = "Admin12345";

hashPassword(password)
  .then(hash => {
    console.log("HASH:", hash);
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });