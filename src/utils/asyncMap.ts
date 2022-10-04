export async function asyncMap(array: any[], callback: (row: any, index: number, callbackArray: any[]) => void) {
  const promises = array.map(callback);
  return Promise.all(promises);
}
