import { Injectable } from '@nestjs/common';

@Injectable()
export class JustifyTextService {
  
  fullJustify(words: string[], maxWidth: number): string[] {
    let rowLen = 0;
    let pointer = 0;
    let grouped: string[][] = [];
    let result: string[] = [];

    for (let i = 0; i < words.length; i++) {
      if (
        grouped[pointer] &&
        rowLen + words[i].length + grouped[pointer].length > maxWidth
      ) {
        result[pointer] = this.justify(grouped[pointer], maxWidth - rowLen);
        pointer += 1;
        rowLen = 0;
      }

      rowLen += words[i].length;

      grouped?.[pointer]
        ? grouped[pointer].push(words[i])
        : grouped.push([words[i]]);
    }

    result[pointer] = this.justifyLeft(grouped[pointer], maxWidth - rowLen);

    return result;
  }

  private getEmptyString(num: number) {
    let str = '';

    for (let i = 0; i < num; i++) str += ' ';

    return str;
  }

  private justifyLeft = (row: string[], spaces: number): string => {
    return row.join(' ') + this.getEmptyString(spaces - (row.length - 1));
  };

  private justifyCenter(row: string[], spaces: number): string {
    let str = '';
    const lastIdx = row.length - 1;
    const spacesBetweenWords = Array(lastIdx).fill(
      Math.floor(spaces / lastIdx),
    );

    for (let i = 0; i < spaces % lastIdx; i++) {
      spacesBetweenWords[i] += 1;
    }

    for (let i = 0; i < lastIdx; i++) {
      str += row[i] + this.getEmptyString(spacesBetweenWords[i]);
    }

    return str + row[lastIdx];
  }

  private justify = (row: string[], spaces: number): string => {
    return row.length === 1
      ? this.justifyLeft(row, spaces)
      : this.justifyCenter(row, spaces);
  };
}
