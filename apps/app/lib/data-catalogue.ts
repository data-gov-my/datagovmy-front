import { Octokit } from "@octokit/rest";
import { RequestError as OctokitRequestError } from "@octokit/request-error";
import { isValidBase64 } from "datagovmy-ui/helpers";

const GH_META_REPO_OWNER = "data-gov-my";
const GH_META_REPO_NAME = "datagovmy-meta";
const GH_META_REPO_TARGET_BRANCH = "dev";

const REPO_INFO = {
  owner: GH_META_REPO_OWNER,
  repo: GH_META_REPO_NAME,
};

async function isCollaborator(ghAccessToken: string): Promise<boolean> {
  const octokit = new Octokit({ auth: ghAccessToken });

  const { data: user } = await octokit.rest.users.getAuthenticated();

  try {
    await octokit.rest.repos.checkCollaborator({
      ...REPO_INFO,
      username: user.login,
    });
  } catch (error) {
    if (error instanceof OctokitRequestError && error.status === 404) {
      return false;
    }
    throw error;
  }

  return true;
}

async function openDataCataloguePR(
  ghAccessToken: string,
  fileName: string,
  data: string
): Promise<void> {
  if (!isValidBase64(data)) {
    throw Error("'data' must be in base64");
  }

  const octokit = new Octokit({ auth: ghAccessToken });

  const targetBranch = GH_META_REPO_TARGET_BRANCH;
  const branch = `dc/${Math.floor(Date.now() / 1000)}`;

  const { data: ref } = await octokit.rest.git.getRef({
    ...REPO_INFO,
    ref: `heads/${targetBranch}`,
  });
  const baseSha = ref.object.sha;

  await octokit.rest.git.createRef({
    ...REPO_INFO,
    ref: `refs/heads/${branch}`,
    sha: baseSha,
  });

  const commitMessage = `Automated: Create/update data catalogue '${fileName}'`;
  await octokit.rest.repos.createOrUpdateFileContents({
    ...REPO_INFO,
    path: `data-catalogue/${fileName}`,
    message: commitMessage,
    content: data,
    branch,
  });

  await octokit.rest.pulls.create({
    ...REPO_INFO,
    title: commitMessage,
    head: branch,
    base: targetBranch,
    body: "Auto-generated PR from data.gov.my GUI",
  });
}

export const metaRepo = {
  isCollaborator,
  openDataCataloguePR,
};
