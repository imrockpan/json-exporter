import { utils, WorkSheet, BookType, writeFile } from 'xlsx'
import { saveAs } from 'file-saver'
import xml from './xml'

export interface Obj {
  [key: string]: any
}

export type Header = string | { name: string; alias: string }

export interface Options {
  headers?: Header[]
  skipHeader?: boolean
  dateNF?: string
  cellDates?: boolean
  sheetStubs?: boolean
  nullError?: boolean
}

/**
 * Normalize headers
 * @param headers headers of user
 */
function normalizeHeaders(headers: Header[]) {
  const aliasHeaders: string[] = []
  const keyHeaders: string[] = []

  if (Array.isArray(headers)) {
    for (const header of headers) {
      if (typeof header === 'string') {
        aliasHeaders.push(header)
        keyHeaders.push(header)
      } else {
        aliasHeaders.push(header.alias)
        keyHeaders.push(header.name)
      }
    }
  }

  return { aliasHeaders, keyHeaders }
}

/**
 * convert an array of objects to array of arrays
 * @param data source data
 * @param headers user headers
 */
function aoo2aoa(data: Obj[], headers: Header[]): any[][] {
  const { aliasHeaders, keyHeaders } = normalizeHeaders(headers)
  const aoa = [aliasHeaders]

  for (const item of data) {
    const row = []
    for (const key of keyHeaders) {
      row.push(item[key])
    }
    aoa.push(row)
  }

  return aoa
}

/**
 * transform data by headers
 * @param data source data
 * @param headers user headers
 */
function transformData(data: Obj[], headers: Header[]): Obj[] {
  const { aliasHeaders, keyHeaders } = normalizeHeaders(headers)
  const aoo = []

  for (const item of data) {
    const row = {}
    for (const [index, key] of keyHeaders.entries()) {
      row[aliasHeaders[index]] = item[key]
    }
    aoo.push(row)
  }

  return aoo
}

/**
 * json to json line
 * @param data source data
 */
function toJSONLine(data: Obj[]) {
  let text = ''
  for (const item of data) {
    text += `${JSON.stringify(item)}\n`
  }
  return text
}

/**
 * Export sheet to file
 * @param ws A work sheet that created by *_to_sheet() api
 * @param filename file name without ext
 * @param type book type of xlsx
 */
function exportSheet(ws: WorkSheet, filename: string, type: BookType) {
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws)
  writeFile(wb, `${filename}.${type}`, {
    type: 'binary',
    bookType: type,
  })
}

/**
 * Export data to .xls file
 * @param data source data
 * @param filename file name without ext
 * @param options options
 */
export function toXLS(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers, ...xlsxOptions } = options
  let ws = null

  if (headers && headers.length > 0) {
    ws = utils.aoa_to_sheet(aoo2aoa(data, headers), xlsxOptions)
  } else {
    ws = utils.json_to_sheet(data, xlsxOptions)
  }

  exportSheet(ws, filename, 'xls')
}

/**
 * Export data to .xlsx file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toXLSX(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers, ...xlsxOptions } = options
  let ws = null

  if (headers && headers.length > 0) {
    ws = utils.aoa_to_sheet(aoo2aoa(data, headers), xlsxOptions)
  } else {
    ws = utils.json_to_sheet(data, xlsxOptions)
  }

  exportSheet(ws, filename, 'xlsx')
}

/**
 * Export data to .csv file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toCSV(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers, ...xlsxOptions } = options
  let ws = null

  if (headers && headers.length > 0) {
    ws = utils.aoa_to_sheet(aoo2aoa(data, headers), xlsxOptions)
  } else {
    ws = utils.json_to_sheet(data, xlsxOptions)
  }

  exportSheet(ws, filename, 'csv')
}

/**
 * Export data to .html file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toHTML(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers, ...xlsxOptions } = options
  let ws = null

  if (headers && headers.length > 0) {
    ws = utils.aoa_to_sheet(aoo2aoa(data, headers), xlsxOptions)
  } else {
    ws = utils.json_to_sheet(data, xlsxOptions)
  }

  exportSheet(ws, filename, 'html')
}

/**
 * Export data to .xml file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toXML(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers } = options
  const { aliasHeaders, keyHeaders } = normalizeHeaders(headers)
  const content = xml.render(data, { aliasHeaders, keyHeaders })

  saveAs(
    new Blob([content], { type: 'application/xml;charset=utf-8' }),
    `${filename}.xml`
  )
}

/**
 * Export data to .json file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toJSON(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers } = options

  if (headers && headers.length > 0) {
    data = transformData(data, headers)
  }

  const prettyJson = JSON.stringify(data, null, '  ')

  saveAs(
    new Blob([prettyJson], { type: 'application/json;charset=utf-8' }),
    `${filename}.json`
  )
}

/**
 * Export data to .txt file
 * @param data data to save
 * @param filename file name without ext
 * @param options options
 */
export function toText(
  data: Obj[],
  filename: string,
  options: Options = { headers: [] }
) {
  const { headers } = options

  if (headers && headers.length > 0) {
    data = transformData(data, headers)
  }

  const jsonLine = toJSONLine(data)

  saveAs(
    new Blob([jsonLine], { type: 'text/plain;charset=utf-8' }),
    `${filename}.txt`
  )
}

const Exporter = {
  toXLS,
  toXLSX,
  toCSV,
  toHTML,
  toXML,
  toJSON,
  toText,
}

export default Exporter
