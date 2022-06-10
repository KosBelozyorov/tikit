/**
 *
 *@param {playwright page} page
 *@returns {object<{waitVisibility: () => Promise<void>}>
 */

function waits(page) {
  return {
    waitVisibility: selector =>
      page.waitForSelector(selector, { state: 'visible', timeout: 5000 }),
  };
}

module.exports = {
  waits,
};
