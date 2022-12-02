import clc from 'cli-color'

export const logBlue = (obj: unknown) => console.log(clc.blue('\n' + obj))
