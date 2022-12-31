/**
 * Function to shorten a wallet address
 * @param {string} address Address to shorten
 * @param {string} length Length either side of the ellipses
 * @return {string} Shortened address
 */
export function shortenAddress(address, length = 5) {
  if (address) {
    return address.substring(0, length) + '...' + address.substring(address.length - length);
  } else {
    return 'Unknown';
  }
}
