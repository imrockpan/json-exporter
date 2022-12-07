# @byetool/json-exporter

A library that supports exporting json to .xls, .xlsx, .csv, .html, .xml, .json, .txt files in browser.

## Get Started

```js
import exporter from '@byetool/json-exporter'

const data = [
  {
    id: 1,
    title: 'Kinsley High Rise Pop Crop Jeans',
    brand: 'AG',
    price: '$225.00',
  },
  {
    id: 2,
    title: 'Stella Faux Leather Jeans',
    brand: 'PAIGE',
    price: '$229.00',
  },
  {
    id: 3,
    title: 'Rose Jeans',
    brand: 'Wandler',
    price: '$350.00',
  },
]
const filename = 'hello-world'

exporter.toXLSX(data, filename, {
  headers: ['title', 'price', 'brand'],
})
```

## Methods

7 easy-to-use APIs. Sign as below:

```ts
toXLS(data: Obj[], filename: string, options?: Options)
```

- `toXLS` - Export json to .xls file
- `toXLSX` - Export json to .xlsx file
- `toCSV` - Export json to .csv file
- `toHTML` - Export json to .html file
- `toXML` - Export json to .xml file
- `toJSON ` - Export json to .json file
- `toText` - Export json to .txt file

_NOTE: The filename without ext_

## Options

Here are the available options, except headers, other options come from `xlsx` module.

| Param      | Type     | Default  | Description                                          |
| ---------- | -------- | -------- | ---------------------------------------------------- |
| headers    | Header[] | []       | Specify the order and alias of the header, see below |
| dateNF     | string   | 'FMT 14' | Use specified date format in string output           |
| cellDates  | boolean  | false    | Store dates as type `d` (default is `n`)             |
| sheetStubs | boolean  | false    | Create cell objects of type `z` for `null` values    |

## Headers

Some usages of headers.

1.Set order only, e.g.

```js
const options = {
  headers: ['title', 'price', 'brand'],
}
```

2.Set alias for header, e.g.

```js
const options = {
  headers: [
    { name: 'title', alias: 'Title' },
    { name: 'price', alias: 'Price(USD)' },
    { name: 'brand', alias: 'Brand' },
  ],
}
```

3.Choose the fields to output, e.g.

```js
const data = [
  { id: 1, foo: 'hello', bar: 'world' },
  { id: 2, foo: '张三', bar: '李四' },
]

// Output `foo` and `bar` only
const options = {
  headers: ['foo', 'bar'],
}
```

## Other reference

This module is used in [Tapicker](https://www.tapicker.com/) and works fine.

![tapicker](https://github.com/ibyetool/json-exporter/raw/main/images/tapicker.png)
