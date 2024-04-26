/* eslint-disable prettier/prettier */
/**
 * @param {string} enviroment
 * @returns {string}
 */
function loadEnv(enviroment) {
  return `.env.${enviroment}`;
}

module.exports = loadEnv;
