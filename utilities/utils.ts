export enum OperatingSystems {
  Android = "android",
  IOS = "ios",
}

export const chunkArrayInGroups = (array: unknown[], size: number) => {
  let temp = [];
  const result = [];

  for (let a = 0; a < array.length; a++) {
    if (a % size !== size - 1) temp.push(array[a]);
    else {
      temp.push(array[a]);
      result.push(temp);
      temp = [];
    }
  }

  if (temp.length !== 0) result.push(temp);
  return result;
};
