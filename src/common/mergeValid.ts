import _ from 'lodash';

export default function mergeValid(valids: Array<any>) {
  const merge = valids.reduce((acc, cur) => {
    const copyAcc = { ...acc };
    const copyCur = { ...cur };
    return _.mergeWith(copyAcc, copyCur, (objValue: any, srcValue: any) =>
      srcValue ? srcValue : objValue,
    );
  });

  return merge;
}
