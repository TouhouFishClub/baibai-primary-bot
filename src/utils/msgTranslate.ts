export function messageSegmentsToString(segments: MessageSegment[]): string {
  return segments.map(segment => {
    switch (segment.type) {
      case 'text':
        return segment.data.text;
      case 'at':
        return `[CQ:at,qq=${segment.data.qq}]`;
      case 'image':
        return `[CQ:image,file=${segment.data.file},subType=${segment.data.subType},url=${segment.data.url}]`;
      default:
        return `[CQ:${segment.type},${Object.entries(segment.data).map(([key, value]) => key == 'type' ? null : `${key}=${value}`).filter(x => x).join(',')}]`;
    }
  }).join('');
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
          data: { text: str.slice(currentIndex, cqIndex) }
        });
      }

      const endIndex = str.indexOf(']', cqIndex);
      if (endIndex >= 0) {
        const cqContent = str.slice(cqIndex + 4, endIndex);
        const parts = cqContent.split(',');
        const type = parts[0].split(':')[1];
        const data = parts.slice(1).reduce<{ [key: string]: string }>((acc, part) => {
          const [key, value] = part.split('=');
          acc[key] = value;
          return acc;
        }, {});

        segments.push({ type, data });

        currentIndex = endIndex + 1;
      } else {
        segments.push({
          type: 'text',
          data: { text: str.slice(currentIndex) }
        });
        break;
      }
    } else {
      segments.push({
        type: 'text',
        data: { text: str.slice(currentIndex) }
      });
      break;
    }
  }

  return segments;
}

