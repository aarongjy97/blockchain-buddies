const prefixes = {
  revert: "revert ",
  outOfGas: "out of gas ",
};

function parseError(error, message) {
  const msg = error.message;

  if (msg.split(prefixes.revert).length == 2) {
    return { message: message, reason: msg.split(prefixes.revert)[1] };
  } else {
    return { message: message, reason: msg };
  }
}

module.exports = parseError;
