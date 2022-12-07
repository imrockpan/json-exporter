/**
 * escape reserved characters
 * @param value data
 */
function escape(value: any) {
  return String(value)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * count to spaces
 * @param count count of spaces
 */
function toSpaces(count: number) {
  return ' '.repeat(count)
}

function renderXML(
  data: any,
  { tag, props = {}, indent = 0, aliasHeaders = [], keyHeaders = [] }
) {
  if (data == null) {
    return `<${tag} />`
  }

  const spaces = toSpaces(indent)
  let shouldNewLine = true
  let content = ''

  if (Array.isArray(data)) {
    content = data
      .map((item) =>
        renderXML(item, {
          tag: 'row',
          props: {},
          indent: indent + 2,
          aliasHeaders,
          keyHeaders,
        })
      )
      .join('\n')
  } else if (data !== null && typeof data === 'object') {
    if (keyHeaders.length > 0) {
      content = keyHeaders
        .map((key, index) =>
          renderXML(data[key], {
            tag: key,
            props: { name: aliasHeaders[index] },
            indent: indent + 2,
          })
        )
        .join('\n')
    } else {
      content = Object.keys(data)
        .map((item) =>
          renderXML(data[item], {
            tag: item,
            props: {},
            indent: indent + 2,
          })
        )
        .join('\n')
    }
  } else {
    shouldNewLine = false
    content = escape(data)
  }

  const attrs = Object.keys(props)
    .map((item) => ` ${item}="${props[item]}"`)
    .join(' ')

  if (shouldNewLine) {
    return [`${spaces}<${tag}${attrs}>`, content, `${spaces}</${tag}>`].join(
      '\n'
    )
  }

  return [`${spaces}<${tag}${attrs}>`, content, `</${tag}>`].join('')
}

function render(
  data: any[],
  options: { aliasHeaders: string[]; keyHeaders: string[] }
) {
  const DTD = '<?xml version="1.0" encoding="UTF-8"?>'
  const content = renderXML(data, {
    tag: 'rows',
    aliasHeaders: options.aliasHeaders || [],
    keyHeaders: options.keyHeaders || [],
  })

  return [DTD, content].join('\n')
}

export default {
  render,
}
