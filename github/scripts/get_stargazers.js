const { Octokit } = require("@octokit/core");
const fs = require('fs')
const request = require('request')

const csvWriter = require('csv-write-stream');
const csvParse = require('csv-parser')

// TODO: Replace the ${TOKEN} to yours
let TOKEN = ""
const octokit = new Octokit({ auth: `${TOKEN}` });


const parse_link_header = header => {
    if (header.length === 0) {
        throw new Error("input must not be of zero length");
    }
    // Split parts by comma
    const parts = header.split(',');
    let links = {};
    // Parse each part into a named link
    for (let i = 0; i < parts.length; i++) {
        const section = parts[i].split(';');
        if (section.length !== 2) {
            throw new Error("section could not be split on ';'");
        }
        const url = section[0].replace(/<(.*)>/, '$1').trim();
        const name = section[1].replace(/rel="(.*)"/, '$1').trim();
        links[name] = url;
    }
    return links;
}

async function fetchStars(owner, repo) {
    const writer = csvWriter({ 'headers': ['login', 'id', 'node_id', 'avatar_url', 'url'] });
    writer.pipe(fs.createWriteStream(`./${repo}-users.csv`));
    console.log('Fetching stargazers');
    const options = {
        method: 'GET',
        url: 'https://api.github.com/repos/{owner}/{repo}/stargazers?per_page=100',
        owner: owner,
        repo: repo,
    }
    function goFetch(users) {
        console.log('fetching ' + options.url)
        return octokit.request(options).then(response => {
            response.data.forEach(element => {
                writer.write(element);
                users.push(element.login);
            });
            if ('link' in response.headers) {
                next_link = parse_link_header(response.headers.link);
                if (next_link.next) {
                    options.url = next_link.next;
                    return goFetch(users);
                }
            }
            return users;
        })
    }
    const res = await goFetch([]);
    writer.end();
    return res;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchFollow(user, kind) {
    console.log(`Fetching ${kind} for ${user}`);
    const writer = csvWriter({ 'headers': ['login', 'id', 'node_id', 'avatar_url', 'url'] });
    writer.pipe(fs.createWriteStream(`./${kind}/${user}.csv`));
    const options = {
        method: 'GET',
        url: 'https://api.github.com/users/{user}/{kind}?per_page=100',
        user: user,
        kind: kind
    }
    function goFetch(users) {
        console.log('fetching ' + options.url)
        return octokit.request(options).then(response => {
            response.data.forEach(element => {
                writer.write(element);
                users.push(element.login);
            });
            if ('link' in response.headers) {
                next_link = parse_link_header(response.headers.link);
                if (next_link.next) {
                    options.url = next_link.next;
                    return goFetch(users);
                }
            }
            return users;
        }, err => {
            console.log(err);
        })
    }
    const res = await goFetch([]);
    writer.end();
    return res;
}


async function simple_get(url) {
    return await octokit.request({
        method: 'GET',
        url: url
    })
}


async function get_rate_limit() {
    const limit_url = "https://api.github.com/rate_limit"
    const response = await simple_get(limit_url)
    console.log(JSON.stringify(response.data.resources.core, null, 4))
}

// Make request each user a sync process,
// or it will reach github secondary limit.
async function doWrite(func, arr, ...args) {
    for (const i of arr) {
        await func(i, ...args);
        // await sleep(600)
    }
}


// let owner = "alibaba"
// let repo = "graphscope"
// let owner = "v6d-io"
// let repo = "v6d"
let owner = "TuGraph-family"
let repo = "tugraph-db"
// let owner = "neo4j"
// let repo = "neo4j"
// let owner = "vesoft-inc"
// let repo = "nebula"

if (process.argv.length > 2) {
    owner = process.argv[process.argv.length - 2];
    repo = process.argv[process.argv.length - 1];
}

async function full_user() {
    const output = [];
    fs.createReadStream(`${repo}-users.csv`)
        .pipe(csvParse({ separator: ',' }))
        .on('data', (data) => {
            output.push(data.login);
        })
        .on('end', () => {
            doWrite(fetchFollow, output, "following");
            doWrite(fetchFollow, output, "followers");
            console.log(`parsed ${output.length} lines of records.`);
        });
}

async function GetU(user, writer) {
    const goFetch = user => {
        console.log(`Fetching ${user}`)
        const options = {
            method: 'GET',
            url: 'https://api.github.com/users/{user}',
            user: user
        }
        return octokit.request(options).then(response => {
            writer.write(response.data);
            return response.data;
        }, async err => {
            console.log(err);
            await sleep(15 * 60 * 1000);
            octokit.request(options).then(response => {
                writer.write(response.data);
                return response.data;
            }, err => {
                console.log(err);
            });
        });
    }
    await goFetch(user)
}

async function GetUsers(repo) {
    const users = [];
    const writer = csvWriter({ 'headers': ['login', 'id', 'node_id', 'avatar_url', 'url', 'name', 'company', 'email', 'location', 'hireable', 'created_at'] });
    writer.pipe(fs.createWriteStream(`./${repo}-users-detailed.csv`));
    fs.createReadStream(`./${repo}-users.csv`)
        .pipe(csvParse({ separator: ',' }))
        .on('data', (data) => {
            users.push(data.login);
        })
        .on("end", async () => {
            doWrite(GetU, users, writer);
        });
}

async function main() {
    await fetchStars(owner, repo).then((users) => {
        console.log(`Done processing ${users.length} users`);
    }).catch(err => {
        console.log('Error', err);
    })
    await get_rate_limit()

    await full_user()
    await get_rate_limit()

    await GetUsers(repo)
    await get_rate_limit()
}

main()


async function fetchRepos(repos) {

    function goFetch(repo, owner) {
        const writer = csvWriter({ 'headers': ['name', 'full_name', 'created_at', 'updated_at', 'homepage', 'stargazers_count', 'watchers_count', 'language', 'forks_count'] });
        const options = {
            method: 'GET',
            url: `https://api.github.com/repos/{owner}/{repo}`,
            repo: repo,
            owner: owner
        }
        console.log('fetching ' + options.url)
        return octokit.request(options).then(response => {
            writer.pipe(fs.createWriteStream(`repos/${repo}.csv`));
            writer.write(response.data);
        });
    }

    let arr;
    for (repo of repos) {
        console.log(repo)
        arr = repo.split("/")
        await goFetch(arr[1], arr[0])
    }
}

async function fetchContributors(repos) {

    function goFetch(repo, owner) {
        const writer = csvWriter({ 'headers': ['login', 'id', 'node_id', 'avatar_url', 'url'] });
        writer.pipe(fs.createWriteStream(`./${repo}-contributors.csv`));
        console.log('Fetching contributors');
        const options = {
            method: 'GET',
            url: 'https://api.github.com/repos/{owner}/{repo}/contributors?per_page=100',
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        }
        function goFetch2(users) {
            console.log('fetching ' + options.url)
            return octokit.request(options).then(response => {
                response.data.forEach(element => {
                    writer.write(element);
                    users.push(element.login);
                });
                if ('link' in response.headers) {
                    next_link = parse_link_header(response.headers.link);
                    if (next_link.next) {
                        options.url = next_link.next;
                        return goFetch(users);
                    }
                }
                return users;
            })
        }
        goFetch2([]);
    }

    let arr;
    for (repo of repos) {
        console.log(repo)
        arr = repo.split("/")
        await goFetch(arr[1], arr[0])
    }
}

async function fetchStarredAt(repos) {
    function goFetch(repo, owner) {
        const writer = csvWriter({'headers': ['login', 'starred_at']});
        writer.pipe(fs.createWriteStream(`./${repo}-starred_at.csv`));
        console.log('Fetching starred_at');
        const options = {
            method: 'GET',
            url: 'https://api.github.com/repos/{owner}/{repo}/stargazers?per_page=100',
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
                'Accept': 'application/vnd.github.star+json'
            }
        }

        function goFetch2(users) {
            console.log('fetching ' + options.url)
            return octokit.request(options).then(response => {
                response.data.forEach(element => {
                    let login = element.user.login
                    writer.write({'login': login, starred_at: element.starred_at});
                    users.push(element.login);
                });
                if ('link' in response.headers) {
                    next_link = parse_link_header(response.headers.link);
                    if (next_link.next) {
                        options.url = next_link.next;
                        return goFetch2(users);
                    }
                }
                return users;
            })
        }
        goFetch2([]);
    }
    let arr;
    for (repo of repos) {
        console.log(repo)
        arr = repo.split("/")
        await goFetch(arr[1], arr[0])
    }
}


