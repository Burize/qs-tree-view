export function delay(duration: number) {
  return new Promise((res) => {
    setTimeout(res, duration);
  });
}
