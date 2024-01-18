type ReplacementRules = { [key: string]: string };

function replaceString(str: string, rules: ReplacementRules): string {
  let result = str;
  for (const [key, value] of Object.entries(rules)) {
    // 使用正则表达式进行全局替换
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result;
}

// 未发现"<>"需要转义，","仅在json的模式下需要转义

const rules: ReplacementRules = {
  "&": "&amp;",
  // "<": "&lt;",
  // ">": "&gt;",
  "\\[": "&#91;",
  "\\]": "&#93;",
  // ",": "&#44;"
};

const reverseRules: ReplacementRules = {
  // "&lt;": "<",
  // "&gt;": ">",
  "&#91;": "[",
  "&#93;": "]",
  // "&#44;": ","
  "&amp;": "&",
};

export function messageSegmentsToString(segments: MessageSegment[]): string {
  return segments.map(segment => segment.type == 'text' ? replaceString(segment.data.text, rules) : `[CQ:${segment.type},${Object.entries(segment.data).map(([key, value]) => `${key}=${replaceString(value as string, Object.assign(rules, segment.type == 'json' ? {",": "&#44;"} : {}))}`).join(',')}]`).join('');
}

export function stringToMessageSegments(str: string): MessageSegment[] {
  const segments: MessageSegment[] = [];
  let currentIndex = 0;

  while (currentIndex < str.length) {
    const cqIndex = str.indexOf('[CQ:', currentIndex);

    if (cqIndex >= 0) {
      if (cqIndex > currentIndex) {
        segments.push({
          type: 'text',
          data: { text: replaceString(str.slice(currentIndex, cqIndex), reverseRules) }
        });
      }

      const endIndex = str.indexOf(']', cqIndex);
      if (endIndex >= 0) {
        const cqContent = str.slice(cqIndex + 4, endIndex);
        const parts = cqContent.split(',');
        const type = parts[0];
        const data = parts.slice(1).reduce<{ [key: string]: string }>((acc, part) => {
          const [key, ...value] = part.split('=');
          acc[key] = replaceString(value.join('='), Object.assign(reverseRules, type == 'json' ? { "&#44;": "," } : {}));
          return acc;
        }, {});

        segments.push({ type, data });

        currentIndex = endIndex + 1;
      } else {
        segments.push({
          type: 'text',
          data: { text: replaceString(str.slice(currentIndex), reverseRules) }
        });
        break;
      }
    } else {
      segments.push({
        type: 'text',
        data: { text: replaceString(str.slice(currentIndex), reverseRules) }
      });
      break;
    }
  }

  return segments.length ? segments : [{ type: 'text', data: { text: '' } }];
}

