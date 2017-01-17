/* eslint-disable */
import XLSX from 'xlsx'
import _ from 'lodash'
export default {
    read (file, readCells, toJson, handler) {
        let obj = {}
        this.initialFile(obj, file, readCells, toJson, handler)
        return obj
    },
    initialFile (obj, file, readCells, toJson, handler) {
        let reader = new FileReader()
        reader.onload = (e) => {
            const data = e.target.result
            const workbook = XLSX.read(data, {
                type: 'binary'
            })
            // Object.assign(obj, {
            //   sheets: this.parseWorkbook(workbook, readCells, toJson)
            // })
            obj.sheets = this.parseWorkbook(workbook, readCells, toJson)
            console.log(obj)
            handler(obj)

            // obj.sheets = this.parseWorkbook(workbook, readCells, toJson)
        }
        reader.readAsBinaryString(file)
    },
    parseWorkbook (workbook, readCells, toJson) {
        if (toJson === true) {
            return this.to_json(workbook)
        }
        const sheets = {}
        _.forEachRight(workbook.SheetNames, (sheetName) => {
            let sheet = workbook.Sheets[sheetName]
            sheets[sheetName] = this.parseSheet(sheet, readCells);
    })
        return sheets
    },
    parseSheet (sheet, readCells) {
        if (sheet['!ref'] === undefined) {
            return []
        }

        const range = XLSX.utils.decode_range(sheet['!ref'])
        const sheetData = []
        if (readCells === true) {
            _.forEachRight(_.range(range.s.r, range.e.r + 1), (row) => {
                const rowData = []
                _.forEachRight(_.range(range.s.c, range.e.c + 1), (column) => {
                const cellIndex = XLSX.utils.encode_cell({
                    'c': column,
                    'r': row
                })
                const cell = sheet[cellIndex]
                rowData[column] = cell ? cell.v : undefined
            })
            sheetData[row] = rowData
        })
        }
        return {
            'data': sheetData,
            'name': sheet.name,
            'col_size': range.e.c + 1,
            'row_size': range.e.r + 1
        }
    },
    to_json (workbook) {
        const result = {}
        workbook.SheetNames.forEach((sheetName) => {
            let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName])
            if (roa.length > 0) {
            result[sheetName] = roa
        }
    });
        return result;
    }
}
