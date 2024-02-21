/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Dedicated app for output visualization: https://codesandbox.io/p/sandbox/zen-smoke-vxgs2c
 * Just copy the generated content of 'cso_test_log.json' into the 'data.json' file in the dedicated app
 * */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Command line parameters handling
const args = process.argv.slice(2);
const params = {};

args.forEach((arg) => {
  const [argName, argValue] = arg.split('=');
  params[argName] = argValue;
});

// Initiating output, regex line matching, file extensions and output directory
const testsLogOutput = [];
const regex = /\b(?:describe\.skip|describe|it\.skip|it)\(['`]/;
const allowedExtensions = ['.ts', '.tsx', '.test.ts', '.test.tsx'];
const outputDir = params['--outputDir'] || __dirname;

// Directories to iterate over
const FTR_SERVERLESS =
  'x-pack/test_serverless/functional/test_suites/security/ftr/cloud_security_posture';
const FTR_API_INTEGRATION = 'x-pack/test/api_integration/apis/cloud_security_posture';
const FTR_CSP_API = 'x-pack/test/cloud_security_posture_api';
const FTR_CSP_FUNCTIONAL = 'x-pack/test/cloud_security_posture_functional';
const UNIT_TEST_CSP = 'x-pack/plugins/cloud_security_posture';

const directoryPaths = [
  FTR_SERVERLESS,
  FTR_API_INTEGRATION,
  FTR_CSP_API,
  FTR_CSP_FUNCTIONAL,
  UNIT_TEST_CSP,
];

// Utilities
const toIdFormat = (text) => text.toLowerCase().replace(/\s+/g, '-');

const getCleanLine = (line) => {
  const cleanLine = line;

  if (cleanLine.includes('// ')) {
    return cleanLine.replace('// ', '');
  }

  if (cleanLine.includes("', ")) {
    return cleanLine.split("', ")[0] + "')";
  }
  if (cleanLine.includes('`, ')) {
    return cleanLine.split('`, ')[0] + '`)';
  }

  return cleanLine;
};

const getTags = (filePath, testSuits) => {
  const tags = [];

  if (
    filePath.startsWith(FTR_SERVERLESS) ||
    filePath.startsWith(FTR_API_INTEGRATION) ||
    filePath.startsWith(FTR_CSP_API) ||
    filePath.startsWith(FTR_CSP_FUNCTIONAL)
  ) {
    tags.push('FTR');
  }

  if (filePath.startsWith(FTR_API_INTEGRATION) || filePath.startsWith(FTR_CSP_API)) {
    tags.push('API INTEGRATION');
  }

  if (filePath.startsWith(UNIT_TEST_CSP)) {
    tags.push('UT');
  }

  if (testSuits.some((suit) => suit.isSkipped)) {
    tags.push('HAS SKIP');
  }

  if (testSuits.some((suit) => suit.isTodo)) {
    tags.push('HAS TODO');
  }

  return tags;
};

// Creates a nested object to represent test hierarchy, useful to understand skip scope
const createTree = (testSuits) => {
  const tree = [];
  let currentIndent = 0;
  let currentNode = { children: tree };
  const stack = [currentNode];

  const suits = JSON.parse(JSON.stringify(testSuits));

  suits.forEach((suit) => {
    while (suit.indent < currentIndent && stack.length > 1) {
      stack.pop();
      currentNode = stack[stack.length - 1];
      currentIndent -= 2;
    }

    if (suit.indent >= currentIndent) {
      const newNode = { ...suit };
      if (!currentNode.children) {
        currentNode.children = [];
      }
      currentNode.children.push(newNode);
      stack.push(newNode);
      currentNode = newNode;
      currentIndent = suit.indent + 2;
    }
  });

  // Mark higher-level indents as skipped when a lower-level indent is skipped
  const markSkipped = (node, isParentSkipped) => {
    if (isParentSkipped) {
      node.isSkipped = true;
    }
    if (node.children) {
      node.children.forEach((child) => {
        markSkipped(child, isParentSkipped || node.isSkipped);
      });
    }
  };

  tree.forEach((node) => {
    markSkipped(node, false);
  });

  return tree;
};

// Processes each line in a file, extracts relevant test data, and adds it to the output
const processFile = (filePath) => {
  const testSuits = [];
  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  // Extracts relevant data from the matched line and adds it to the testSuits array
  rl.on('line', (rawLine) => {
    const match = rawLine.match(regex);
    if (match) {
      const [fullMatch] = match;
      const type = fullMatch.startsWith('describe') ? 'describe' : 'it';
      const label = rawLine.trim().replace(/^[^`']*['`]([^'`]*)['`].*$/, '$1');
      const isSkipped = rawLine.includes('.skip(') || rawLine.includes('.skip(`');
      const isTodo = rawLine.includes('todo') || rawLine.includes('TODO');
      const line = getCleanLine(rawLine);
      const indent = (line.match(/^\s*/) || [''])[0].length;

      testSuits.push({
        id: toIdFormat(label),
        rawLine,
        line,
        label,
        indent,
        type,
        isSkipped,
        isTodo,
      });
    }
  });

  // After processing all lines in a file, adds an object containing the file details and its test suits to the output
  rl.on('close', () => {
    if (testSuits.length) {
      const logData = {
        filePath,
        fileName: path.basename(filePath),
        directory: directoryPaths.find((dir) => filePath.startsWith(dir)),
        tags: getTags(filePath, testSuits),
        lines: testSuits.map((testSuit) => (testSuit ? getCleanLine(testSuit.rawLine) : null)),
        testSuits,
        tree: createTree(testSuits),
      };

      testsLogOutput.push(logData);
    }

    // Writes the output to a JSON file
    const testsLogOutputFilePath = path.join(outputDir, 'csp_test_log.json');
    fs.writeFileSync(testsLogOutputFilePath, JSON.stringify(testsLogOutput, null, 2));
  });
};

// Recursively iterates over the files of the provided directories
const processDirectory = (directoryPath) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${directoryPath}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error reading file stats: ${filePath}`);
          return;
        }

        if (stats.isDirectory()) {
          processDirectory(filePath);
        } else if (stats.isFile() && allowedExtensions.some((ext) => filePath.endsWith(ext))) {
          processFile(filePath);
        }
      });
    });
  });
};

// Initiates the processing for each directory
directoryPaths.forEach(processDirectory);

process.on('exit', () => {
  if (testsLogOutput.length) {
    const mdFilePath = path.join(outputDir, 'requirements_test_coverage.md');
    generateMDFile(testsLogOutput, mdFilePath);
    console.log(`Markdown file generated successfully: ${mdFilePath}`);

    console.log(`
  🌟 Success! CSP Test Log Generated ✨

  📄 Log file: file://${path.resolve(path.join(outputDir, 'csp_test_log.json'))}

  📊 Copy its content to the dedicated app's "data.json" for visualization.

  🚀 Dedicated app: https://codesandbox.io/p/sandbox/zen-smoke-vxgs2c

  🅫 MD file: file://${path.resolve(path.join(outputDir, 'requirements_test_coverage.md'))}
`);
  }
});

/**
 * Creating the Requirement Test Coverage ReadMe file
 * */

// Utility function to count nested tests isSkipped and isTodo states
const countNestedTests = (tree) => {
  return tree.reduce(
    (counts, node) => {
      counts.totalTests += 1;
      counts.skippedTests += node.isSkipped ? 1 : 0;
      counts.todoTests += node.isTodo ? 1 : 0;

      if (node.children) {
        const childCounts = countNestedTests(node.children);
        counts.totalTests += childCounts.totalTests;
        counts.skippedTests += childCounts.skippedTests;
        counts.todoTests += childCounts.todoTests;
      }

      return counts;
    },
    { totalTests: 0, skippedTests: 0, todoTests: 0 }
  );
};

// Group test files by directory
const groupTestsByDirectory = (testLogs) => {
  const groupedTests = {};

  testLogs.forEach((testLog) => {
    const directory = testLog.directory;
    if (!groupedTests[directory]) {
      groupedTests[directory] = [];
    }
    groupedTests[directory].push(testLog);
  });

  return groupedTests;
};

const tagColors = {
  FTR: 'blue',
  UT: 'brightgreen',
  'HAS SKIP': 'yellow',
  'HAS TODO': 'green',
  'API INTEGRATION': 'purple',
};

// Creates the MD content and write into file
const generateMDFile = (testLogs) => {
  const groupedTests = groupTestsByDirectory(testLogs);
  let mdContent = '# Cloud Security Posture - Requirements Test Coverage\n\n';

  Object.entries(groupedTests)
    .sort()
    .forEach(([directory, logs]) => {
      logs.sort((a, b) => testLogs.indexOf(a) - testLogs.indexOf(b));

      const { totalTests, skippedTests, todoTests } = countNestedTests(
        logs.flatMap((log) => log.tree)
      );

      const skippedPercentage = ((skippedTests / totalTests) * 100).toFixed(2);
      const todoPercentage = ((todoTests / totalTests) * 100).toFixed(2);

      const tagsBadges = logs
        .flatMap((log) => log.tags || [])
        .map(
          (tag) => `![](https://img.shields.io/badge/${tag.replace(/\s+/g, '-')}-${tagColors[tag]})`
        );
      const uniqueTags = [...new Set(tagsBadges)];
      const tagsSection = uniqueTags.length > 0 ? `${uniqueTags.join(' ')}\n\n` : '';

      mdContent += `## Directory: ${directory}\n\n`;
      mdContent += `**Total Tests:** ${totalTests} | **Skipped:** ${skippedTests} (${skippedPercentage}%) | **Todo:** ${todoTests} (${todoPercentage}%)\n\n`;
      mdContent += tagsSection;
      mdContent += '<details>\n<summary>Test Details</summary>\n\n';
      mdContent += '| Test Label | Type | Skipped | Todo |\n';
      mdContent += '|------------|------|---------|------|\n';

      const generateTableFromTree = (tree, filePath) => {
        tree.forEach((node) => {
          mdContent += `| [${node.label}](${filePath}) | ${node.type} | ${
            node.isSkipped ? '![](https://img.shields.io/badge/skipped-yellow)' : ''
          } | ${node.isTodo ? '![](https://img.shields.io/badge/todo-green)' : ''} |\n`;

          if (node.children) {
            generateTableFromTree(node.children, filePath);
          }
        });
      };

      logs.forEach((log) => {
        generateTableFromTree(log.tree, log.filePath);
      });

      mdContent += '</details>\n\n';
    });

  fs.writeFileSync(path.join(outputDir, 'requirements_test_coverage.md'), mdContent);
};
