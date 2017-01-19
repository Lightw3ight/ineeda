// Constants:
const TS_EXTENSION = '.ts';

// Utilities:
import * as path from 'path';

// Dependencies:
import { parseImports } from './imports/parse-imports';
import { parsePosition } from './stack/parse-position';
import { parseStack } from './stack/parse-stack';
import { Request } from './request';

export const getRequest = { fromImport, fromStack };

function fromImport (currentFilePath: string, name: string): Request {
    let importDescriptions = parseImports(currentFilePath);
    let importDescription = importDescriptions.find(i => i.name === name)
    if (!importDescription) {
        throw new Error(`Could not find an import matching \`${name}\` in "${currentFilePath}"`);
    }

    let importPath = importDescription.path;

    if (importPath.startsWith('.') && !importPath.endsWith(TS_EXTENSION)) {
        importPath = `${importPath}${TS_EXTENSION}`
    }

    return new Request(name, path.resolve(path.dirname(currentFilePath), importPath));
}

function fromStack (): Request {
    let position = parseStack();
    return new Request(parsePosition(position), position.path);
}
