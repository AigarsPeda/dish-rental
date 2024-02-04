/**
 * @param classes - A list of class names to be joined
 * @returns A string of class names
 * @example
 * classNames("foo", "bar") // "foo bar"
 * classNames("foo", undefined, "bar") // "foo bar"
 * */
const classNames = (...classes: (string | boolean | undefined)[]) => {
  if (!classes) return undefined;

  return classes.filter(Boolean).join(" ");
};

export default classNames;
