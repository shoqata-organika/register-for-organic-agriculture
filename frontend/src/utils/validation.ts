export function isValidURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/)?(www\.)[^\s\/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}

export function isValidEmail(arg: string): boolean {
  const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return Boolean(arg.match(mailFormat));
}