async function fetchCommit(repos) {
    function goFetch(repo, owner) {
        const writer = csvWriter({'headers': ['login', 'sha', 'message', 'url', 'html_url', 'date']});
        writer.pipe(fs.createWriteStream(`./${repo}-commits.csv`));
        console.log('Fetching commits');
        const options = {
            method: 'GET',
            url: 'https://api.github.com/repos/{owner}/{repo}/commits?per_page=100',
            owner: owner,
            repo: repo,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            }
        }

        function goFetch2(users) {
            console.log('fetching ' + options.url)
            return octokit.request(options).then(response => {
                response.data.forEach(element => {
                    let login
                    if (element.author != null) {
                        login = element.author.login
                    } else {
                        login = element.commit.author.name
                    }
                    writer.write({'login': login, 'sha': element.sha, 'message': element.commit.message, 'url': element.url, 'html_url': element.html_url, 'date': element.commit.author.date});
                    users.push(element.login);
                });
                if ('link' in response.headers) {
                    next_link = parse_link_header(response.headers.link);
                    if (next_link.next) {
                        options.url = next_link.next;
                        return goFetch2(users);
                    }
                }
                return users;
            })
        }
        goFetch2([]);
    }
    let arr;
    for (repo of repos) {
        console.log(repo)
        arr = repo.split("/")
        await goFetch(arr[1], arr[0])
    }
}


// let owners_repos = ["alibaba/graphscope", "TuGraph-family/tugraph-db", "neo4j/neo4j", "vesoft-inc/nebula", "antvis/G6", "antvis/graphin", "antvis/G6VP"]
let owners_repos = [`${owner}/${repo}`]
fetchRepos(owners_repos)
fetchContributors(owners_repos)
fetchStarredAt(owners_repos)
fetchCommit(owners_repos)