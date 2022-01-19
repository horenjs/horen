/// <reference types="node" />
import { PathLike, Stats } from 'fs';
export declare function readDirAsync(p: string, fileList?: string[]): Promise<string[]>;
export declare function readdirAsync(p: PathLike, opts?: any): Promise<string[]>;
export declare function readFileAsync(p: any): Promise<Buffer>;
export declare function writeFileAsync(p: string, data: any): Promise<unknown>;
export declare function statAsync(p: PathLike, opts?: any): Promise<Stats>;
