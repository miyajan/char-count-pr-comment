import * as core from "@actions/core";
import * as github from "@actions/github";
import * as glob from "@actions/glob";
import * as fs from "fs";
import * as path from "path";

export async function run(): Promise<void> {
  try {
    const token = core.getInput("token");
    const files = core.getInput("files");
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;
    const issueNumber = github.context.issue.number;
    const octokit = github.getOctokit(token);

    const cwd = process.cwd();
    const globber = await glob.create(files);
    const filePaths = await globber.glob();
    let total = 0;
    const rows = ["| File | Number of characters |", "| --- | ---: |"];
    for (const filePath of filePaths) {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        core.setFailed(`${filePath} is not a file`);
        return;
      }
      const content = await fs.promises.readFile(filePath, "utf8");
      const relativePath = path.relative(cwd, filePath);
      const charCount = content.length;
      rows.push(`| ${relativePath} | ${charCount} |`);
      total += charCount;
    }
    rows.push(`| Total | ${total} |`);
    const body = rows.join("\n");

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

(async () => {
  await run();
})();
