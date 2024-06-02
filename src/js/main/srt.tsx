const fs = require("fs");

export interface Options {
  removePunctuation: boolean;
}

interface Subtitle {
  index: number;
  start: number;
  end: number;
  text: string;
}

export function modifySrt(path: string, options: Options) {
  fs.readFile(path, "utf-8", (err: any, data: string) => {
    if (err) {
      alert("Error reading the file:" + err.toString());
      return;
    }
    const subtitles = parseSRT(data);

    if (options.removePunctuation) {
      for (let subtitle of subtitles) {
        subtitle.text = subtitle.text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      }
    }

    const modifiedSRT = generateSRT(subtitles);

    fs.writeFile(path, modifiedSRT, "utf-8", (err: any) => {
      if (err) {
        alert("Error writing to file:" + err.toString());
        return;
      }
    });
  });
}

function parseSRT(content: string): Subtitle[] {
  const lines = content.split(/\r?\n/);
  const subtitles: Subtitle[] = [];
  let subtitle: Partial<Subtitle> = {};
  let indexFlag = true;

  const timecodeRegex =
    /(\d{2}):(\d{2}):(\d{2}),(\d{3}) --> (\d{2}):(\d{2}):(\d{2}),(\d{3})/;
  const emptyLineRegex = /^\s*$/;

  lines.forEach((line, index) => {
    if (indexFlag && !isNaN(parseInt(line, 10))) {
      subtitle.index = parseInt(line, 10);
      indexFlag = false;
    } else if (timecodeRegex.test(line)) {
      const matches = line.match(timecodeRegex);
      if (matches) {
        subtitle.start = timestampToMs(matches[1], matches[2], matches[3], matches[4]);
        subtitle.end = timestampToMs(matches[5], matches[6], matches[7], matches[8]);
      }
    } else if (emptyLineRegex.test(line)) {
      if (subtitle.text) {
        subtitles.push(subtitle as Subtitle);
        subtitle = {};
        indexFlag = true;
      }
    } else {
      subtitle.text = subtitle.text ? `${subtitle.text}\n${line}` : line;
    }
  });

  if (subtitle.text) {
    subtitles.push(subtitle as Subtitle);
  }

  return subtitles;
}

function generateSRT(subtitles: Subtitle[]): string {
  return subtitles
    .map((subtitle) => {
      const start = msToTimestamp(subtitle.start);
      const end = msToTimestamp(subtitle.end);
      return `${subtitle.index}\n${start} --> ${end}\n${subtitle.text}`;
    })
    .join("\n\n");
}

function msToTimestamp(ms: number): string {
  const hours = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(ms % 1000).padStart(3, "0");
  return `${hours}:${minutes}:${seconds},${milliseconds}`;
}

function timestampToMs(
  hours: string,
  minutes: string,
  seconds: string,
  milliseconds: string
): number {
  return (
    parseInt(hours, 10) * 3600000 +
    parseInt(minutes, 10) * 60000 +
    parseInt(seconds, 10) * 1000 +
    parseInt(milliseconds, 10)
  );
}
