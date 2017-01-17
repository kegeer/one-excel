/* eslint-disable */
import { default as XReader } from '../utils/xlsx-reader'
import { isEmpty } from 'lodash'
export const readFile = (file, readCells, toJson) => {
    return new Promise(function(resolve) {
        XReader.read(file, readCells, toJson, (obj) => {
            resolve(obj)
        })
    })
}
