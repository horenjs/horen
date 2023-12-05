#!/usr/bin/env zx
import path from 'path';

const projectPath = path.resolve(__dirname, '..');

process.env.EE_PROJECT_PATH = projectPath;
process.env.EE_DIST_PATH = path.join(projectPath, 'dist');
process.env.EE_OUT_PATH = path.join(projectPath, 'out');

process.env.EE_PORT = 12345;
process.env.EE_PORT_2 = 12346;
