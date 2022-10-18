export function logError(title: string, err: Error) {
  console.error(`\n---\x1B[34m ${title} Error \x1B[0m---\n`);
  console.error(err);
}
