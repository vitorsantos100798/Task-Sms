export async function asyncForEach(array: any[], callback: (row: any, index: number, array: any[]) => void) {
  for (let index = 0; index < array.length; index++) {
    callback(array[index], index, array);
  }
}
